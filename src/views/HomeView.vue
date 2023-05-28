<script setup>
import Calendar from '../components/Calendar.vue'
import { useRoute, useRouter } from 'vue-router'
import SignUp from '../components/SignUp.vue'

const route = useRoute();
const router = useRouter();

</script>

<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn size="x-large">Book a meeting</v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn size="x-large">Manage Schedules</v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn size="x-large" to="" target="_blank">Sign Up / Sign In</v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <SignUp/>
    </v-row>
  </v-container>
</template>
