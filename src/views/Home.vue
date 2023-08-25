<script setup>
import { ref, watch, onBeforeMount } from "vue"
import { useAuth } from '../composables/useAuth'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import SignIn from '../components/SignIn.vue'
import TabHeader from '../components/TabHeader.vue'
import Account from "./Account.vue"

const { userStateObserver } = useAuth();
const router = useRouter();

userStateObserver();
const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const tabHeaderText = "Home"

function requiredInfoCheck() {
    userStateObserver();
    if (currentUserInLocalStorage.value) {
        if (currentUserInLocalStorage.value.fName === "" || currentUserInLocalStorage.value.lName === "") {
            alert("Please enter your information (at least the first name and last name are required)");
            router.push('/account');
        }
    }
}
requiredInfoCheck();

</script>

<template>
    <SignIn v-if="Object.keys(currentUserInLocalStorage).length < 1"/>
    <v-container v-else fluid class="d-flex flex-column">
        <v-row>
            <TabHeader
                :tabHeaderText="tabHeaderText"
            />
        </v-row>
        <v-row class="flex-1-1-100 tw-bg-black/10">
        </v-row>
    </v-container>
</template>
