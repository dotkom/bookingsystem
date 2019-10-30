import Vue from "vue";
import VueRouter from "vue-router";
import CompanyLogin from "../views/CompanyLogin.vue";
import Bedkom from "../views/bedkom/Bedkom.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "companyLogin",
    component: CompanyLogin
  },
  {
    path: "/bedkom",
    name: "bedkom",
    component: Bedkom
  }
];

const router = new VueRouter({
  routes
});

export default router;
