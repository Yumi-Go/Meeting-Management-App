<script setup>
import { ref, watch, provide } from 'vue'
import Inbox from '../components/Managing/Inbox.vue'
import Availability from '../components/Managing/Availability.vue';
import Calendar from '../components/Managing/Calendar.vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { userStateObserver } = useAuth();
userStateObserver();

const currentUser = useLocalStorage('currentUser', {});
// const receivedRequests = currentUser.value.meetingRequestsReceived;

const router = useRouter();
const showAvailability = ref(false);
const showInbox = ref(false);
const showCalendar = ref(false);
const showList = ref(false);
const showChart = ref(false);

const isUnreadMsgExist = ref(false);

watch(currentUser.value.meetingRequestsReceived, (updatedRequests) => {
    checkUnreadMsg();
    console.log("isUnreadMsgExist.value: ", isUnreadMsgExist.value);
});

function reloadInbox() {
    router.push('/managing');
    showInbox.value = true;
}
provide('refreshInbox', {showInbox, reloadInbox});

function clickAvailabilityBtn() {
    showAvailability.value = !showAvailability.value;
    showInbox.value = false;
}

function checkUnreadMsg() {
    for (const requestObj of currentUser.value.meetingRequestsReceived) {
        if (!Object.values(requestObj)[0].isRead) {
            isUnreadMsgExist.value = true;
            break;
        }
    }
}

function clickInboxBtn() {
    showInbox.value = !showInbox.value;
    showAvailability.value = false;
}

function clickCalendarBtn() {
    showCalendar.value = !showCalendar.value;
    showList.value = false;
    showChart.value = false;
}

function clickListBtn() {
    showCalendar.value = false;
    showList.value = !showList.value;
    showChart.value = false;
}

function clickChartBtn() {
    showCalendar.value = value;
    showList.value = false;
    showChart.value = !showChart.value;
}

checkUnreadMsg();

</script>

<template>
    <div class="d-flex justify-space-between">
        <div class="text-left">
            <v-btn
                @click="clickAvailabilityBtn"
                variant="outlined"
            >
                <template #prepend>
                    <v-icon color="">
                        <span class="material-symbols-outlined">
                            more_time
                        </span>
                    </v-icon>
                </template>
                    Set Availability
            </v-btn>
        </div>
        <div class="text-right">
            <v-btn
                @click="clickInboxBtn"
                variant="outlined"
                :color="isUnreadMsgExist ? 'red' : 'black'"
            >
                <template #prepend>
                    <v-icon v-if="isUnreadMsgExist" color="red">
                        <span class="material-symbols-outlined">
                            mark_email_unread
                        </span>
                    </v-icon>
                    <v-icon v-else color="black">
                        <span class="material-symbols-outlined">
                            mail
                        </span>
                    </v-icon>

                </template>
                    Inbox
            </v-btn>
        </div>
    </div>
    <div class="tw-w-[100%]">
        <Inbox v-if="showInbox"/>
        <Availability v-else-if="showAvailability"/>
        <div v-else>
            <div class="d-flex justify-space-between">
                <div class="">
                    <v-btn
                        @click="clickCalendarBtn"
                        variant="outlined"
                    >
                        <template #prepend>
                            <v-icon color="">
                                <span class="material-symbols-outlined">
                                    more_time
                                </span>
                            </v-icon>
                        </template>
                            Calendar
                    </v-btn>
                </div>

                <div class="">
                    <v-btn
                        @click="clickListBtn"
                        variant="outlined"
                    >
                        <template #prepend>
                            <v-icon color="">
                                <span class="material-symbols-outlined">
                                    more_time
                                </span>
                            </v-icon>
                        </template>
                            List
                    </v-btn>
                </div>
            </div>
            <div>


                <Calendar/>
                

            </div>


        </div>
    </div>



</template>