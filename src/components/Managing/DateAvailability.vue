<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';
import { mdiDelete, mdiTrashCanOutline } from '@mdi/js';

const props = defineProps({
    timeItems: Array,
});

const defaultStartEndTime = ref({
    start: [props.timeItems()[36], props.timeItems()[20], true, true],
    end: [props.timeItems()[36], props.timeItems()[20], true, true],
}); // [09:00am(initial value of From), 05:00pm(initial value of To), AM(true)/PM(false) in From time, AM(true)/PM(false) in Until time]

const pickedStartEndDatesArray = ref([new Date(), addDays(new Date(), 0)]);
const pickedDatesList = ref([]);

watch(pickedStartEndDatesArray, (newArray) => {
    console.log("newArray[0]: ", typeof newArray[0]);
    console.log("newArray[1]: ", typeof newArray[1]);
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
            console.log("typeof date: ", typeof date);
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
    <v-list
        v-if="pickedDatesList.length > 0"
        width="100%"
    >
            <v-list-item
                v-for="startEndDates in pickedDatesList"
                base-color=""
                class=""
                :acitve="true"
                :border="true"
            >
                <template v-if="startEndDates.length === 1">
                    <template #prepend>
                        <span class="tw-font-semibold">{{ formatDate(startEndDates)[0] }}</span>
                    </template>
                    <v-list-item-title>
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
                    </v-list-item-title>
                    <template #append>
                        <v-icon :icon="mdiTrashCanOutline" class="ma-0"/>
                    </template>
                </template>

                <template v-else>
                    <template #prepend>
                        <span v-for="(date, i) in startEndDates" v-if="i === 0" class="tw-font-semibold">
                            Start: {{ date }}
                        </span>
                        <span v-else class="tw-font-semibold">
                            End: {{ date }}
                        </span>
                    </template>
                    <v-list-item-title>
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
                    </v-list-item-title>
                    <template #append>
                        <v-icon :icon="mdiTrashCanOutline" class="ma-0"/>
                    </template>                    

                </template>
            </v-list-item>
    </v-list>

</template>