<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useFirestore } from '../../composables/useFirestore';
import { useFormat } from '../../composables/useFormat';
import DateAvailability from './DateAvailability.vue'
import { mdiCalendarClock, mdiCalendarEdit } from '@mdi/js';

const router = useRouter();
const { updateWeeklyAvailability, addDateOverrides } = useFirestore();
const { capitalize } = useFormat();

const date = ref();
const days = ref({
    monday: [true, timeItems()[36], timeItems()[20], true, true],
    tuesday: [true, timeItems()[36], timeItems()[20], true, true],
    wednesday: [true, timeItems()[36], timeItems()[20], true, true],
    thursday: [true, timeItems()[36], timeItems()[20], true, true],
    friday: [true, timeItems()[36], timeItems()[20], true, true],
    saturday: [false, timeItems()[36], timeItems()[20], true, true],
    sunday: [false, timeItems()[36], timeItems()[20], true, true]
}); // [unavailable true/false, 09:00am(initial value of From), 05:00pm(initial value of Until), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

watch(days.value, () => {
    console.log("days: ", days.value);
});

function timeItems() {
    var interval = 15;
    var times = [];
    var minuteSum = 0;
    // var aPm = ['am', 'pm'];

    for (var i = 0; minuteSum < 60*12; i++) {
        var hour = Math.floor(minuteSum / 60);
        var minute = (minuteSum % 60);
        times[i] = ("0" + (hour % 12)).slice(-2) + ':' + ("0" + minute).slice(-2);
        minuteSum = minuteSum + interval;
    }
    // console.log(times);
    return times;
}

function saveAvailability() {
    updateWeeklyAvailability(days.value);
}


</script>

<template>

    <VueDatePicker v-model="date" placeholder="Select Date"/>

    <v-container class="w-100 bg-white">
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
                <v-row
                    v-for="(day, i) in Object.keys(days)"
                    no-gutters
                >
                    <v-col cols="3" class="d-flex align-center" align-self="center">
                        <v-checkbox
                            v-model="days[day][0]"
                            :label="capitalize(day)"
                            hide-details="auto"
                        />
                        <!-- {{ days[day] }} -->
                    </v-col>
                    <v-col v-if="days[day][0]" cols="9" class="d-flex align-center flex-row">
                        <v-combobox
                            v-model="days[day][1]"
                            :items="timeItems()"
                            label="From"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            class="mr-1"
                            base-color=""
                            bg-color=""
                            color=""
                        />
                        <v-chip
                            class="mr-5"
                            :color="days[day][3] ? 'pink' : 'purple'"
                            @click="days[day][3] = !(days[day][3])"
                            variant="text"
                            label
                            :ripple="false"
                        >
                            <span v-if="days[day][3]" class="tw-font-semibold">
                                AM
                            </span>
                            <span v-else class="tw-font-semibold">
                                PM
                            </span>
                        </v-chip>
                        <v-combobox
                            v-model="days[day][2]"
                            :items="timeItems()"
                            label="Until"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            class="mr-1"
                        />
                        <v-chip
                            class="mr-5"
                            :color="days[day][4] ? 'pink' : 'purple'"
                            @click="days[day][4] = !(days[day][4])"
                            variant="text"
                            label
                            :ripple="false"
                        >
                            <span v-if="days[day][4]" class="tw-font-semibold">
                                AM
                            </span>
                            <span v-else class="tw-font-semibold">
                                PM
                            </span>
                        </v-chip>
                    </v-col>
                    <v-col v-else cols="9" class="d-flex align-center tw-text-gray-400 tw-font-semibold">
                        Unavailable
                    </v-col>
                </v-row>
            </v-col>
            <v-col
                cols="5"
                class="tw-border-l-2 tw-border-gray-100"
            >
                <DateAvailability :timeItems="timeItems"/>
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
                    @click="saveAvailability"
                    type="submit"
                >
                    Save
                </v-btn>
            </v-col>
        </v-row>
    </v-container>

</template>

<style>
</style>
