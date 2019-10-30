<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App"
});
</script>

<style lang="scss">
@import "@/sass/layout.scss";
@include layout;
</style>
