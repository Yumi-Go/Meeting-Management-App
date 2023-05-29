<script setup>
import { useRoute, useRouter } from 'vue-router'
import SignIn from './components/SignIn.vue'
import HomeView from './views/HomeView.vue'
import { useAuth } from './composables/useAuth'

const route = useRoute();
const router = useRouter();
const { currentUID, userStateObserver } = useAuth();
userStateObserver();
console.log("currentUID: ", currentUID.value);
</script>

<template>
  <SignIn v-if="currentUID === null"/>
  <HomeView v-else/>
</template>
