<template>
  <div class="btnDiv">
    <button @click="btnClick">{{ btnText }}</button>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Button" as string,
  props: {
    btnText: String
  },
  methods: {
    btnClick() {
      this.$emit("btnClicked");
    }
  }
});
</script>


<style lang="scss" scoped>
@import "@/sass/shared-mixins.scss";
@include button;
</style>
