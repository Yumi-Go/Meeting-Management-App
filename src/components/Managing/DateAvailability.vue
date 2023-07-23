<script setup>
import { ref, watch } from 'vue'
import { useFirestore } from '../../composables/useFirestore';
import { useDateTime } from '../../composables/useDateTime'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';
import { mdiCheckboxMarkedCirclePlusOutline, mdiCalendarBlank, mdiCalendarBlankOutline, mdiCalendarStart, mdiCalendarStartOutline, mdiCalendarEnd, mdiCalendarEndOutline, mdiDelete, mdiTrashCanOutline } from '@mdi/js';

const { updateWeeklyAvailability, addDateOverrides } = useFirestore();
const { timeItems, formatDate } = useDateTime();

const props = defineProps({
    overrideDates: Array,
    overrideTimes: Array,
});

const selectedDate = ref(new Date());

watch(selectedDate, (newDate) => {
    props.overrideDates.push(newDate);
    console.log("props.overrideDates: ", props.overrideDates);
    props.overrideTimes.push([timeItems()[36], timeItems()[20], true, true]);
    console.log("props.overrideTimes: ", props.overrideTimes);
});

// watch(props.overrideTimes, (newTime) => {
//     console.log("props.overrideTimes: ", newTime);
// });




</script>

<template>
    <v-container fluid class="ma-0 pa-0 tw-h-full">
        <VueDatePicker
            v-model="selectedDate"
            placeholder="Select Date"
            :enable-time-picker="false"
            calendar-cell-class-name="dp-custom-cell"
        >
            <template #calendar-header="{ index, day }">
                <div :class="index === 5 || index === 6 ? 'tw-text-red-800' : 'tw-text-blue-800'">
                    {{ day }}
                </div>
            </template>
        </VueDatePicker>
        <v-list
            v-if="overrideDates.length > 0"
            width="100%"
        >
            <v-list-item
                v-for="(date, i) in overrideDates"
                base-color=""
                class="mb-1"
                :acitve="true"
                :border="true"
            >
                <v-list-item-title>
                    <div class="d-flex flex-row align-center">
                        <div class="tw-text-red-900">
                            {{ formatDate(date) }}
                        </div>
                        <div class="d-flex flex-row ml-5">
                            <div class="d-flex align-center mr-0">
                                <v-combobox
                                    v-model="overrideTimes[i][0]"
                                    :items="timeItems()"
                                    label="From"
                                    variant="outlined"
                                    density="compact"
                                    hide-details="auto"
                                    class="mr-0 my-2"
                                    base-color="red"
                                    bg-color=""
                                    color="red-lighten-3"
                                />
                            </div>
                            <div class="d-flex align-center ml-0">
                                <v-chip
                                    class="ml-1 mr-5 px-1"
                                    :color="overrideTimes[i][2] ? 'pink' : 'purple'"
                                    @click="overrideTimes[i][2] = !(overrideTimes[i][2])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="overrideTimes[i][2]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                            <div class="d-flex align-center mr-0">
                                <v-combobox
                                    v-model="overrideTimes[i][1]"
                                    :items="timeItems()"
                                    label="Until"
                                    variant="outlined"
                                    density="compact"
                                    hide-details="auto"
                                    class="mr-0 my-2"
                                    base-color="red"
                                    bg-color=""
                                    color="red-lighten-3"
                                />
                            </div>
                            <div class="d-flex align-center ml-0">
                                <v-chip
                                    class="ml-1 mr-5 px-1"
                                    :color="overrideTimes[i][3] ? 'pink' : 'purple'"
                                    @click="overrideTimes[i][3] = !(overrideTimes[i][3])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="overrideTimes[i][3]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                        </div>
                    </div>
                </v-list-item-title>
                <template #append>
                    <v-icon :icon="mdiTrashCanOutline" class="ma-0"/>
                </template>
            </v-list-item>
        </v-list>
    </v-container>
</template>

<sytle lang="scss">
@import "./src/assets/scss/datePicker.scss";
</sytle>