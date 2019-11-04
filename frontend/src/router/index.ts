import Vue from "vue";
import VueRouter from "vue-router";
import CompanyLogin from "@/views/company/CompanyLogin.vue";
import admin from "@/views/admin/Admin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "companyLogin",
    component: CompanyLogin
  },
  {
    path: "/admin",
    name: "admin",
    component: admin
  }
];

const router = new VueRouter({
  routes
});

export default router;
