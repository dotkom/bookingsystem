<template>
  <div>
    <RangePickerView />
  </div>
</template>

<script>
import RangePickerView from "@/views/bedkom/RangePickerView";

export default {
  components: {
    RangePickerView
  }
};

// @ is an alias to /src
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
  color: #2c3e50;
}
</style>
