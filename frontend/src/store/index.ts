import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  actions: {},
  mutations: {
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
  state: {
    login: false
  },
  getters: {
    isAuthenticated: state => state.login
  }
});
