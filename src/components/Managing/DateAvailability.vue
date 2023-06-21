<script setup>
import { ref, watch } from 'vue'
import { useFirestore } from '../../composables/useFirestore';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';
import { mdiCheckboxMarkedCirclePlusOutline, mdiCalendarBlank, mdiCalendarBlankOutline, mdiCalendarStart, mdiCalendarStartOutline, mdiCalendarEnd, mdiCalendarEndOutline, mdiDelete, mdiTrashCanOutline } from '@mdi/js';

const { updateWeeklyAvailability, addDateOverrides } = useFirestore();

const props = defineProps({
    timeItems: Array,
});

const defaultStartEndTime = ref({
    start: [props.timeItems()[36], props.timeItems()[20], true, true],
    end: [props.timeItems()[36], props.timeItems()[20], true, true],
}); // [09:00am(initial value of From), 05:00pm(initial value of Until), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

const pickedStartEndDatesArray = ref([new Date(), addDays(new Date(), 0)]);
const pickedDatesList = ref([]);

watch(pickedStartEndDatesArray, (newArray) => {
    if (newArray[1] === null) {
        newArray.pop();
    }
    console.log("newArray: ", newArray);
    pickedDatesList.value.push(newArray);
    console.log("pickedDatesList: ", pickedDatesList.value);
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
    <v-container fluid class="ma-0 pa-0 tw-h-full">
        <VueDatePicker
            v-model="pickedStartEndDatesArray"
            placeholder="Select Date"
            :enable-time-picker="false"
            range
        />
        <v-list
            v-if="pickedDatesList.length > 0"
            width="100%"
        >
            <v-list-item
                v-for="startEndDates in pickedDatesList"
                base-color=""
                class="mb-1"
                :acitve="true"
                :border="true"
            >
                <v-list-item-title v-if="startEndDates.length === 1">
                    <div class="d-flex flex-row align-center">
                        <div class="tw-text-red-900">
                            {{ formatDate(startEndDates)[0] }}
                        </div>
                        <div class="d-flex flex-row ml-5">
                            <div class="d-flex align-center mr-0">
                                <v-combobox
                                    v-model="defaultStartEndTime['start'][0]"
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
                                    :color="defaultStartEndTime['start'][2] ? 'pink' : 'purple'"
                                    @click="defaultStartEndTime['start'][2] = !(defaultStartEndTime['start'][2])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="defaultStartEndTime['start'][2]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                            <div class="d-flex align-center mr-0">
                                <v-combobox
                                    v-model="defaultStartEndTime['start'][1]"
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
                                    :color="defaultStartEndTime['start'][3] ? 'pink' : 'purple'"
                                    @click="defaultStartEndTime['start'][3] = !(defaultStartEndTime['start'][3])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="defaultStartEndTime['start'][3]" class="">
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
                <v-list-item-title v-else>
                    <div v-for="(date, i) in formatDate(startEndDates)" class="d-flex flex-row align-center">
                        <div v-if="i === 0" class="tw-text-red-900">
                            {{ date }}
                        </div>
                        <div v-else class="tw-text-red-900">
                            {{ date }}
                        </div>
                        <div class="d-flex flex-row ml-5">
                            <div class="d-flex align-center mr-0">
                                <v-combobox
                                    v-model="defaultStartEndTime['start'][0]"
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
                                    :color="defaultStartEndTime['start'][2] ? 'pink' : 'purple'"
                                    @click="defaultStartEndTime['start'][2] = !(defaultStartEndTime['start'][2])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="defaultStartEndTime['start'][2]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                            <div class="d-flex align-center mr-0">
                                <v-combobox
                                    v-model="defaultStartEndTime['start'][1]"
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
                                    :color="defaultStartEndTime['start'][3] ? 'pink' : 'purple'"
                                    @click="defaultStartEndTime['start'][3] = !(defaultStartEndTime['start'][3])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="defaultStartEndTime['start'][3]" class="">
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