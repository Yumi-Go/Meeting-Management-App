import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import SignIn from './components/SignIn.vue'
import Home from './views/Home.vue'
import Account from './views/Account.vue'
import Booking from './views/Booking.vue'
import Managing from './views/Managing.vue'
import Inbox from './views/Inbox.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useLocalStorage } from '@vueuse/core'
// import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const currentUserInLocalStorage = useLocalStorage('currentUser', {});

// router not working
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: function () {
        if(currentUserInLocalStorage.value.fName.length > 0
          && currentUserInLocalStorage.value.lName.length > 0) {
          return import('./views/Home.vue');
        } else {
          return import('./views/Account.vue');
        }
      }
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
    {
      path: '/inbox',
      name: 'Inbox',
      component: Inbox,
    }
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
