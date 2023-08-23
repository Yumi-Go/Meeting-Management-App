<script setup>
import { ref, watch, computed, onBeforeMount } from "vue"
import { auth } from '../../firebaseConfig'
import { useFirestore } from "../../composables/useFirestore";
import { useDateTime } from '../../composables/useDateTime';
import { useFormat } from "../../composables/useFormat";
import { useLocalStorage } from '@vueuse/core';
import InboxMessagePopup from "./InboxMessagePopup.vue";
import { mdiTrashCanOutline } from '@mdi/js';

const currentUser = useLocalStorage('currentUser', {});
const { getUserInfoByUID, readMessage } = useFirestore();
const { getTimeApm } = useDateTime();
const { capitalize } = useFormat();
const openInboxMessagePopup = ref(false);
const allRequestsReceived = computed(() => {
    return currentUser.value.meetingRequestsReceived;
});
const chosenRequest = ref();

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

async function clickRequest(index) {
    openInboxMessagePopup.value = true;
    const clickedMeetingRequestsReceived = allRequestsReceived.value;
    Object.values(clickedMeetingRequestsReceived[index])[0].isRead = true;
    chosenRequest.value = clickedMeetingRequestsReceived[index];
    await readMessage(
        Object.keys(clickedMeetingRequestsReceived[index])[0],
        auth.currentUser.uid,
        clickedMeetingRequestsReceived
    );
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
                    v-if="allRequestsReceived.length > 0"
                    v-for="(request, index) in Object.values(allRequestsReceived)"
                    @click="clickRequest(index)"
                    class=""
                >
                    <template #prepend>
                        <v-list-item-action start>
                            <v-checkbox-btn v-model="Object.values(request)[0].status">
                            </v-checkbox-btn>
                        </v-list-item-action>
                    </template>
                    <span class="tw-text-lg tw-text-indigo-900 tw-font-semibold">
                        {{ Object.values(request)[0].title }}
                    </span>
                    <v-list-item-title
                        class="tw-w-[50%]"
                    >
                        {{ Object.values(request)[0].startTime }} - {{ Object.values(request)[0].endTime }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                        class=""
                    >
                        from
                        {{ capitalize(getSenderObj(Object.keys(request)[0]).fName) }}
                        {{ capitalize(getSenderObj(Object.keys(request)[0]).lName) }}

                    </v-list-item-subtitle>
                    <template #append>
                        <v-icon start :icon="mdiTrashCanOutline"/>
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
