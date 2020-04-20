import Vue from "vue";
import VueRouter from "vue-router";
import CompanyLogin from "../views/CompanyLogin.vue";

Vue.use(VueRouter);

const routes = [
  //change path with more content
  {
    path: "/",
    name: "companyLogin",
    component: CompanyLogin
  }
];

const router = new VueRouter({
  routes
});

export default router;
