<script setup>
import { useAuth } from '../composables/useAuth'
import { auth } from '../firebaseConfig'
import { useLocalStorage } from '@vueuse/core'
import SignIn from '../components/SignIn.vue'
import TabHeader from '../components/TabHeader.vue'
import SearchTitle from "../components/Booking/SearchTitle.vue";
import SearchBar from "../components/Booking/SearchBar.vue";
import SearchResult from "../components/Booking/SearchResult.vue";

const { userStateObserver, requiredInfoCheck } = useAuth();
userStateObserver();
const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const tabHeaderText = "Book a Meeting"
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
        <v-row class="flex-1-1-100">
            <div class="w-100 d-flex flex-column">
                <div class="d-flex">
                    <SearchTitle/>
                </div>
                <div class="d-flex">
                    <SearchBar/>
                </div>
                <div class="d-flex">
                    <SearchResult/>  
                </div>
            </div>
        </v-row>
    </v-container>
</template>