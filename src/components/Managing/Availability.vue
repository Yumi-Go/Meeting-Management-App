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
    monday: [true, timeItems()[36], timeItems()[68], false, '', ''],
    tuesday: [true, timeItems()[36], timeItems()[68], false, '', ''],
    wednesday: [true, timeItems()[36], timeItems()[68], false, '', ''],
    thursday: [true, timeItems()[36], timeItems()[68], false, '', ''],
    friday: [true, timeItems()[36], timeItems()[68], false, '', ''],
    saturday: [false, timeItems()[36], timeItems()[68], false, '', ''],
    sunday: [false, timeItems()[36], timeItems()[68], false, '', '']
}); // [unavailable true/false, 09:00am(initial value of From), 05:00pm(initial value of To), input directly true/false, fromTime in direct input, toTime in direct input]

watch(days.value, () => {
    console.log("days: ", days.value);
});

function timeItems() {
    var interval = 15;
    var times = [];
    var minuteSum = 0;
    var aPm = ['am', 'pm'];

    for (var i = 0; minuteSum < 60*24; i++) {
        var hour = Math.floor(minuteSum / 60);
        var minute = (minuteSum % 60);
        times[i] = ("0" + (hour % 12)).slice(-2) + ':' + ("0" + minute).slice(-2) + aPm[Math.floor(hour/12)];
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
            <v-col cols="9">
                <v-icon
                    :icon="mdiCalendarClock"
                    color="grey"
                    start
                />
                <span class="tw-align-middle">
                    Weekly Schedule
                </span>
            </v-col>
            <v-col cols="3">
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
            <v-col cols="9" class="">
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
                        <v-autocomplete
                            v-if="!days[day][3]"
                            v-model="days[day][1]"
                            :items="timeItems()"
                            label="From"
                            density="compact"
                            hide-details="auto"
                            class="mr-2"
                            base-color=""
                            bg-color=""
                            color=""
                        ></v-autocomplete>
                        <v-autocomplete
                            v-if="!days[day][3]"
                            v-model="days[day][2]"
                            :items="timeItems()"
                            label="To"
                            density="compact"
                            hide-details="auto"
                        ></v-autocomplete>

                        <v-btn
                            v-if="!days[day][3]"
                            variant="plain"
                            @click="days[day][3] = true"
                        >
                            Input directly
                        </v-btn>
                        <!-- vanilla JavaScript input time is temporarily used here.
                        It's because there is no Time Picker feature launched in Vuetify3 currently.
                        When Vuetify3 launches Time Picker,
                        this will be changed to Vuetify Time Picker component
                        (only Vuetify2 has Time Picker yet) -->
                        <div
                            v-if="days[day][3]"
                            class="tw-flex tw-flex-row tw-w-full tw-justify-between tw-items-center">
                            <div class="tw-mr-10">
                                <label
                                    for="from"
                                    class="tw-text-blue-500 tw-mr-5"
                                >
                                    From
                                </label>
                                <input
                                    type="time"
                                    :id="`fromTime${i}`"
                                    v-model="days[day][4]"
                                >
                            </div>
                            <div>
                                <label
                                    for="to"
                                    class="tw-text-blue-500 tw-mr-5"
                                >
                                    To
                                </label>
                                <input
                                    type="time"
                                    :id="`toTime${i}`"
                                    v-model="days[day][5]"
                                >
                            </div>
                            <div class="">
                                <v-btn
                                    variant="plain"
                                    @click="days[day][3] = false"
                                >
                                    Choose time
                                </v-btn>
                            </div>
                        </div>
                    </v-col>
                    <v-col v-else cols="9" class="d-flex align-center tw-text-gray-400 tw-font-semibold">
                        Unavailable
                    </v-col>
                </v-row>
            </v-col>
            <v-col
                cols="3"
                class="tw-border-l-2 tw-border-gray-100"
            >
                <DateAvailability/>
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
