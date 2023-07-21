<script setup>
import { ref, inject, onBeforeMount } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { auth } from '../../firebaseConfig'
import { useAuth } from '../../composables/useAuth'
import { useFirestore } from '../../composables/useFirestore';
import { useFormat } from '../../composables/useFormat'
import { mdiAccountCircleOutline } from '@mdi/js';

const temptUser = useLocalStorage('tempUser', {});
const { showInbox, reloadInbox } = inject('refreshInbox');
const { userStateObserver } = useAuth();

const props = defineProps({
    requestedMeetingObj: Object,
});
const emit = defineEmits(['closeInboxMessagePopup']);

const { getUserInfoByUID, acceptMeetingRequest, refuseMeetingRequest } = useFirestore();
const { capitalize } = useFormat();
// console.log("requestedMeetingObj: ", props.requestedMeetingObj);

const senderUid = Object.keys(props.requestedMeetingObj)[0];
const meetingObj = Object.values(props.requestedMeetingObj)[0];
const senderObj = ref({});

function getSenderObj() {
    getUserInfoByUID(senderUid)
    .then(sender => {
        console.log("sender: ", sender);
        senderObj.value = sender;
        console.log("senderObj: ", senderObj.value);
    });
}

async function clickAcceptBtn() {
    await acceptMeetingRequest(senderUid, auth.currentUser.uid, meetingObj);
    emit('closeInboxMessagePopup');
    userStateObserver();
    reloadInbox();
}

async function clickDismissBtn() {
    await refuseMeetingRequest(senderUid, auth.currentUser.uid, meetingObj);
    emit('closeInboxMessagePopup');
    userStateObserver();
    reloadInbox();
}

onBeforeMount(() => {
    getSenderObj();
});

</script>

<template>
    <v-card
        class="mx-auto"
        color="blue-grey-lighten-5"
    >
        <v-toolbar flat color="blue-grey-darken-4">
            <v-toolbar-title class="font-weight-bold">
                Meeting Request
            </v-toolbar-title>
        </v-toolbar>
        <v-container fluid class="">
            <v-row no-gutters>
                <v-sheet class="px-2 pb-1 tw-w-full" color="transparent">
                    <div class="mb-3">
                        <span class="tw-text-gray-500 tw-font-semibold tw-text-sm mr-2 ">From |</span> 
                        <v-chip
                            class="ma-0"
                            color="default"
                            label
                        >
                            <v-icon start :icon="mdiAccountCircleOutline"/>
                            {{ capitalize(senderObj.fName) }} {{ capitalize(senderObj.lName) }}
                        </v-chip>
                    </div>
                    <div class="tw-text-xl tw-border-b tw-border-indigo-300 tw-text-indigo-900 tw-font-bold">
                        {{ meetingObj.title }}
                    </div>
                </v-sheet>
            </v-row>
            <v-row no-gutters>
                <v-sheet class="pa-2 ma-2 tw-w-full">
                    <v-list>
                        <v-list-item v-for="[key, value] in Object.entries(meetingObj)">
                            <template #subtitle>
                                {{ capitalize(key) }}
                            </template>
                            {{ value }}
                        </v-list-item>
                        <v-list-item>
                            <v-btn block variant="tonal" class="">
                                Check My Schedule
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-sheet>
            </v-row>
        </v-container>
        
        <v-card-actions class="d-flex justify-center mb-10 py-0">
            <v-btn
                @click="clickAcceptBtn"
                color="indigo-darken-3"
                variant="flat"
                width="30%"
            >
                Accept
            </v-btn>
            <v-btn
                @click="clickDismissBtn"
                color="indigo-darken-3"
                variant="outlined"
                width="30%"
            >
                Dismiss
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

