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
export default {
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
};
</script>

<style lang="scss" scoped>
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
  color: rgb(0, 104, 179);
}
input {
  &[type="text"] {
    max-width: 300px;
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px;
    padding: 0.625em 1em;
    font-size: 1em;
    color: rgb(42, 39, 34);
    border: 1px solid rgb(241, 241, 241);
  }
}
</style>
