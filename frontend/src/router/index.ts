/* eslint-disable no-console */
import Vue from "vue";
import Router, { Route } from "vue-router";
import store from "../store";

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
      component: () => import("../views/Calendar.vue"),
      name: "calendar",
      path: "/calendar",
      beforeEnter: notAuth
    },
    {
      path: "/login",
      name: "companyLogin",
      component: () => import("../views/CompanyLogin.vue"),
      beforeEnter: auth
    },
    {
      path: "/",
      name: "Nan",
      component: () => import("../views/CompanyLogin.vue"),
      beforeEnter: auth
    }
  ]
});
