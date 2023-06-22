<script setup>
import { ref, watch } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useFirestore } from '../../composables/useFirestore';
import WeeklyAvailability from './WeeklyAvailability.vue';
import DateAvailability from './DateAvailability.vue'
import { mdiCalendarClock, mdiCalendarEdit } from '@mdi/js';

const router = useRouter();
const { updateWeeklyAvailability, addDateOverrides } = useFirestore();

const days = ref({
    monday: [true, timeItems()[36], timeItems()[20], true, true],
    tuesday: [true, timeItems()[36], timeItems()[20], true, true],
    wednesday: [true, timeItems()[36], timeItems()[20], true, true],
    thursday: [true, timeItems()[36], timeItems()[20], true, true],
    friday: [true, timeItems()[36], timeItems()[20], true, true],
    saturday: [false, timeItems()[36], timeItems()[20], true, true],
    sunday: [false, timeItems()[36], timeItems()[20], true, true]
}); // [unavailable true/false, 09:00am(initial value of From), 05:00pm(initial value of Until), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

watch(days.value, (newDays) => {
    console.log("newDays: ", newDays);
});

function timeItems() {
    var interval = 15;
    var times = [];
    var minuteSum = 0;
    for (var i = 0; minuteSum < 60*12; i++) {
        var hour = Math.floor(minuteSum / 60);
        var minute = (minuteSum % 60);
        times[i] = ("0" + (hour % 12)).slice(-2) + ':' + ("0" + minute).slice(-2);
        minuteSum = minuteSum + interval;
    }
    return times;
}

function saveAvailability() {
    updateWeeklyAvailability(days.value);
}


</script>

<template>
    <v-container fluid class="bg-white ma-0">
        <v-row>
            <v-col cols="7">
                <v-icon
                    :icon="mdiCalendarClock"
                    color="grey"
                    start
                />
                <span class="tw-align-middle">
                    Weekly Schedule
                </span>
            </v-col>
            <v-col cols="5">
                <v-icon
                    :icon="mdiCalendarEdit"
                    color="grey"
                    start
                />
                <span class="tw-align-middle">
                    Date overrides
                </span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="7" class="">
                <WeeklyAvailability
                    :days="days"
                    :timeItems="timeItems"
                    @saveAvailability="saveAvailability" 
                />
            </v-col>
            <v-col
                cols="5"
                class="tw-border-l-2 tw-border-gray-100"
            >
                <DateAvailability
                    :timeItems="timeItems"
                />
            </v-col>
        </v-row>
        <v-row class="mt-10">
            <v-col class="mr-1 ml-2 pa-0">
                <v-btn
                    width="100%"
                    height="40"
                    color="grey"
                    class=""
                    variant="tonal"
                    @click="router.push('/')"
                >
                    Cancel
                </v-btn>
            </v-col>
            <v-col class="ml-1 mr-2 pa-0">
                <v-btn
                    width="100%"
                    height="40"
                    color="black"
                    class=""
                    variant="tonal"
                    @click="saveAvailability(days)"
                    type="submit"
                >
                    Save
                </v-btn>
            </v-col>
        </v-row>
    </v-container>

</template>
