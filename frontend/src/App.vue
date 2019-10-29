<template>
  <div id="app">
    <CompanyLogin />
  </div>
</template>

<script lang="ts">
import CompanyLogin from "@/views/CompanyLogin.vue";

export default {
  components: {
    CompanyLogin
  }
};
</script>

<style lang="scss">
@import "@/sass/layout.scss";
@include layout;
</style>
