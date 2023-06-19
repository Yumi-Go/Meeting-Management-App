<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';
import { mdiDelete, mdiTrashCanOutline } from '@mdi/js';

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
    <v-list width="100%">
        <v-list-item
            v-if="pickedStartEndDatesArray[1] === null"
            base-color=""
            class=""
            acitve="true"
            :border="true"
        >
            <template #prepend>
                <span class="tw-font-semibold">{{ formatDate(pickedStartEndDatesArray)[0] }}</span>
            </template>
            <v-list-item-title>
                <div class="d-flex flex-row ml-5">
                    <div class="d-flex align-center mr-0">
                        <v-combobox
                            v-model="days['start'][0]"
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
                            class="ml-0 mr-5"
                            :color="days['start'][2] ? 'pink' : 'purple'"
                            @click="days['start'][2] = !(days['start'][2])"
                            variant="text"
                            label
                            :ripple="false"
                        >
                            <span v-if="days['start'][2]" class="">
                                am
                            </span>
                            <span v-else class="">
                                pm
                            </span>
                        </v-chip>
                    </div>
                    <div class="d-flex align-center mr-0">
                        <v-combobox
                            v-model="days['start'][1]"
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
                            class="ml-0 mr-5"
                            :color="days['start'][3] ? 'pink' : 'purple'"
                            @click="days['start'][3] = !(days['start'][3])"
                            variant="text"
                            label
                            :ripple="false"
                        >
                            <span v-if="days['start'][3]" class="">
                                am
                            </span>
                            <span v-else class="">
                                pm
                            </span>
                        </v-chip>
                    </div>
                </div>
            </v-list-item-title>
            <template #append>
                <v-icon :icon="mdiTrashCanOutline" class="ma-0"/>
            </template>

                            
        </v-list-item>
        <v-list-item v-else v-for="(dateObj, i) in formatDate(pickedStartEndDatesArray)">
            <v-col>
                <v-row v-if="i === 0">
                    From: {{ dateObj }}
                </v-row>
                <v-row v-else>
                    Until: {{ dateObj }}
                </v-row>
            </v-col>
        </v-list-item>

    </v-list>

</template>