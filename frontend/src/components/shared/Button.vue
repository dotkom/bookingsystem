<template>
  <div :class="$style.btnDiv">
    <button @click="btnClick" :class="$style.button">
      {{ btnText }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Button",
  props: {
    btnText: {
      type: String,
      required: true
    }
  },
  methods: {
    btnClick() {
      this.$emit("btnClicked");
    }
  }
});
</script>

<style lang="scss" module>
.btnDiv {
  display: flex;
  justify-content: space-around;
  -moz-box-align: center;
  align-items: center;
  margin: 2rem 0px;
}
button {
  background-color: $online-blue;
  color: rgb(255, 255, 255);
  border-radius: 4px;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  display: flex;
  margin: auto;
  cursor: pointer;
  &:hover {
    background-color: $hover-color;
  }
}
</style>
