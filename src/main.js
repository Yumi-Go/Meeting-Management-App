import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import SignIn from './components/SignIn.vue'
import Account from './views/account.vue'
import Booking from './views/Booking.vue'
import Managing from './views/Managing.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// router not working
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
    },
    {
      path: '/booking',
      name: 'Booking',
      component: Booking,
    },
    {
      path: '/managing',
      name: 'Managing',
      component: Managing,
    },
  ]
})

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

createApp(App)
.use(router)
.use(vuetify)
.mount('#app')
