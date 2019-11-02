/* eslint-disable no-console */
import Vue from "vue";
import Router, { Route } from "vue-router";
import Calendar from "../views/Calendar.vue";
import store from "../store";
import CompanyLogin from "../views/CompanyLogin.vue";

store.commit("initialiseStore");
Vue.use(Router);

const auth = (_to: Route, _from: Route, next: Function) => {
  if (store.getters.isAuthenticated.status) {
    console.log("going to calendar");
    next("/calendar");
  } else next();
};

const notAuth = (_to: Route, _from: Route, next: Function) => {
  if (!store.getters.isAuthenticated.status) {
    console.log("going to login");
    next("/login");
  } else next();
};

export default new Router({
  mode: "history",
  routes: [
    {
      component: Calendar,
      name: "calendar",
      path: "/calendar",
      beforeEnter: notAuth
    },
    {
      path: "/login",
      name: "companyLogin",
      component: CompanyLogin,
      beforeEnter: auth
    },
    {
      path: "/",
      name: "Nan",
      component: CompanyLogin,
      beforeEnter: auth
    }
  ]
});
