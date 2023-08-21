<script setup>
import { ref } from "vue"
import { useAuth } from '../composables/useAuth'
import { useLocalStorage } from '@vueuse/core'
import SignIn from '../components/SignIn.vue'
import TabHeader from '../components/TabHeader.vue'
import InboxSearchBar from '../components/Inbox/InboxSearchBar.vue'
import InboxSearchResult from '../components/Inbox/InboxSearchResult.vue'

const { userStateObserver } = useAuth();
const currentUser = useLocalStorage('currentUser', {});

userStateObserver();

const tabHeaderText = 'inbox';

</script>

<template>
    <SignIn v-if="Object.keys(currentUser).length < 1"/>
    <v-container v-else fluid class="d-flex flex-column">
        <v-row>
            <TabHeader
                :tabHeaderText="tabHeaderText"
            />
        </v-row>
        <v-row class="flex-1-1-100">
            <div class="w-100 d-flex flex-column">
                <div class="d-flex">
                    <InboxSearchBar/>
                </div>
                <div class="d-flex">
                    <InboxSearchResult/>
                </div>
            </div>
        </v-row>
    </v-container>
</template>
