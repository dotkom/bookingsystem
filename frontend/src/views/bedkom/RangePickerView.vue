<template>
  <div class="main">
    <div class="__content">
      <DatePicker labelText="Pick start date" @datePicked="newStartDate" />
      <DatePicker labelText="Pick end date" @datePicked="newEndDate" />
    </div>
  </div>
</template>

<script>
import DatePicker from "@/components/calendar/DatePicker.vue";

export default {
  components: {
    DatePicker
  },
  methods: {
    newStartDate(chosenDate) {
      // eslint-disable-next-line no-console
      console.log(chosenDate);
    },
    newEndDate(chosenDate) {
      // eslint-disable-next-line no-console
      console.log(chosenDate);
    }
  }
};
</script>

<style style="scss" scoped>
.__content {
  display: flex;
}
</style>
