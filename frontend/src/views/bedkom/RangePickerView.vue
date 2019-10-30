<template>
  <div class="main">
    <Header />
    <h2>Select the seasons start and end dates</h2>
    <div class="__content">
      <DatePicker
        class="__dp_1"
        labelText="Pick start date"
        @datePicked="newStartDate"
      />
      <DatePicker labelText="Pick end date" @datePicked="newEndDate" />
    </div>
    <Button btnText="Next step" @btnClicked="nextPage" />
  </div>
</template>

<script>
import Header from "@/components/shared/Header.vue";
import DatePicker from "@/components/shared/DatePicker.vue";
import Button from "@/components/shared/Button.vue";

export default {
  components: {
    DatePicker,
    Header,
    Button
  },
  methods: {
    newStartDate(chosenDate) {
      // eslint-disable-next-line no-console
      console.log(chosenDate);
      this.$store.dispatch("SET_START_DATE", chosenDate);
    },
    newEndDate(chosenDate) {
      // eslint-disable-next-line no-console
      console.log(chosenDate);
      this.$store.dispatch("SET_END_DATE", chosenDate);
    },
    nextPage() {
      // eslint-disable-next-line no-console
      console.log("yee");
    }
  }
};
</script>

<style lang="scss" scoped>
.__content {
  margin-top: 1rem;
  display: flex;
  justify-content: center;

  .__dp_1 {
    margin-right: 3rem;
  }
}
</style>
