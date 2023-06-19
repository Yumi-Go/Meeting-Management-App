<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';

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
        <v-row v-for="(dateObj, i) in formatDate(pickedStartEndDatesArray)">
            <div v-if="pickedStartEndDatesArray[1] === null">
                <v-col>
                    <v-row>
                        {{ dateObj }}
                    </v-row>
                </v-col>
            </div>
            <div v-else>
                <v-col>
                    <v-row v-if="i === 0">
                        From: {{ dateObj }}
                    </v-row>
                    <v-row v-else>
                        To: {{ dateObj }}
                    </v-row>
                </v-col>
            </div>
        </v-row>
        <v-row>
            <v-col>

                <!-- vanilla JavaScript input time is temporarily used here.
                It's because there is no Time Picker feature launched in Vuetify3 currently.
                When Vuetify3 launches Time Picker,
                this will be changed to Vuetify Time Picker component
                (only Vuetify2 has Time Picker yet) -->
                <div
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
                        >
                    </div>
                    <div class="">
                        <v-btn
                            variant="plain"
                            @click=""
                        >
                            Choose time
                        </v-btn>
                    </div>
                </div>


            </v-col>




        </v-row>
    </v-container>

</template>