<script setup>
import { useAuth } from '../composables/useAuth'
import { auth } from '../firebaseConfig'
import { useRouter } from 'vue-router'
import SignIn from '../components/SignIn.vue'
import Setting from './Setting.vue'

const { currentUser, userStateObserver, logOut } = useAuth();
userStateObserver();
const router = useRouter();

function clickLogout() {
    logOut();
    window.location.href = "/";
}

</script>

<template>
    <SignIn v-if="currentUser === null"/>
    <v-container v-else>
        <v-row>current logged in user's UID: {{ currentUser.uid }}</v-row>
        <v-row justify="center">
            <v-btn
                @click="router.push('/booking')"
                size="x-large"
                class="mb-5 w-75"
            >
                Book a meeting
            </v-btn>
        </v-row>
        <v-row justify="center">
            <v-btn
                @click="router.push('/managing')"
                size="x-large"
                class="mb-5 w-75"
            >
                Manage Schedules
            </v-btn>
        </v-row>
        <v-row justify="center">
            <v-col cols="auto">
                <v-btn
                    @click="router.push('/setting')"
                    class="mr-10"
                >
                    Setting
                </v-btn>
                <v-btn @click="clickLogout()">
                    Log Out
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
