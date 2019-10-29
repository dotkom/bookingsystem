import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    admissionCode: "" as string
  },
  getters: {
    admissionCode: state => state.admissionCode
  },
  mutations: {
    SET_ADMISSION_CODE(state, payload) {
      state.admissionCode = payload;
    }
  },
  actions: {
    SET_ADMISSION_CODE: (context, payload) => {
      context.commit("SET_ADMISSION_CODE", payload);
    }
  }
});
