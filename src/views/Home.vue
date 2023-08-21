<script setup>
import { ref, watch, onBeforeMount } from "vue"
import { useAuth } from '../composables/useAuth'
import { useLocalStorage } from '@vueuse/core'
import SignIn from '../components/SignIn.vue'
import TabHeader from '../components/TabHeader.vue'

const { userStateObserver } = useAuth();

userStateObserver();
const currentUser = useLocalStorage('currentUser', {});
// const tabHeaderText = `Welcome, ${currentUser.value.fName}!`

</script>

<template>
    <SignIn v-if="Object.keys(currentUser).length < 1"/>
    <v-container v-else fluid class="d-flex flex-column">
        <v-row>
            <TabHeader
                :tabHeaderText="`Welcome, ${currentUser.fName}!`"
            />
        </v-row>
        <v-row class="flex-1-1-100 tw-bg-black/10">
            hahaha
        </v-row>
    </v-container>
</template>
