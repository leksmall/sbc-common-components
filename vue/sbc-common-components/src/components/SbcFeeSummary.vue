<template>
    <v-card>
        <header class="font-weight-bold px-3 py-3">
            <slot name="header">Fee Summary</slot>
        </header>

        <div  v-show="fetchError">
            <v-alert
                    :value="true"
                    color="error"
                    icon="warning"
                    outlined
            >{{fetchError}}
            </v-alert>

        </div>
        <v-slide-y-transition group tag="ul" class="fee-list"  v-show="!fetchError">
            <li class="container fee-list__item" v-show="lineItem.fee" v-for="lineItem in fees" :key="lineItem.filingType" >
                <div class="fee-list__item-name">{{lineItem.filingType}}</div>
                <div class="fee-list__item-value">{{lineItem.fee | currency }}</div>
            </li>
        </v-slide-y-transition>
        <div class="container fee-total" v-show="!fetchError">
            <div class="fee-total__name">Total Fees</div>
            <div class="fee-total__currency">CAD</div>
            <div class="fee-total__value">
                <v-slide-y-reverse-transition name="slide" mode="out-in">
                    <div>{{totalFilingFees | currency}}</div>
                </v-slide-y-reverse-transition>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts">

import FeeServices from '../services/fee.services'

export default {
  name: 'sbc-fee-summary',
  /*
                  the props accept an array of filing data item's
                  the fee should have below items
                  filingDescription : not mandatory.If exists , it will be displayed. Or else what ever from service call will be shown
                  filingTypeCode : mandatory.Feecodes like OTADD ,OTANN
                  entityType : for example CP

               */
  props: {
    payURL: String,
    filingData: {
      type: Array,
      default: function () {
        return [{
          filingDescription: '',
          filingTypeCode: '',
          entityType: ''
        }]
      }
    }
  },

  data: () => ({
    fees: [],
    fetchError: ''
  }),

  mounted () {
    console.log('%c FeeMdoule-Data Recieved on Mount as %s %s', 'color: blue ;font-size : 12px', JSON.stringify(this.filingData), this.payURL)
    FeeServices.getFee(this.filingData, this.payURL).then(data => {
      this.fetchError = ''
      this.fees = data
    }).catch((error: any) => {
      this.fetchError = 'Error fetching fees' + error
    })
  },
  computed: {
    totalFilingFees () :number {
      if (!this.fees) {
        console.log('%c FeeMdoule-Watch ZERO FEE %s', 'color: blue ;font-size : 12px', JSON.stringify(this.filingData))
        return 0
      }
      return this.fees.reduce((acc: number, item: { fee: number; }) => acc + item.fee, 0)
    }
  },
  watch: {
    filingData: function (newVal) {
      console.log('%c FeeMdoule-Watch Activated as %s', 'color: blue ;font-size : 12px', JSON.stringify(this.filingData))
      FeeServices.getFee(this.filingData, this.payURL).then((data: any) => {
        this.fetchError = ''
        this.fees = data
      }).catch((error: any) => {
        this.fetchError = 'Error fetching fees' + error
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/theme.scss";
    header{
        color: #fff;
        background: $BCgovBlue5
    }

    .container{
        display: flex;
        flex-flow: row nowrap;
        line-height: 1.2rem;
        font-size: 0.875rem;
    }

    .fee-list{
        border-bottom: 1px solid $gray3;
    }

    .fee-list__item{
        &-name, &-value{
            font-weight: 700;
        }

        &-name{
            flex: 1 1 auto;
            margin-right: 2rem
        }

        &-value{
            flex: 0 0 auto;
            text-align: right
        }
    }

    .fee-list__item + .fee-list__item{
        border-top: 1px solid $gray3
    }

    .fee-total{
        align-items: center;
        letter-spacing: -0.01rem;
        line-height: auto;

        &__name{
            flex: 1 1 auto;
            margin-right: auto;
            font-weight: 700;
        }

        &__currency{
            margin-right: 0.5rem;
            color: $gray5;
            font-weight: 500;
        }

        &__value{
            font-size: 1.65rem;
            font-weight: 700;
        }
    }

</style>
