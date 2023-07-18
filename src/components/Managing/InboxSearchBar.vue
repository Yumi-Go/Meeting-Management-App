<script setup>
import { ref } from "vue"
import { useFirestore } from '../../composables/useFirestore';
import { useAuth } from "../../composables/useAuth";
import { useSearch } from "../../composables/useSearch";

const {  } = useFirestore();
const { userStateObserver } = useAuth();

const inboxSearchResult = ref([]);
const currentUserInfo = userStateObserver();
const { inboxSearch, getInboxSearchResult } = useSearch();

// function getInboxSearchResult() {
//     if (currentUserInfo.meetingRequestsReceived.length > 0) {
//         if (inboxSearch.value.length > 0) {
//             const input = inboxSearch.value.toLowerCase();
//             inboxSearchResult.value = currentUserInfo.meetingRequestsReceived.filter(
//                 request => request.toLowerCase().match(input));
//         } else {
//             inboxSearchResult.value = currentUserInfo.meetingRequestsReceived;
//         }
//     } else {
//         inboxSearchResult.value = [];
//     }
// }

</script>

<template>
    <v-container fluid class="">
        <!-- <v-row>
            {{ inboxSearchResult }}
        </v-row> -->
        <v-row>
            <v-text-field
                v-model="inboxSearch"
                label="Search"
                color="black"
                bg-color=""
                single-line
                hide-details
                class="tw-mb-1"
                variant="outlined"
                @keypress.enter="getInboxSearchResult"
            >
                <template #append-inner>
                    <!-- <v-icon icon="md:home" @click.prevent="getInboxSearchResult"/> -->
                    <v-icon  @click.prevent="getInboxSearchResult">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </v-icon>
                </template>
            </v-text-field>

        </v-row>
    </v-container>

</template>