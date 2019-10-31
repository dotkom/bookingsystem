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
      :minDate="startDate"
      :initial-value="startDate"
      locale="en"
      :noClearButton="true"
      :autoClose="true"
      :noWeekendDays="true"
      :firstDayOfWeek="1"
      :noHeader="true"
      :disabled="enabled"
      outputFormat="YYYY-MM-DD"
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
    labelText: String,
    enabled: Boolean,
    startDate: String
  },
  data() {
    return {
      chosenDate: ""
    };
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
