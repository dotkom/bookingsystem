import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About.vue'
import Calendar from './views/Calendar.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import store from './store'
store.commit('initialiseStore')

Vue.use(Router)

const auth = (to, from, next) => {
  if (store.getters.isAuthenticated.status) next('/calendar')
  else next()
}

const notAuth = (to, from, next) => {
  if (!store.getters.isAuthenticated.status) next('/login')
  else next()
}

export default new Router({
  mode:'history',
  routes: [
    {
      component: Home,
      name: 'home',
      path: '/'
    },
    {
      component: About,
      name: 'about',
      path: '/about'
    },
    {
      component: Calendar,
      name: 'calendar',
      path: '/calendar',
      beforeEnter:notAuth,
    },
    {
      component: Login,
      name: 'login',
      path: '/login',
      beforeEnter:auth
    }
  ]
})
