<script setup>
import { ref, watch, watchEffect } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth';
import { useFirestore } from '../../composables/useFirestore';
import { useDateTime } from '../../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import WeeklyAvailability from './WeeklyAvailability.vue';
import DateAvailability from './DateAvailability.vue'
import { mdiCalendarClock, mdiCalendarEdit } from '@mdi/js';

const { currentUser, userStateObserver } = useAuth();
const { getUserInfoByUID, updateWeeklyAvailability, addDateOverrides, deleteDateOverrides } = useFirestore();
const { format2digits, timeItems, timeItemsIn24hrs, removeApmFromTimeArr, generateApmWithTimeArr, formatDateStr } = useDateTime();
const router = useRouter();
const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const weeklyAvailability = ref(currentUserInLocalStorage.value.weeklyAvailability);
const overrideDates = ref([]); // [[date, fromTime, untilTime], [date, fromTime, untilTime], ...]
const overrideTimes = ref([]); // [09:00am(initial value of From), 05:00pm(initial value of Until), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]
const renderChildComponent = ref(true);

const days = ref({
    monday: [true, timeItems()[36], true, timeItems()[20], false], // [checked true/false, from, am(true), until, pm(false)]
    tuesday: [true, timeItems()[36], true, timeItems()[20], false],
    wednesday: [true, timeItems()[36], true, timeItems()[20], false],
    thursday: [true, timeItems()[36], true, timeItems()[20], false],
    friday: [true, timeItems()[36], true, timeItems()[20], false],
    saturday: [false, timeItems()[36], true, timeItems()[20], false],
    sunday: [false, timeItems()[36], true, timeItems()[20], false]
});

watchEffect(() => {
    if (currentUserInLocalStorage.value) {
        renderChildComponent.value = true;
        loadStoredValue();
    } else {
        renderChildComponent.value = false;
    }
});

function loadStoredValue() {
    console.log("weeklyAvailability.value: ", weeklyAvailability.value);
    for (const [key, value] of Object.entries(days.value)) {
        if (Object.keys(weeklyAvailability.value).includes(key) && weeklyAvailability.value[key] != null) {
            console.log("key & value: ", key, "/", value);
            console.log("weeklyAvailability.value[key]: ", weeklyAvailability.value[key]);
            value[0] = true;
            value[1] = generateApmWithTimeArr(weeklyAvailability.value[key][0])[0];
            value[2] = weeklyAvailability.value[key][0].slice(0, 2) < 12 ? true : false;
            value[3] = generateApmWithTimeArr(weeklyAvailability.value[key][1])[0];
            value[4] = weeklyAvailability.value[key][1].slice(0, 2) < 12 ? true : false;
            // value[1] = 0;
            // value[2] = 0;
            // value[3] = 0;
            // value[4] = 0;

            // isWeeklyAvailabilityEmpty = false;
        } else {
            value[0] = false;
        }
    }
    // overrideDates e.g. [Sat Aug 05 2023 10:02:00 GMT+0100 (Irish Standard Time)]
    // overrideTimes e.g. [["02:45", "05:45", false, false]]
    const dateAvailability = currentUserInLocalStorage.value.dateOverrides;
    overrideDates.value = [];
    overrideTimes.value = [];
    if (dateAvailability.length > 0) {
        dateAvailability.forEach(overrideObj => {
            overrideDates.value.push(new Date(overrideObj.from));
            const times = [null, null, null, null];
            for (const [key, value] of Object.entries(overrideObj)) {
                const hourMinuteIndex = key === 'from' ? 0 : 1;
                const apmIndex = key === 'from' ? 2 : 3;
                const hourMinute = value.split("T")[1].slice(0, 5);
                const hour = value.split("T")[1].slice(0, 2);
                const minute = value.split("T")[1].slice(3, 5);
                times[apmIndex] = hour < 12 ? true : false;
                if (times[apmIndex]) {
                    times[hourMinuteIndex] = hourMinute;
                } else {
                    times[hourMinuteIndex] = `${format2digits(hour - 12)}:${minute}`
                }
            }
            overrideTimes.value.push(times);
        });
    }
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

    // picked date from Date picker
    const dates = overrideDates.value.map((date) => {
        return [date.getFullYear(), date.getMonth(), date.getDate()];
    });

    // merge date(from date picker) and time(from combobox)
    // here, convert time from Irish Standard Time to GMT (+1 hour) with getTimeezondOffset
    const datesTimesMerged = dates.map((date, i) => {
        const fromObj = () => {
            const dateObj = new Date(date[0], date[1], date[2], times[i][0], times[i][1]);
            return new Date(dateObj.getTime());
        }
        const untilObj = () => {
            const dateObj = new Date(date[0], date[1], date[2], times[i][2], times[i][3]);
            return new Date(dateObj.getTime());
        }
        return [fromObj(), untilObj()];
    });
    return datesTimesMerged;
}

function clickSaveBtn() {
    updateWeeklyAvailability(weeklyDaysTimes());
    addDateOverrides(overrideDatesTimes());
}

function deleteDateAvailability(fromUntilObjIndex) {
    console.log("fromUntilObjIndex: ", fromUntilObjIndex);
    console.log("overrideDatesTimes()[fromUntilObjIndex]: ", overrideDatesTimes()[fromUntilObjIndex]);
    deleteDateOverrides(overrideDatesTimes()[fromUntilObjIndex]);
    userStateObserver();
    loadStoredValue();
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
                />
            </v-col>
            <v-col
                cols="5"
                class="tw-border-l-2 tw-border-gray-100"
            >
            <div v-if="renderChildComponent">
                <DateAvailability
                    :overrideDates = "overrideDates"
                    :overrideTimes = "overrideTimes"
                    @deleteDateAvailability="deleteDateAvailability"
                />
            </div>
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
                    @click="clickSaveBtn()"
                    type="submit"
                >
                    Save
                </v-btn>
            </v-col>
        </v-row>
    </v-container>

</template>
