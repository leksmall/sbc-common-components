<template>
  <header class="app-header">
    <div class="container">
      <a href="/" class="brand">
        <picture>
          <source media="(min-width: 601px)"
            srcset="../assets/img/gov_bc_logo_horiz.png">
          <source media="(max-width: 600px)"
            srcset="../assets/img/gov_bc_logo_vert.png">
          <img class="brand__image"
            src="../assets/img/gov_bc_logo_vert.png"
            alt="Government of British Columbia Logo"
            title="Government of British Columbia">
        </picture>
        <span class="brand__title">BC Registries <span class="brand__title--wrap">& Online Services</span></span>
      </a>
      <div class="app-header__actions">
        <v-btn outlined color="#ffffff" v-if="authorized" @click="logout">Sign Out</v-btn>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import AuthService from '../services/auth.services'

export default Vue.extend({
  name: 'sbc-header',
  props: {
    authURL: String
  },
  computed: {
    authorized ():boolean {
      let auth = sessionStorage.getItem('KEYCLOAK_TOKEN')
      return !!auth
    }
  },
  methods: {
    logout () {
      window.location.assign('/auth/signout')
    }
  }
})
</script>

<style lang="scss" scoped>
  @import "../assets/scss/theme.scss";

  .app-header{
    height: 70px;
    color: #fff;
    border-bottom: 3px solid $BCgovGold5;
    background-color: $BCgovBlue5;

    .container{
      display: flex;
      align-items: center;
      height: 100%;
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .app-header__actions{
    margin-left: auto;

    .v-btn{
      margin-right: 0;
      color: #ffffff;
      border-color: #ffffff;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    padding-right: 1rem;
    text-decoration: none ;
    color: inherit;
  }

  .brand__image{
    display: block;
    margin-right: 1.5rem;
    margin-left: -0.1rem;
    max-height: 70px;
  }

  .brand__title{
    font-size: 1.125rem;
    font-weight: 400;
  }

  @media (max-width: 600px){
    .brand__image{
      margin-right: 0.75rem;
      margin-left: -0.15rem;
    }

    .brand__title{
      font-size: 1rem;
      line-height: 1.25rem;
    }

    .brand__title--wrap{
      display: block
    }
  }
</style>
