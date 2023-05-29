<script setup>
import SignUp from '../components/SignUp.vue'

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
