<script setup>
import { ref, onBeforeMount } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { auth } from '../../firebaseConfig'
import { useAuth } from '../../composables/useAuth'
import { useFirestore } from '../../composables/useFirestore';
import { useFormat } from '../../composables/useFormat'
import { useDateTime } from '../../composables/useDateTime';
import { mdiAccountCircleOutline } from '@mdi/js';

const { userStateObserver } = useAuth();
const { getTimeApm, getDuration } = useDateTime();
const { getUserInfoByUID, acceptMeetingRequest, refuseMeetingRequest } = useFirestore();
const { capitalize, formatFullName } = useFormat();
const senderInLocalStorage = useLocalStorage('sender', {});

const props = defineProps({requestedMeetingObj: Object});
const emit = defineEmits(['closeInboxMessagePopup']);

// 여기 하다 말음.. 
function getMeetingObjToDisplay() {
    const result = {};
    for (const [key, value] of Object.entries(props.requestedMeetingObj)) {
        if (key === 'startTime' || key === 'endTime') {
            if (value.length > 0) {
                result[key] = getTimeApm(value);
            }
        }
        if (key === 'duration') {

        }
        if (key === 'organizer' && value.length > 0) {
            result[key] = value;
        }
    }
}

getMeetingObjToDisplay();

async function clickAcceptBtn() {
    await acceptMeetingRequest(props.requestedMeetingObj);
    emit('closeInboxMessagePopup');
    userStateObserver();
}

async function clickDismissBtn() {
    await refuseMeetingRequest(props.requestedMeetingObj);
    emit('closeInboxMessagePopup');
    userStateObserver();
}

// userStateObserver();

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
                        <span class="tw-text-gray-500 tw-font-semibold tw-text-sm mr-2 ">
                            From |
                        </span> 
                        <v-chip
                            class="ma-0"
                            color="default"
                            label
                        >
                            <v-icon start :icon="mdiAccountCircleOutline"/>
                            {{ formatFullName(senderInLocalStorage.fName, senderInLocalStorage.mName, senderInLocalStorage.lName) }}
                            <!-- {{ capitalize(getSenderObj().fName) }} {{ capitalize(getSenderObj().lName) }} -->
                        </v-chip>
                    </div>
                    <div class="tw-text-xl tw-border-b tw-border-indigo-300 tw-text-indigo-900 tw-font-bold">
                        {{ requestedMeetingObj.title }}
                    </div>
                </v-sheet>
            </v-row>
            <v-row no-gutters>
                <v-sheet class="pa-2 ma-2 tw-w-full">
                    <v-list>
                        <v-list-item v-for="[key, value] in Object.entries(requestedMeetingObj)">
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

