<script setup>
import { ref, watch } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useFirestore } from '../../composables/useFirestore';
import { useDateTime } from '../../composables/useDateTime'
import WeeklyAvailability from './WeeklyAvailability.vue';
import DateAvailability from './DateAvailability.vue'
import { mdiCalendarClock, mdiCalendarEdit } from '@mdi/js';

const router = useRouter();
const { updateWeeklyAvailability, addDateOverrides } = useFirestore();
const { timeItems } = useDateTime();

const days = ref({
    monday: [true, timeItems()[36], true, timeItems()[20], false], // [checked true/false, from, am(true), until, pm(false)]
    tuesday: [true, timeItems()[36], true, timeItems()[20], false],
    wednesday: [true, timeItems()[36], true, timeItems()[20], false],
    thursday: [true, timeItems()[36], true, timeItems()[20], false],
    friday: [true, timeItems()[36], true, timeItems()[20], false],
    saturday: [false, timeItems()[36], true, timeItems()[20], false],
    sunday: [false, timeItems()[36], true, timeItems()[20], false]
});

const overrideDates = ref([]); // [[date, fromTime, untilTime], [date, fromTime, untilTime], ...]
const overrideTimes = ref([]); // [09:00am(initial value of From), 05:00pm(initial value of Until), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

function weeklyDaysTimes() {
    const dayOfWeek = {};
    for (const [key, value] of Object.entries(days.value)) {
        if (value[0]) {
            const valArr = [];
            for (let i = 1; i < 5; i++) {
                valArr.push(value[i]);
            }
            dayOfWeek[key] = valArr;
        }
    }
    return dayOfWeek;
}

function overrideDatesTimes() {
    // piekced From/Until times from combobox
    const times = overrideTimes.value.map((timeArr) => {
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
    const dates = overrideDates.value.map((date) => {
        console.log("date before getYear, getMonth, getDay: ", date);
        return [date.getFullYear(), date.getMonth(), date.getDate()]
    });
    console.log("dates: ", dates);

    // merge date(from date picker) and time(from combobox)
    // here, convert time from Irish Standard Time to GMT (+1 hour) with getTimeezondOffset
    const datesTimesMerged = dates.map((date, i) => {
        const fromObj = () => {
            const dateObj = new Date(date[0], date[1], date[2], times[i][0], times[i][1]);
            // const tzOffset = dateObj.getTimezoneOffset() * 60 * 1000;
            // return new Date(dateObj.getTime() - tzOffset);
            return new Date(dateObj.getTime());
        }
        const untilObj = () => {
            const dateObj = new Date(date[0], date[1], date[2], times[i][2], times[i][3]);
            // const tzOffset = dateObj.getTimezoneOffset() * 60 * 1000;
            // return new Date(dateObj.getTime() - tzOffset);
            return new Date(dateObj.getTime());
        }
        return [fromObj(), untilObj()];
    });
    console.log("date&time merging result: ", datesTimesMerged);
    return datesTimesMerged;
}

function saveAvailability() {
    updateWeeklyAvailability(weeklyDaysTimes());
    addDateOverrides(overrideDatesTimes());
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
                    @saveAvailability="saveAvailability" 
                />
            </v-col>
            <v-col
                cols="5"
                class="tw-border-l-2 tw-border-gray-100"
            >
                <DateAvailability
                    :overrideDates = "overrideDates"
                    :overrideTimes = "overrideTimes"
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
