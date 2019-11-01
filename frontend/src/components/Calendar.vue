<template>
  <div class="content">
    <div class="__months" v-for="month in yearArray" :key="month">
      <div v-for="n in getOffset(month)" :key="n"></div>
      <template v-for="(bolk, index) in month">
        <button
          v-for="day in bolk"
          :key="String(day)"
          :class="`Bolk${index}`"
          :disabled="isWeekend(day)"
        >
          Button
        </button>
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
      yearArray: new Array(12).fill(null) as any,
      bolk1: [] as any,
      bolk2: [] as any,
      bolk3: [] as any
    };
  },
  methods: {
    initBolks() {
      const startBolk1 = new Date(this.getBolk1Start);
      const endBolk1 = new Date(this.getBolk1End);

      const startBolk2 = new Date(this.getBolk2Start);
      const endBolk2 = new Date(this.getBolk2End);

      const startBolk3 = new Date(this.getBolk3Start);
      const endBolk3 = new Date(this.getBolk3End);

      this.getAllDates(this.bolk1, startBolk1, endBolk1);
      this.getAllDates(this.bolk2, startBolk2, endBolk2);
      this.getAllDates(this.bolk3, startBolk3, endBolk3);
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
      // console.log(this.yearArray)
    },
    getAllDates(bolk: Array<Object>, startDate: Date, endDate: Date) {
      let currentDate = moment(startDate);
      const stopDate = moment(endDate);

      while (currentDate <= stopDate) {
        bolk.push(moment(currentDate));
        currentDate = moment(currentDate).add(1, "days");
      }
    },
    getOffset(
      monthBolkArray: [[moment.Moment], [moment.Moment], [moment.Moment]] | null
    ): number {
      if (!monthBolkArray) return 0;
      const firstFilledBolk = monthBolkArray.find(
        (entry: [] | [moment.Moment]): boolean => entry.length > 1
      );
      // console.log("firstbolk", firstFilledBolk);
      const firstDay = firstFilledBolk && firstFilledBolk[0];
      // console.log("firstday", firstDay);
      if (!firstDay) return 0;
      // console.log("firstdaymonth", firstDay.month());
      const dayOfWeek = firstDay.startOf("month");
      // console.log("dayofweek", dayOfWeek);
      if (dayOfWeek.day() === 0) return 6;
      return dayOfWeek.day() - 1;
    },
    isWeekend(day: moment.Moment) {
      if (day.day() == 6 || day.day() == 0 || day.day() == 5) {
        return true;
      }
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
  created() {
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
  grid-template-rows: 1fr 7fr 7fr 7fr 7fr 7fr;
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
</style>
