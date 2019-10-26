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
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
}
</style>
