<script setup>
import { ref, watch, computed, onBeforeMount } from "vue"
import { auth } from '../../firebaseConfig'
import { useAuth } from '../../composables/useAuth'
import { useFirestore } from "../../composables/useFirestore";
import { useDateTime } from '../../composables/useDateTime';
import { useFormat } from "../../composables/useFormat";
import { useLocalStorage } from '@vueuse/core';
import InboxMessagePopup from "./InboxMessagePopup.vue";
import { mdiTrashCanOutline } from '@mdi/js';
import _ from 'lodash';


const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const { userStateObserver } = useAuth();
const {
    getUserInfoByUID,
    refuseMeetingRequest,
    markRead
} = useFirestore();
const { getTimeApm } = useDateTime();
const { capitalize } = useFormat();
const openInboxMessagePopup = ref(false);
// const allRequestsReceived = computed(() => {
//     return currentUserInLocalStorage.value.meetingsReceived;
// });

const chosenRequest = ref({});
// const requestToDelete = ref();

function closeInboxMessagePopup() {
    openInboxMessagePopup.value = false;
}

let senderObj = {};
function getSenderObj(senderUid) {
    getUserInfoByUID(senderUid)
    .then(sender => {
        senderObj = sender;
    });
    return senderObj;
}

async function clickRequest(request) {
    openInboxMessagePopup.value = true;
    await markRead(request);
    chosenRequest.value = request;
    console.log("chosenRequest: ", chosenRequest.value);
    userStateObserver();
}

async function clickBinIcon(request) {
    await refuseMeetingRequest(request);
    userStateObserver();
}

</script>

<template>
    <v-container fluid class="tw-px-5">
        <v-row class="">
            <v-list
                class="tw-w-full"
                select-strategy="classic"
            >
                <v-list-subheader class="tw-text-black">
                    Requests I received
                </v-list-subheader>





                <v-list-item
                    v-if="currentUserInLocalStorage.meetingsReceived"
                    v-for="request in currentUserInLocalStorage.meetingsReceived"
                    class="hover:tw-bg-red-300 hover:tw-text-black tw-group"
                >
                    <template #prepend>
                        <v-list-item-action start>
                            <v-checkbox-btn v-model="request.status"/>
                        </v-list-item-action>
                    </template>
                    <span @click="clickRequest(request)">
                        <div class="tw-text-lg tw-text-indigo-900 tw-font-semibold">
                            {{ request.title }}
                        </div>
                        <div class="tw-w-[50%]">
                            {{ request.startTime }} - {{ request.endTime }}
                        </div>
                        <div class="">
                            from
                            {{ capitalize(getSenderObj(request.sender).fName) }}
                            {{ capitalize(getSenderObj(request.sender).lName) }}
                        </div>
                    </span>
                    <template #append>
                        <v-icon
                            start
                            :icon="mdiTrashCanOutline"
                            @click="clickBinIcon(request)"
                            class="tw-invisible group-hover:tw-visible"
                        />
                    </template>
                    <v-dialog
                        v-model="openInboxMessagePopup"
                        width="auto"
                    >
                        <InboxMessagePopup
                            :requestedMeetingObj="chosenRequest"
                            @closeInboxMessagePopup="closeInboxMessagePopup"
                            width="600px"
                            height="400px"
                        />
                    </v-dialog>
                    <v-divider
                        color="red-darken-4"
                        class="tw-border-indigo-900"
                    />
                </v-list-item>



                <v-list-item
                    v-else
                    class="tw-p-5 tw-font-bold"
                >
                    <div
                        class="tw-flex tw-flex-col tw-justify-center tw-items-center"
                    >
                        <div>
                            No Result
                        </div>
                    </div>
                </v-list-item>
            </v-list>
        </v-row>
    </v-container>
</template>