<template>
  <div class="content">
    <h2>Months</h2>
    <div class="__months" v-for="(month, index) in yearArray" :key="index">
      <template v-if="month !== null">
        <h2 class="__name">{{ getNameOfMonth(month, index) }}</h2>
        <div v-for="n in getOffset(month)" :key="`${month}${n}`"></div>
        <div v-for="n in getUnselectedDays(month)" :key="n"></div>
        <template v-for="(bolk, index) in month">
          <div v-for="day in bolk" :class="`Bolk${index}`" :key="`Bolk${day}`">
            {{ day }}
            <button :disabled="isWeekend(day)">
              Button
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-console */

import Vue from "vue";
import moment from "moment";

export default Vue.extend({
  data() {
    return {
      yearArray: new Array(12).fill(null),
      bolk1: [] as Array<moment.Moment>,
      bolk2: [] as Array<moment.Moment>,
      bolk3: [] as Array<moment.Moment>
    };
  },
  methods: {
    initBolks() {
      const startBolk1 = moment(this.getBolk1Start);
      const endBolk1 = moment(this.getBolk1End);

      const startBolk2 = moment(this.getBolk2Start);
      const endBolk2 = moment(this.getBolk2End);

      const startBolk3 = moment(this.getBolk3Start);
      const endBolk3 = moment(this.getBolk3End);

      this.bolk1 = this.getAllDates(startBolk1, endBolk1);
      this.bolk2 = this.getAllDates(startBolk2, endBolk2);
      this.bolk3 = this.getAllDates(startBolk3, endBolk3);

      this.initYear(this.bolk1, 0);
      this.initYear(this.bolk2, 1);
      this.initYear(this.bolk3, 2);
    },
    initYear(bolk: Array<moment.Moment>, nr: number) {
      const mappedBolk = bolk.map(el => el.month());
      let unique = [...new Set(mappedBolk)];

      unique.forEach(element => {
        if (!this.yearArray[element]) {
          this.yearArray[element] = [[], [], []];
        }
      });

      bolk.forEach(element => {
        let localVal = element.month();
        this.yearArray[localVal][nr].push(element);
      });

      this.methodThatForcesUpdate();
    },
    getAllDates(startDate: moment.Moment, endDate: moment.Moment) {
      let localBolk = [];
      let currentDate = startDate;
      const stopDate = endDate;

      while (currentDate <= stopDate) {
        localBolk.push(currentDate.clone());
        currentDate = currentDate.clone();
        currentDate.add(1, "d");
      }
      return localBolk;
    },
    getOffset(
      monthBolkArray: [[moment.Moment], [moment.Moment], [moment.Moment]] | null
    ): number {
      if (!monthBolkArray) return 0;
      const firstFilledBolk = monthBolkArray.find(
        (entry: [] | [moment.Moment]): boolean => entry.length > 1
      );
      const firstDay = firstFilledBolk && firstFilledBolk[0];
      if (!firstDay) return 0;
      const dayOfWeek = firstDay.clone().startOf("month");
      if (dayOfWeek.day() === 0) return 6;
      return dayOfWeek.day() - 1;
    },
    getUnselectedDays(
      monthBolkArray: [[moment.Moment], [moment.Moment], [moment.Moment]] | null
    ): number {
      if (!monthBolkArray) return 0;
      const firstFilledBolk = monthBolkArray.find(
        (entry: [] | [moment.Moment]): boolean => entry.length > 1
      );
      const firstDay = firstFilledBolk && firstFilledBolk[0];
      if (!firstDay) return 0;
      const localStat = [];
      const dayOfWeek = firstDay.clone().startOf("month");
      return firstDay.diff(dayOfWeek, "days");
    },
    isWeekend(day: moment.Moment) {
      if (day.day() == 6 || day.day() == 0 || day.day() == 5) {
        return true;
      }
    },
    getNameOfMonth(month: moment.Moment, index: number) {
      if (month !== null) {
        return moment(index + 1, "MM").format("MMMM");
      }
    },
    methodThatForcesUpdate() {
      this.$forceUpdate();
    }
  },
  computed: {
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
    },
    getBolk3End() {
      return this.$store.getters.bolk3EndDate;
    }
  },
  mounted() {
    this.initBolks();
  }
});
</script>

<style lang="scss" scoped>
.__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.__months {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 7fr 7fr 7fr 7fr 7fr 7fr;
  .__name {
    grid-column-start: 1;
    grid-column-end: 8;
  }
  .Bolk {
    &0 {
      background-color: green;
      &:disabled {
        background-color: grey;
      }
    }
    &1 {
      background-color: yellow;
      &:disabled {
        background-color: grey;
      }
    }
    &2 {
      background-color: orange;
      &:disabled {
        background-color: grey;
      }
    }
  }
}
</style>
