<template>
  <div class="main">
    <Header />
    <h2>Choose a name for the season</h2>
    <div class="__content">
      <TextInput
        labelText="Name"
        placeholderText="Example: H2020"
        @emitInputText="updateSeasonName"
      />
    </div>
    <h2>Select the seasons start and end dates</h2>
    <div class="__content">
      <DatePicker
        class="__dp_1"
        labelText="Pick start date"
        @datePicked="updateStartDate"
      />
      <DatePicker labelText="Pick end date" @datePicked="updateEndDate" />
    </div>
    <Button btnText="Next step" @btnClicked="nextPage" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "@/components/shared/Header.vue";
import DatePicker from "@/components/shared/DatePicker.vue";
import Button from "@/components/shared/Button.vue";
import TextInput from "@/components/shared/TextInput.vue";

export default Vue.extend({
  components: {
    DatePicker,
    Header,
    Button,
    TextInput
  },
  methods: {
    updateStartDate(chosenDate: string) {
      // eslint-disable-next-line no-console
      console.log(chosenDate);
      this.$store.dispatch("SET_START_DATE", chosenDate);
    },
    updateEndDate(chosenDate: string) {
      // eslint-disable-next-line no-console
      console.log(chosenDate);
      this.$store.dispatch("SET_END_DATE", chosenDate);
    },
    updateSeasonName(event: any) {
      this.$store.dispatch("SET_SEASON_NAME", (event.target as HTMLInputElement)
        .value as string);
    },
    nextPage() {
      // eslint-disable-next-line no-console
      console.log("yee");
      this.$store.dispatch("SET_STEP_INCREMENT");
    }
  }
});
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
