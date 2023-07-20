<script setup>
import { ref, computed, onBeforeMount } from "vue"
import { useFirestore } from "../../composables/useFirestore";
import { useMeeting } from "../../composables/useMeeting";
import { useLocalStorage } from '@vueuse/core';
import ReceivedRequestsPopup from './ReceivedRequestsPopup.vue';
import InboxMessagePopup from "./InboxMessagePopup.vue";
import { mdiTrashCanOutline } from '@mdi/js';

const currentUser = useLocalStorage('currentUser', {});
const userById = useLocalStorage('userById', {});
// const participants = useLocalStorage('participants', []);
const { getUserInfoByUID } = useFirestore();
const openRequestPopup = ref(false);
const allRequestsReceived = computed(() => currentUser.value.meetingRequestsReceived);
const chosenRequest = ref();


console.log("allRequestsReceived: ", allRequestsReceived.value);


////// fix this later.. (showing sender's name on the list in Inbox)

// const senderObj = ref({});
// function getSenderObj(requestObj) {
//     const senderUid = Object.keys(requestObj);
//     // const meetingObj = Object.values(requestObj)[0];
//     getUserInfoByUID(senderUid)
//     .then(sender => {
//         console.log("sender: ", sender);
//         senderObj.value = sender;
//         console.log("senderObj: ", senderObj.value);
//     });
//     return senderObj.value;
// }

// async function getParticipants(uidsArr) {
//     const participants = [];
//     console.log("uidsArr: ", uidsArr);
//     if (uidsArr.length > 0) {
//         await uidsArr.forEach((uid) => {
//             console.log("uid: ", uid);
//             getUserInfoByUID(uid)
//             .then((obj) => {
//                 console.log("obj: ", obj);
//                 participants.push(obj);
//             })
//         });
//     }
//     console.log("participants: ", participants);
//     return participants;
// }

// const participants = ref({});
// function getParticipant(uid) {
//     participants.value = {};
//     getUserInfoByUID(uid)
//     .then(obj => {
//         console.log("obj: ", obj);
//         participants.value = obj;
//         console.log("participants: ", participants.value);
//     });
// }

function clickRequest(request) {
    openRequestPopup.value = true;
    chosenRequest.value = request;
    console.log("chosenRequest: ", chosenRequest.value);
}

</script>

<template>
    <p>{{ allRequestsReceived }}</p>
    <v-container fluid class="tw-px-5">
        <v-row>
            <v-list
                class="tw-w-full"
                select-strategy="classic"
            >
                <v-list-subheader class="tw-text-black">
                    Requests I received
                </v-list-subheader>
                <v-list-item
                    v-if="allRequestsReceived.length > 0"
                    v-for="request in Object.values(allRequestsReceived)"
                    @click="clickRequest(request)"
                >
                    {{ Object.values(request)[0].title }}
                    <template #prepend>
                        <v-list-item-action start>
                            <v-checkbox-btn v-model="Object.values(request)[0].status">
                            </v-checkbox-btn>
                        </v-list-item-action>
                    </template>
                    <v-list-item-title
                        class="tw-w-[50%]"
                    >
                        {{ Object.values(request)[0].start }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                        class=""
                    >
                        <!-- {{ getParticipants(Object.values(request)[0].participants) }} -->
                        <!-- {{ Object.values(request)[0].participants }} -->
                        <!-- <span v-for="uid in Object.values(request)[0].participants">
                            {{ getParticipant(uid) }}
                        </span> -->
                        <!-- {{ getSenderObj(request) }} -->
                    </v-list-item-subtitle>
                    <template #append>
                        <v-icon start :icon="mdiTrashCanOutline"/>
                    </template>
                    <v-dialog
                        v-model="openRequestPopup"
                        width="auto"
                    >
                        <InboxMessagePopup
                            :requestedMeetingObj="request"
                            width="600px"
                            height="400px"
                        />
                    </v-dialog>
                </v-list-item>
                <v-list-item
                    v-else
                    class="tw-p-5 tw-font-bold"
                >
                    <div
                        class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-[500px]"
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
