<template>
  <div class="date-picker">
    <VueCtkDateTimePicker
      v-model="chosenDate"
      :onlyDate="true"
      format="MM - DD - YYYY"
      formatted="ll"
      :noLabel="true"
      :noButtonNow="true"
      :label="labelText"
      :overlay="true"
      :minDate="getCurrentDate"
      :initial-value="getCurrentDate"
      locale="en"
    />
  </div>
</template>

<script>
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";

export default {
  name: "DatePicker",
  components: {
    VueCtkDateTimePicker
  },
  props: {
    labelText: String
  },
  data() {
    return {
      chosenDate: ""
    };
  },
  computed: {
    getCurrentDate() {
      const year = String(new Date().getFullYear());
      const month = String(new Date().getMonth() + 1);
      const day = String(new Date().getDate());
      return year + "-" + month + "-" + day;
    }
  },
  watch: {
    chosenDate: function() {
      this.$emit("datePicked", this.chosenDate);
    }
  }
};
</script>

<style lang="scss" scoped>
.date-picker {
  width: 25%;
}
</style>
