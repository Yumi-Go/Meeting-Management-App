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

const overriddenDates = ref([]); // [[date, fromTime, untilTime], [date, fromTime, untilTime], ...]
const fromUntilTime = ref([]); // [09:00am(initial value of From), 05:00pm(initial value of Until), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

watch(days.value, (newDays) => {
    console.log("newDays: ", newDays);
});

watch(overriddenDates.value, (newVal) => {
    console.log("updated allOverriddenDates in Availability.vue: ", newVal);
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

function mergePickedDateTime() {
    // piekced From/Until times from combobox
    const times = fromUntilTime.value.map((timeArr) => {
        let fromHour = Number(timeArr[0].split(":")[0]);
        fromHour = timeArr[2] === false ? fromHour += 12 : fromHour; // PM
        let fromMinute = Number(timeArr[0].split(":")[1]);
        let untilHour = Number(timeArr[1].split(":")[0]);
        untilHour = timeArr[3] === false ? untilHour += 12 : untilHour; // PM
        let untilMinute = Number(timeArr[1].split(":")[1]);
        return [fromHour, fromMinute, untilHour, untilMinute];
    });
    console.log("times: ", times);

    // picked date from Date picker
    const dates = overriddenDates.value.map((date) => {
        console.log("date before getYear, getMonth, getDay: ", date);
        return [date.getFullYear(), date.getMonth(), date.getDate()]
    });
    console.log("dates: ", dates);

    // merge date(from date picker) and time(from combobox)
    // here, convert time from Irish Standard Time to GMT (+1 hour) with getTimeezondOffset
    const datesTimesMerged = dates.map((date, i) => {
        const fromObj = () => {
            const dateObj = new Date(date[0], date[1], date[2], times[i][0], times[i][1]);
            const tzOffset = dateObj.getTimezoneOffset() * 60 * 1000;
            return new Date(dateObj.getTime() - tzOffset);
        }
        const untilObj = () => {
            const dateObj = new Date(date[0], date[1], date[2], times[i][2], times[i][3]);
            const tzOffset = dateObj.getTimezoneOffset() * 60 * 1000;
            return new Date(dateObj.getTime() - tzOffset);
        }
        return [fromObj(), untilObj()];
    });
    console.log("date&time merging result: ", datesTimesMerged);
    return datesTimesMerged;
}

function saveAvailability() {
    updateWeeklyAvailability(days.value);
    addDateOverrides(mergePickedDateTime());
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
                    :overriddenDates = "overriddenDates"
                    :fromUntilTime = "fromUntilTime"
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
                    @click="saveAvailability()"
                    type="submit"
                >
                    Save
                </v-btn>
            </v-col>
        </v-row>
    </v-container>

</template>
