<template>
  <div>
    <div v-if="getStep == 1">
      <RangePicker />
    </div>
    <div v-if="getStep == 2">
      Hee
    </div>
  </div>
</template>

<script lang="ts">
//need a landingpage for step == 1

import Vue from "vue";
import RangePicker from "@/components/RangePicker.vue";

export default Vue.extend({
  components: {
    RangePicker
  },
  computed: {
    getStep() {
      return this.$store.getters.step;
    }
  }
});
</script>

<style></style>
