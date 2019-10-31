<template>
  <div class="btnDiv">
    <button @click="btnClick" :disabled="disabled">
      {{ btnText }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Button" as string,
  props: {
    btnText: String,
    disabled: Boolean
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
