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
const senderInLocalStorage = useLocalStorage('sender', {});
const { userStateObserver } = useAuth();
const {
    getUserInfoByUID,
    refuseMeetingRequest,
    markRead
} = useFirestore();
const { getTimeApm } = useDateTime();
const { capitalize, formatFullName } = useFormat();
const openInboxMessagePopup = ref(false);
const chosenRequest = ref({});

// const allRequestsReceived = computed(() => {
//     return currentUserInLocalStorage.value.meetingsReceived;
// });

function closeInboxMessagePopup() {
    openInboxMessagePopup.value = false;
}

function getSenderName(senderUid) {
    getUserInfoByUID(senderUid)
    .then(info => {
        for (const [key, value] of Object.entries(info)) {
            senderInLocalStorage.value[key] = value;
        }
    });
    return formatFullName(senderInLocalStorage.value.fName, senderInLocalStorage.value.mName, senderInLocalStorage.value.lName);
}

async function clickRequest(request) {
    openInboxMessagePopup.value = true;
    await markRead(request);
    chosenRequest.value = request;
    // userStateObserver();
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
                    class="hover:tw-bg-gray-200 hover:tw-text-black tw-group"
                >
                    <template #prepend>
                        <v-list-item-action start>
                            <v-checkbox-btn v-model="request.status"/>
                        </v-list-item-action>
                    </template>
                    <span @click="clickRequest(request)">
                        <div class="tw-text-lg tw-text-red-900 tw-font-extrabold">
                            {{ request.title }}
                        </div>
                        <div class="tw-w-[50%] tw-text-gray-500">
                            <span class="tw-mr-2">
                                {{ request.date }}
                            </span>
                            <span class="">
                                {{ request.startTime }} - {{ request.endTime }}
                            </span>
                        </div>
                        <div class="tw-italic">
                            <span class="tw-text-gray-400">from </span>
                            <span class="">
                                {{ getSenderName(request.sender) }}
                            </span>
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
                    <div class="tw-flex tw-flex-col tw-justify-center tw-items-center">
                        <div>
                            No Result
                        </div>
                    </div>
                </v-list-item>
            </v-list>
        </v-row>
    </v-container>
</template>