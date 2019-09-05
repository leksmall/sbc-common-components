<template>
    <v-alert v-model="show"  :color="type" :dismissible = dismissible>
        <v-container class="system-alert__inner">
            <v-icon class="system-alert__icon" color="#ffffff">{{type}}</v-icon>
            <div class="system-alert__msg">{{ message }}</div>
        </v-container>
    </v-alert>
</template>

<script lang="ts">

import Vue from 'vue'
import '../plugins/vuetify'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class SbcSystemBanner extends Vue {
    @Prop({ default: '' }) message: string
    @Prop({ default: 'info' }) type: string // Accepted values are 'info', 'warning', 'danger', 'success'
    @Prop({ default: false }) show: boolean
    @Prop({ default: false }) dismissible: boolean

    mounted () {
    }
}
</script>

<style lang="scss" scoped>
    .v-alert{
        margin: 0;
        padding: 0;
        overflow: hidden;
        border: none;
        z-index: 2;
    }

    .system-alert__inner{
        position: relative;
        display: flex;
        align-items: center;
        padding: 1.15rem 1.5rem;
    }

    .system-alert__icon{
        position: absolute;
        top: 1rem;
        left: 1.5rem;
    }

    .system-alert__msg{
        margin-left: 2.5rem;
        font-weight: 500;
    }
</style>
