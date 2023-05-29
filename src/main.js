import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import vue3GoogleLogin from 'vue3-google-login'
import Home from './views/HomeView.vue'
import SignUp from './components/SignUp.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    },
  ]
})



const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
.use(router)
.use(vuetify)
.mount('#app')
