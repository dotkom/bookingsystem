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
    <h2>Select the dates for each bolk</h2>
    <h4>Bolk 1</h4>
    <div class="__content">
      <DatePicker
        class="__dp_1"
        labelText="Pick bolk 1 start date"
        @datePicked="updateBolk1StartDate"
        :startDate="getCurrentDate"
      />
      <DatePicker
        labelText="Pick bolk 1 end date"
        @datePicked="updateBolk1EndDate"
        :enabled="bolk1EndDisabled"
        :startDate="getBolk1Start"
      />
    </div>
    <h4>Bolk 2</h4>
    <div class="__content">
      <DatePicker
        class="__dp_1"
        labelText="Pick bolk 2 start date"
        @datePicked="updateBolk2StartDate"
        :enabled="bolk2StartDisabled"
        :startDate="getBolk1End"
      />
      <DatePicker
        labelText="Pick bolk 2 end date"
        @datePicked="updateBolk2EndDate"
        :enabled="bolk2EndDisabled"
        :startDate="getBolk2Start"
      />
    </div>
    <h4>Bolk 3</h4>
    <div class="__content">
      <DatePicker
        class="__dp_1"
        labelText="Pick bolk 3 start date"
        @datePicked="updateBolk3StartDate"
        :enabled="bolk3StartDisabled"
        :startDate="getBolk2End"
      />
      <DatePicker
        labelText="Pick bolk 3 end date"
        @datePicked="updateBolk3EndDate"
        :enabled="bolk3EndDisabled"
        :startDate="getBolk3Start"
      />
    </div>
    <div>
      <Button
        btnText="Next step"
        @btnClicked="nextPage"
        :disabled="stepDisabled"
      />
    </div>
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
  data() {
    return {
      bolk1EndDisabled: true,
      bolk2StartDisabled: true,
      bolk2EndDisabled: true,
      bolk3StartDisabled: true,
      bolk3EndDisabled: true,
      stepDisabled: false
    };
  },
  methods: {
    updateBolk1StartDate(chosenDate: string) {
      this.bolk1EndDisabled = false;
      this.$store.dispatch("SET_BOLK_1_START_DATE", chosenDate as string);
    },
    updateBolk1EndDate(chosenDate: string) {
      this.bolk2StartDisabled = false;
      this.$store.dispatch("SET_BOLK_1_END_DATE", chosenDate as string);
    },
    updateBolk2StartDate(chosenDate: string) {
      this.bolk2EndDisabled = false;
      this.$store.dispatch("SET_BOLK_2_START_DATE", chosenDate as string);
    },
    updateBolk2EndDate(chosenDate: string) {
      this.bolk3StartDisabled = false;
      this.$store.dispatch("SET_BOLK_2_END_DATE", chosenDate as string);
    },
    updateBolk3StartDate(chosenDate: string) {
      this.bolk3EndDisabled = false;
      this.$store.dispatch("SET_BOLK_3_START_DATE", chosenDate as string);
    },
    updateBolk3EndDate(chosenDate: string) {
      this.$store.dispatch("SET_BOLK_3_END_DATE", chosenDate as string);
      this.stepDisabled = false;
    },
    updateSeasonName(event: any) {
      this.$store.dispatch("SET_SEASON_NAME", (event.target as HTMLInputElement)
        .value as string);
    },
    nextPage() {
      this.$store.dispatch("SET_STEP_INCREMENT");
    }
  },
  computed: {
    getCurrentDate() {
      const year = String(new Date().getFullYear());
      const month = String(new Date().getMonth() + 1);
      const day = String(new Date().getDate());
      return year + "-" + month + "-" + day;
    },
    getBolk1Start() {
      return this.$store.getters.bolk1StartDate;
    },
    getBolk1End() {
      return this.$store.getters.bolk1EndDate;
    },
    getBolk2Start() {
      return this.$store.getters.bolk2StartDate;
    },
    getBolk2End() {
      return this.$store.getters.bolk2EndDate;
    },
    getBolk3Start() {
      return this.$store.getters.bolk3StartDate;
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
