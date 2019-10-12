import axios from 'axios'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

store.subscribe((mutation, state) => {
  localStorage.setItem('store', JSON.stringify(state))
})



new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#app')
