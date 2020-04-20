<template>
  <div :class="$style.main">
    <label :class="$style.label" for="text-input"> {{ labelText }} </label>
    <input
      type="text"
      name="text-input"
      @input="emitInputText"
      :placeholder="placeholderText"
      :class="$style.input"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "TextInput" as string,
  props: {
    labelText: {
      type: String,
      required: true
    },
    placeholderText: {
      type: String,
      required: true
    }
  },
  methods: {
    emitInputText(event: HTMLInputElement) {
      this.$emit("emitInputText", event);
    }
  }
});
</script>

<style lang="scss" module>
.main {
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
}
label {
  align-self: flex-start;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: $online-blue;
}
input {
  &[type="text"] {
    max-width: 300px;
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;
    padding: 0.625em 1em;
    font-size: 1em;
    color: rgb(42, 39, 34);
    border: $border-color;
  }
}
</style>
