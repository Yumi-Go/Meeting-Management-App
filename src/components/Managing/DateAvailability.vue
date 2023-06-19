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
    <p v-for="(dateObj, i) in formatDate(pickedStartEndDatesArray)">
        <p v-if="i === 0">
            From: {{ dateObj }}
        </p>
        <p v-else>
            To: {{ dateObj }}
        </p>
    </p>
    <v-container fluid class="">
        <v-row>
            <v-list>
                <v-list-item>

                </v-list-item>
            </v-list>
        </v-row>
    </v-container>

    <v-date-picker/>
</template>