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


const currentUser = useLocalStorage('currentUser', {});
const { userStateObserver } = useAuth();
const {
    getUserInfoByUID,
    refuseMeetingRequest,
    markRead
} = useFirestore();
const { getTimeApm } = useDateTime();
const { capitalize } = useFormat();
const openInboxMessagePopup = ref(false);
const allRequestsReceived = computed(() => {
    return currentUser.value.meetingRequestsReceived;
});

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

// const holdRequestBeforeUpdatedAsRead = currentUser.value.meetingRequestsReceived;
async function clickRequest(request, index) {
    console.log("allRequestsReceived.value[index]: ", allRequestsReceived.value[index]);
    const senderUid = Object.keys(request)[0];
    const allRequestsSentInSenderObj = getSenderObj(senderUid).meetingRequestsSent;
    // console.log('allRequestsSentInSenderObj: ', allRequestsSentInSenderObj);
    const requestBeforeRead = Object.values(allRequestsSentInSenderObj[index])[0]; // 여기서 sender obj에 receiver와 같은 인덱스를 쓰면 안됨. 이것때문에 두번째 read부터 어긋남.
    console.log("requestBeforeRead: ", requestBeforeRead);

    // const requestAfterRead = Object.values(request)[0];
    // requestAfterRead.isRead = true;
    // chosenRequest.value = request;
    
    const requestAfterRead = Object.values(request)[0];
    requestAfterRead.isRead = true;

    // requestBeforeRead.createdAt = new Date(requestBeforeRead.createdAt);
    // const requestAfterRead = JSON.parse(JSON.stringify(requestBeforeRead));
    // requestAfterRead.isRead = true;
    // requestAfterRead.createdAt = new Date(requestBeforeRead.createdAt);

    // console.log("requestBeforeRead.createdAt: ", requestBeforeRead.createdAt);
    // console.log("requestAfterRead.createdAt: ", requestAfterRead.createdAt);
    // chosenRequest.value[senderUid] = requestAfterRead;
    chosenRequest.value[senderUid] = requestAfterRead;
    console.log("requestBeforeRead: ", requestBeforeRead);
    console.log("requestAfterRead: ", requestAfterRead);
    console.log("chosenRequest.value: ", chosenRequest.value);

    openInboxMessagePopup.value = true;

    await markRead(
        senderUid,
        auth.currentUser.uid,
        allRequestsReceived.value,
        requestBeforeRead,
        requestAfterRead
    );
    userStateObserver();
}

async function clickBinIcon(request) {
    await refuseMeetingRequest(
        Object.keys(request)[0],
        auth.currentUser.uid,
        Object.values(request)[0]
    );
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
                    v-if="allRequestsReceived.length > 0"
                    v-for="(request, index) in allRequestsReceived"
                    class="hover:tw-bg-red-300 hover:tw-text-black tw-group"
                >
                    <template #prepend>
                        <v-list-item-action start>
                            <v-checkbox-btn v-model="Object.values(request)[0].status"/>
                        </v-list-item-action>
                    </template>
                    <span @click="clickRequest(request, index)">
                        <div class="tw-text-lg tw-text-indigo-900 tw-font-semibold">
                            {{ Object.values(request)[0].title }}
                        </div>
                        <div class="tw-w-[50%]">
                            {{ Object.values(request)[0].startTime }} - {{ Object.values(request)[0].endTime }}
                        </div>
                        <div class="">
                            from
                            {{ capitalize(getSenderObj(Object.keys(request)[0]).fName) }}
                            {{ capitalize(getSenderObj(Object.keys(request)[0]).lName) }}
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