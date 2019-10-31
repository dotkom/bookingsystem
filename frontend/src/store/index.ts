import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    admissionCode: "" as string,
    login: false
  },
  getters: {
    admissionCode: state => state.admissionCode,
    isAuthenticated: state => state.login
  },
  mutations: {
    SET_ADMISSION_CODE(state, payload) {
      state.admissionCode = payload;
    },
    attemptLogin(state, status: boolean) {
      state.login = status;
    },
    initialiseStore(state) {
      if (localStorage.getItem("store")) {
        this.replaceState(
          Object.assign(
            state,
            JSON.parse(localStorage.getItem("store") as string)
          )
        );
      }
    }
  },
  actions: {
    SET_ADMISSION_CODE: (context, payload) => {
      context.commit("SET_ADMISSION_CODE", payload);
    }
  }
});
