<script setup>
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import { useAuth } from '../composables/useAuth'

const { currentUID, userStateObserver, logOut } = useAuth();
</script>

<template>
    <p>current logged in user's UID: {{ currentUID }}</p>
    <v-container>
        <v-row justify="center">
            <v-btn size="x-large" class="mb-5 w-75">Book a meeting</v-btn>
        </v-row>
        <v-row justify="center">
            <v-btn size="x-large" class="mb-5 w-75">Manage Schedules</v-btn>
        </v-row>
        <v-row justify="center">
            <v-col cols="auto">
                <v-btn @click="" class="mr-10">Setting</v-btn>
                <v-btn @click="logOut">Log Out</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
