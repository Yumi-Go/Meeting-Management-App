<script setup>
import { ref, watch } from 'vue'
import { useFirestore } from '../../composables/useFirestore';
import { useDateTime } from '../../composables/useDateTime'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';
import { mdiCheckboxMarkedCirclePlusOutline, mdiCalendarBlank, mdiCalendarBlankOutline, mdiCalendarStart, mdiCalendarStartOutline, mdiCalendarEnd, mdiCalendarEndOutline, mdiDelete, mdiTrashCanOutline } from '@mdi/js';

const { updateWeeklyAvailability, addDateOverrides } = useFirestore();
const { formatDate } = useDateTime();

const props = defineProps({
    overriddenDates: Array,
    fromUntilTime: Array,
    timeItems: Function
});


const pickedDate = ref(new Date());

watch(pickedDate, (newDate) => {
    props.overriddenDates.push(newDate);
    console.log("props.overriddenDates: ", props.overriddenDates);
    props.fromUntilTime.push([props.timeItems()[36], props.timeItems()[20], true, true]);
    console.log("props.fromUntilTime: ", props.fromUntilTime);
});

watch(props.fromUntilTime, (newTime) => {
    console.log("props.fromUntilTime: ", newTime);
});




</script>

<template>
    <v-container fluid class="ma-0 pa-0 tw-h-full">
        <VueDatePicker
            v-model="pickedDate"
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
            v-if="overriddenDates.length > 0"
            width="100%"
        >
            <v-list-item
                v-for="(date, i) in overriddenDates"
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
                                    v-model="fromUntilTime[i][0]"
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
                                    :color="fromUntilTime[i][2] ? 'pink' : 'purple'"
                                    @click="fromUntilTime[i][2] = !(fromUntilTime[i][2])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="fromUntilTime[i][2]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                            <div class="d-flex align-center mr-0">
                                <v-combobox
                                    v-model="fromUntilTime[i][1]"
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
                                    :color="fromUntilTime[i][3] ? 'pink' : 'purple'"
                                    @click="fromUntilTime[i][3] = !(fromUntilTime[i][3])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="fromUntilTime[i][3]" class="">
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
.dp-custom-cell {
    border-radius: 100%;
}
.dp__theme_light {
   --dp-background-color: #ffffff;
   --dp-text-color: #212121;
   --dp-hover-color: #f3f3f3;
   --dp-hover-text-color: #212121;
   --dp-hover-icon-color: #959595;
   --dp-primary-color: lightgray;
   --dp-primary-text-color: red;
   --dp-secondary-color: #c0c4cc;
   --dp-border-color: #ddd;
   --dp-menu-border-color: #ddd;
   --dp-border-color-hover: #aaaeb7;
   --dp-disabled-color: #f6f6f6;
   --dp-scroll-bar-background: #f3f3f3;
   --dp-scroll-bar-color: #959595;
   --dp-success-color: #76d275;
   --dp-success-color-disabled: #a3d9b1;
   --dp-icon-color: #959595;
   --dp-danger-color: #ff6f60;
   --dp-highlight-color: rgba(25, 118, 210, 0.1);
}


</sytle>