import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    admissionCode: "" as string,
    startDate: "" as string,
    endDate: "" as string,
    seasonName: "" as string
  },
  getters: {
    admissionCode: state => state.admissionCode,
    startDate: state => state.startDate,
    endDate: state => state.endDate,
    seasonName: state => state.seasonName
  },
  mutations: {
    SET_ADMISSION_CODE(state, payload) {
      state.admissionCode = payload;
    },
    SET_START_DATE(state, payload) {
      state.startDate = payload;
    },
    SET_END_DATE(state, payload) {
      state.endDate = payload;
    },
    SET_SEASON_NAME(state, payload) {
      state.seasonName = payload;
    }
  },
  actions: {
    SET_ADMISSION_CODE: (context, payload) => {
      context.commit("SET_ADMISSION_CODE", payload);
    },
    SET_START_DATE: (context, payload) => {
      context.commit("SET_START_DATE", payload);
    },
    SET_END_DATE: (context, payload) => {
      context.commit("SET_END_DATE", payload);
    },
    SET_SEASON_NAME: (context, payload) => {
      context.commit("SET_SEASON_NAME", payload);
    }
  }
});
