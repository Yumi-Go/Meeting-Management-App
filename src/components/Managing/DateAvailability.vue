<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';

const props = defineProps({
    timeItems: Array,
});

// console.log("props.timeItems: ", props.timeItems());

const days = ref({
    start: [props.timeItems()[36], props.timeItems()[20], true, true],
    end: [props.timeItems()[36], props.timeItems()[20], true, true],
}); // [09:00am(initial value of From), 05:00pm(initial value of To), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

const pickedStartEndDatesArray = ref([new Date(), addDays(new Date(), 0)]);

watch(pickedStartEndDatesArray, () => {
    console.log("pickedStartEndDatesArray: ", pickedStartEndDatesArray.value);
});

function formatDate(startEndDateArray) {
    const result = [];
    startEndDateArray.forEach(date => {
        if (date !== null) {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const tzOffset = date.getTimezoneOffset() * 60 * 1000;
            result.push(new Date(date - tzOffset).toISOString().split('T')[0]);
        } else {
            result.push(date);
        }
    });
    return result;
}

</script>

<template>
    <VueDatePicker
        v-model="pickedStartEndDatesArray"
        placeholder="Select Date"
        :enable-time-picker="false"
        range
    />
    <v-container fluid class="">
        <v-row v-if="pickedStartEndDatesArray[1] === null">
            <v-col>
                <v-row class="mt-10 mb-5 tw-font-semibold">
                    {{ formatDate(pickedStartEndDatesArray)[0] }}
                </v-row>
                <v-row class="">
                    <v-col class="d-flex flex-row">
                        <v-row class="">
                            <v-col cols="4">
                                <v-combobox
                                    v-model="days['start'][0]"
                                    :items="timeItems()"
                                    label="From"
                                    variant="underlined"
                                    density="compact"
                                    hide-details="auto"
                                    class=""
                                    base-color=""
                                    bg-color=""
                                    color=""
                                />
                            </v-col>
                            <v-col cols="2">
                                <v-chip
                                    class=""
                                    :color="days['start'][2] ? 'pink' : 'purple'"
                                    @click="days['start'][2] = !(days['start'][2])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="days['start'][2]" class="tw-font-semibold">
                                        AM
                                    </span>
                                    <span v-else class="tw-font-semibold">
                                        PM
                                    </span>
                                </v-chip>
                            </v-col>
                            <v-col cols="4">
                                <v-combobox
                                    v-model="days['start'][1]"
                                    :items="timeItems()"
                                    label="Until"
                                    variant="underlined"
                                    density="compact"
                                    hide-details="auto"
                                    class=""
                                />
                            </v-col>
                            <v-col cols="2">
                                <v-chip
                                    class=""
                                    :color="days['start'][3] ? 'pink' : 'purple'"
                                    @click="days['start'][3] = !(days['start'][3])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="days['start'][3]" class="tw-font-semibold">
                                        AM
                                    </span>
                                    <span v-else class="tw-font-semibold">
                                        PM
                                    </span>
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row v-else v-for="(dateObj, i) in formatDate(pickedStartEndDatesArray)">
            <v-col>
                <v-row v-if="i === 0">
                    From: {{ dateObj }}
                </v-row>
                <v-row v-else>
                    Until: {{ dateObj }}
                </v-row>
            </v-col>
        </v-row>

        <!-- <v-row
            v-for="(day) in Object.keys(days)"
            no-gutters
        >
            <v-col class="">
                <v-combobox
                    v-model="days[day][0]"
                    :items="timeItems()"
                    label="From"
                    density="compact"
                    hide-details="auto"
                    class="mr-1"
                    base-color=""
                    bg-color=""
                    color=""
                />
                <v-chip
                    class="mr-5"
                    :color="days[day][2] ? 'pink' : 'purple'"
                    @click="days[day][2] = !(days[day][2])"
                    variant="text"
                    label
                    :ripple="false"
                >
                    <span v-if="days[day][2]" class="tw-font-semibold">
                        AM
                    </span>
                    <span v-else class="tw-font-semibold">
                        PM
                    </span>
                </v-chip>
                <v-combobox
                    v-model="days[day][1]"
                    :items="timeItems()"
                    label="To"
                    density="compact"
                    hide-details="auto"
                    class="mr-1"
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
            </v-col>
        </v-row> -->






    </v-container>

</template>