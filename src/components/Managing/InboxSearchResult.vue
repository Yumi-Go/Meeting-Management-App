<script setup>
import { ref, computed } from "vue"
import { useMeeting } from "../../composables/useMeeting";
import { useLocalStorage } from '@vueuse/core';
import ReceivedRequestsPopup from './ReceivedRequestsPopup.vue';

const currentUser = useLocalStorage('currentUser', []);
const openRequestPopup = ref(false);
// const allRequestsReceived = computed(() => {
//     if (currentUser.value.meetingRequestsReceived.length > 0) {
//         return currentUser.value.meetingRequestsReceived.map(
//             request => request.title
//         );
//     } else {
//         return [];
//     }
// });
const allRequestsReceived = currentUser.value.meetingRequestsReceived;
const chosenRequest = ref();

console.log("allRequestsReceived: ", allRequestsReceived);

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
                    v-for="request in allRequestsReceived"
                >
                    {{ request.title }}
                    <template #prepend>
                        <v-list-item-action start>
                            <v-checkbox-btn v-model="allRequestsReceived.status">
                            </v-checkbox-btn>
                        </v-list-item-action>
                    </template>
                    <v-list-item-title
                        class="tw-w-[50%]"
                    >
                        {{ request.start }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                        class=""
                    >
                        {{ request.participants }}
                    </v-list-item-subtitle>
                    <template #append>
                        <v-btn
                            @click="clickRequest(request)"
                            variant="tonal"
                        >
                            Open Dialog
                        </v-btn>
                    </template>
                    <v-dialog
                        v-model="openRequestPopup"
                        width="auto"
                    >
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
