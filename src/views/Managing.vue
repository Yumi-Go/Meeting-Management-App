<script setup>
import { ref, watch, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import SignIn from '../components/SignIn.vue'
import TabHeader from '../components/TabHeader.vue'
import Availability from '../components/Managing/Availability.vue';
import Calendar from '../components/Managing/Calendar.vue'
import { mdiClockEditOutline, mdiCalendarMonth, mdiCalendarMonthOutline, mdiViewList } from '@mdi/js';

const { userStateObserver } = useAuth();
userStateObserver();

const currentUser = useLocalStorage('currentUser', {});
const router = useRouter();
const tabHeaderText = "Manage Schedules"
const showAvailability = ref(false);
// const showInbox = ref(false);
const viewType = ref(true); // true: Calendar view / false: List view

const isUnreadMsgExist = ref(false);

watch(currentUser.value.meetingRequestsReceived, (updatedRequests) => {
    checkUnreadMsg();
    console.log("isUnreadMsgExist.value: ", isUnreadMsgExist.value);
});

// function reloadInbox() {
//     router.push('/managing');
//     showInbox.value = true;
// }
// provide('refreshInbox', {showInbox, reloadInbox});

function clickAvailabilityBtn() {
    showAvailability.value = !showAvailability.value;
    // showInbox.value = false;
}

// function checkUnreadMsg() {
//     for (const requestObj of currentUser.value.meetingRequestsReceived) {
//         if (!Object.values(requestObj)[0].isRead) {
//             isUnreadMsgExist.value = true;
//             break;
//         }
//     }
// }

function clickCalendarBtn() {
    viewType.value = true;
    showAvailability.value = false;
}

function clickListBtn() {
    viewType.value = false;
    showAvailability.value = false;
}

// checkUnreadMsg();

</script>

<template>
    <SignIn v-if="Object.keys(currentUser).length < 1"/>
    <v-container v-else fluid class="d-flex flex-column">
        <v-row class="">
            <TabHeader
                :tabHeaderText="tabHeaderText"
            />
        </v-row>
        <v-row class="flex-1-1-100">
            <div class="w-100 d-flex flex-column">
                <div class="w-100 d-flex justify-space-between">
                    <div class="text-left">
                        <v-btn
                            @click="clickAvailabilityBtn"
                            variant="plain"
                            class="ml-0 pl-1"
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
                        <v-btn-toggle
                            v-model="viewType"
                            rounded="0"
                            variant="plain"
                            color="indigo-darken-4"
                            group
                        >
                            <v-btn
                                @click="clickCalendarBtn"
                                value="true"
                                :ripple="false"
                                class="mr-0 pr-0"
                            >
                                <template #prepend>
                                    <v-icon color="" :icon="mdiCalendarMonth"/>
                                </template>
                                Calendar View
                            </v-btn>
                            <v-btn
                                @click="clickListBtn"
                                value="false"
                                :ripple="false"
                                class="mr-0 pr-0"
                            >
                                <template #prepend>
                                    <v-icon color="" :icon="mdiViewList"/>
                                </template>
                                List View
                            </v-btn>
                        </v-btn-toggle>
                    </div>
                </div>
                <div class="w-100 d-flex pa-0">
                    <Availability v-if="showAvailability"/>
                    <div v-else class="w-100">
                        <div class="w-100">
                            <Calendar v-if="viewType"/>
                        </div>
                    </div>
                </div>
            </div>
        </v-row>
    </v-container>
</template>