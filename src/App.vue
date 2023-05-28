<script setup>
import Calendar from './components/Calendar.vue'
import { useRoute, useRouter } from 'vue-router'
import SignUp from './components/SignUp.vue'
import HomeView from './views/HomeView.vue'

const route = useRoute();
const router = useRouter();

</script>

<template>
  <HomeView/>
</template>
