<template>
  <div class="btnDiv">
    <button @click="btnClick">
      {{ btnText }}
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: "Button" as string,
  props: {
    btnText: String
  },
  methods: {
    btnClick() {
      this.$emit("btnClicked");
    }
  }
};
</script>

<style lang="scss" scoped>
.btnDiv {
  display: flex;
  justify-content: space-around;
  -moz-box-align: center;
  align-items: center;
  margin: 2rem 0px;
}
button {
  background: rgb(0, 96, 163) none repeat scroll 0% 0%;
  color: rgb(255, 255, 255);
  border-radius: 4px;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  display: flex;
  margin: auto;
  cursor: pointer;
}
</style>
