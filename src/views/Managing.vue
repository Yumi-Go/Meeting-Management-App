<script setup>
import { ref, watch, provide } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import SignIn from '../components/SignIn.vue'
import TabHeader from '../components/TabHeader.vue'
import Availability from '../components/Managing/Availability.vue';
import Calendar from '../components/Managing/Calendar.vue'
import List from '../components/Managing/List.vue'
import { mdiClockEditOutline, mdiCalendarMonth, mdiCalendarMonthOutline, mdiViewList } from '@mdi/js';

const { userStateObserver, isRequiredInfoEntered } = useAuth();
const router = useRouter();
userStateObserver();

const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const tabHeaderText = "Manage Schedules"
const showAvailability = ref(false);
const viewType = ref(true); // true: Calendar view / false: List view

function clickAvailabilityBtn() {
    showAvailability.value = !showAvailability.value;
}

function clickCalendarBtn() {
    viewType.value = true;
    showAvailability.value = false;
}

function clickListBtn() {
    viewType.value = false;
    showAvailability.value = false;
}

function requiredInfoCheck() {
    if (!isRequiredInfoEntered()) {
        router.push('/account');
    }
}
requiredInfoCheck();

</script>

<template>
    <SignIn v-if="Object.keys(currentUserInLocalStorage).length < 1"/>
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
                            <List v-else/>
                        </div>
                    </div>
                </div>
            </div>
        </v-row>
    </v-container>
</template>