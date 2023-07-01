<script setup>
import { ref } from 'vue'
import Inbox from '../components/Managing/Inbox.vue'
import Availability from '../components/Managing/Availability.vue';
import Calendar from '../components/Managing/Calendar.vue'

const showAvailability = ref(false);
const showInbox = ref(false);
const showCalendar = ref(false);
const showList = ref(false);
const showChart = ref(false);

function clickAvailabilityBtn() {
    showAvailability.value = !showAvailability.value;
    showInbox.value = false;
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
            >
                <template #prepend>
                    <v-icon color="">
                        <span class="material-symbols-outlined">
                            mail
                        </span>
                    </v-icon>
                    <v-icon color="red">
                        <span class="material-symbols-outlined">
                            mark_email_unread
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

                <div class="">
                    <v-btn
                        @click="clickChartBtn"
                        variant="outlined"
                    >
                        <template #prepend>
                            <v-icon color="">
                                <span class="material-symbols-outlined">
                                    mail
                                </span>
                            </v-icon>
                            <v-icon color="red">
                                <span class="material-symbols-outlined">
                                    mark_email_unread
                                </span>
                            </v-icon>
                        </template>
                            Chart
                    </v-btn>
                </div>
            </div>
            <div>


                <Calendar/>
                

            </div>


        </div>
    </div>



</template>