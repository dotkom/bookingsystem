<template>
  <div class="main">
    <label for="text-input"> {{ labelText }} </label>
    <input
      type="text"
      name="text-input"
      @input="emitInputText"
      :placeholder="placeholderText"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "TextInput" as string,
  props: {
    labelText: String,
    placeholderText: String
  },
  methods: {
    emitInputText(event: HTMLInputElement) {
      this.$emit("emitInputText", event);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/sass/shared-mixins.scss";
@include input-field;
</style>
