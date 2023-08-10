<script setup>
import { ref, watch } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth';
import { useFirestore } from '../../composables/useFirestore';
import { useDateTime } from '../../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import WeeklyAvailability from './WeeklyAvailability.vue';
import DateAvailability from './DateAvailability.vue'
import { mdiCalendarClock, mdiCalendarEdit } from '@mdi/js';

const { currentUser } = useAuth();
const { getUserInfoByUID, updateWeeklyAvailability, addDateOverrides } = useFirestore();
const { timeItems, timeItemsIn24hrs, removeApmFromTimeArr, generateApmWithTimeArr } = useDateTime();
const router = useRouter();
const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const weeklyAvailability = ref(currentUserInLocalStorage.value.weeklyAvailability);
const overrideDates = ref([]); // [[date, fromTime, untilTime], [date, fromTime, untilTime], ...]
const overrideTimes = ref([]); // [09:00am(initial value of From), 05:00pm(initial value of Until), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

// watch(weeklyAvailability, (updatedWeeklyAvailability) => {
//     loadStoredValue();
//     console.log("updatedWeeklyAvailability: ", updatedWeeklyAvailability);
// });

// watch(overrideDates, (updatedOverrideDates) => {
//     console.log("updatedOverrideDates: ", updatedOverrideDates);
// });

// watch(overrideTimes, (updatedOverrideTimes) => {
//     console.log("updatedOverrideTimes: ", updatedOverrideTimes);
// });

const days = ref({
    monday: [true, timeItems()[36], true, timeItems()[20], false], // [checked true/false, from, am(true), until, pm(false)]
    tuesday: [true, timeItems()[36], true, timeItems()[20], false],
    wednesday: [true, timeItems()[36], true, timeItems()[20], false],
    thursday: [true, timeItems()[36], true, timeItems()[20], false],
    friday: [true, timeItems()[36], true, timeItems()[20], false],
    saturday: [false, timeItems()[36], true, timeItems()[20], false],
    sunday: [false, timeItems()[36], true, timeItems()[20], false]
});

function loadStoredValue() {
    // const weeklyAvailability = currentUserInLocalStorage.value.weeklyAvailability;
    // let isWeeklyAvailabilityEmpty = true;
    for (const [key, value] of Object.entries(days.value)) {
        if (Object.keys(weeklyAvailability.value).includes(key)) {
            value[0] = true;
            value[1] = generateApmWithTimeArr(weeklyAvailability.value[key][0])[0];
            value[2] = weeklyAvailability.value[key][0].slice(0, 2) < 12 ? true : false;
            value[3] = generateApmWithTimeArr(weeklyAvailability.value[key][1])[0];
            value[4] = weeklyAvailability.value[key][1].slice(0, 2) < 12 ? true : false;
            // isWeeklyAvailabilityEmpty = false;
        } else {
            value[0] = false;
        }
    }
    console.log("days in loadStoredValue(): ",  days.value);
}
loadStoredValue();



function weeklyDaysTimes() {
    const dayOfWeek = {};
    for (const [key, value] of Object.entries(days.value)) {
        if (value[0]) {
            let from = removeApmFromTimeArr([value[1], value[2]]); // e.g. [14, 30]
            from = `${from[0]}:${from[1]}`; // e.g. 14:30
            let until = removeApmFromTimeArr([value[3], value[4]]);
            until = `${until[0]}:${until[1]}`;
            const valArr = [from, until]; // e.g. ['14:30', '16:00']
            dayOfWeek[key] = valArr;
        }
    }
    return dayOfWeek;
}

function overrideDatesTimes() {
    const times = overrideTimes.value.map((timeArr) => {
        let from = removeApmFromTimeArr([timeArr[0], timeArr[2]]);
        let until = removeApmFromTimeArr([timeArr[1], timeArr[3]]);
        return from.concat(until);
    });
    // console.log("times: ", times);

    // picked date from Date picker
    const dates = overrideDates.value.map((date) => {
        console.log("date before getYear, getMonth, getDay: ", date);
        return [date.getFullYear(), date.getMonth(), date.getDate()];
    });
    // console.log("dates: ", dates);

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
    // console.log("date&time merging result: ", datesTimesMerged);
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
