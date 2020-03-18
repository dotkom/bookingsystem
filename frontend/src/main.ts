import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

Vue.config.productionTip = false;

const DNS = process.env.VUE_APP_DNS || "";
Sentry.init({
  dsn: DNS,
  integrations: [new Integrations.Vue({ Vue, attachProps: true })]
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
