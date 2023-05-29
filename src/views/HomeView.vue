<script setup>
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'
import { useAuth } from '../composables/useAuth'

const { currentUID, userStateObserver, logOut } = useAuth();
</script>

<template>
    <p>current logged in user's UID: {{ currentUID }}</p>
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
        <v-row>
            <v-btn @click="logOut">Log Out</v-btn>

        </v-row>
    </v-container>
</template>
