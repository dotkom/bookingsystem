import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    admissionCode: "" as string,
    bolk1StartDate: "" as string,
    bolk1EndDate: "" as string,
    bolk2StartDate: "" as string,
    bolk2EndDate: "" as string,
    bolk3StartDate: "" as string,
    bolk3EndDate: "" as string,
    seasonName: "" as string,
    step: 1 as number
  },
  getters: {
    admissionCode: state => state.admissionCode,
    bolk1StartDate: state => state.bolk1StartDate,
    bolk1EndDate: state => state.bolk1EndDate,
    bolk2StartDate: state => state.bolk2StartDate,
    bolk2EndDate: state => state.bolk2EndDate,
    bolk3StartDate: state => state.bolk3StartDate,
    bolk3EndDate: state => state.bolk3EndDate,
    seasonName: state => state.seasonName,
    step: state => state.step
  },
  mutations: {
    SET_ADMISSION_CODE(state, payload) {
      state.admissionCode = payload;
    },
    SET_BOLK_1_START_DATE(state, payload) {
      state.bolk1StartDate = payload;
    },
    SET_BOLK_1_END_DATE(state, payload) {
      state.bolk1EndDate = payload;
    },
    SET_BOLK_2_START_DATE(state, payload) {
      state.bolk2StartDate = payload;
    },
    SET_BOLK_2_END_DATE(state, payload) {
      state.bolk2EndDate = payload;
    },
    SET_BOLK_3_START_DATE(state, payload) {
      state.bolk3StartDate = payload;
    },
    SET_BOLK_3_END_DATE(state, payload) {
      state.bolk3EndDate = payload;
    },
    SET_SEASON_NAME(state, payload) {
      state.seasonName = payload;
    },
    SET_STEP_INCREMENT(state) {
      state.step++;
    },
    SET_STEP_DECREMENT(state) {
      state.step--;
    }
  },
  actions: {
    SET_ADMISSION_CODE: (context, payload) => {
      context.commit("SET_ADMISSION_CODE", payload);
    },
    SET_BOLK_1_START_DATE: (context, payload) => {
      context.commit("SET_BOLK_1_START_DATE", payload);
    },
    SET_BOLK_1_END_DATE: (context, payload) => {
      context.commit("SET_BOLK_1_END_DATE", payload);
    },
    SET_BOLK_2_START_DATE: (context, payload) => {
      context.commit("SET_BOLK_2_START_DATE", payload);
    },
    SET_BOLK_2_END_DATE: (context, payload) => {
      context.commit("SET_BOLK_2_END_DATE", payload);
    },
    SET_BOLK_3_START_DATE: (context, payload) => {
      context.commit("SET_BOLK_3_START_DATE", payload);
    },
    SET_BOLK_3_END_DATE: (context, payload) => {
      context.commit("SET_BOLK_3_END_DATE", payload);
    },
    SET_SEASON_NAME: (context, payload) => {
      context.commit("SET_SEASON_NAME", payload);
    },
    SET_STEP_INCREMENT: context => {
      context.commit("SET_STEP_INCREMENT");
    },
    SET_STEP_DECREMENT: context => {
      context.commit("SET_STEP_DECREMENT");
    }
  }
});
