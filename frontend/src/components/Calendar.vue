<template>
  <div>
    <h1>Bolk1</h1>
    <div v-for="day in bolk1" :key="day.id">
      <div>
        {{ day }}
      </div>
    </div>
    <h1>Bolk2</h1>
    <div v-for="day in bolk2" :key="day.id">
      <div>
        {{ day }}
      </div>
    </div>

    <h1>Bolk3</h1>
    <div v-for="day in bolk3" :key="day.id">
      <div>
        {{ day }}
      </div>
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

      for (let index = 0; index < this.getOffset(this.getBolk1Start); index++) {
        this.bolk1.push({
          id: "OffsetBolk1" + `${index}`,
          name: "Offset"
        });
      }

      for (let index = 0; index < this.getOffset(this.getBolk2Start); index++) {
        this.bolk2.push({
          id: "OffsetBolk2" + `${index}`,
          name: "Offset"
        });
      }

      for (let index = 0; index < this.getOffset(this.getBolk3Start); index++) {
        this.bolk3.push({
          id: "OffsetBolk3" + `${index}`,
          name: "Offset"
        });
      }

      this.getAllDates(this.bolk1, startBolk1, endBolk1);
      this.getAllDates(this.bolk2, startBolk2, endBolk2);
      this.getAllDates(this.bolk3, startBolk3, endBolk3);
    },
    getAllDates(bolk: Array<Object>, startDate: Date, endDate: Date) {
      let currentDate = moment(startDate);
      const stopDate = moment(endDate);
      while (currentDate <= stopDate) {
        bolk.push({
          id: moment(currentDate).format("YYYY-MM-DD"),
          name: moment(currentDate).format("DD")
        });
        currentDate = moment(currentDate).add(1, "days");
      }
    },
    getOffset(date: string) {
      const dayOfWeek = new Date(date).getDay();
      let weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      const monthStartDay = isNaN(dayOfWeek) ? null : weekDays[dayOfWeek];
      switch (monthStartDay) {
        case "Monday":
          return 0;
        case "Tuesday":
          return 1;
        case "Wednesday":
          return 2;
        case "Thursday":
          return 3;
        case "Friday":
          return 4;
        case "Saturday":
          return 5;
        case "Sunday":
          return 6;
        default:
          return 0;
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
  mounted() {
    this.initBolks();
  }
});
</script>

<style></style>
