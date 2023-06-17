<script setup>
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref();
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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

</script>

<template>

    <VueDatePicker v-model="date"></VueDatePicker>

    <v-container class="bg-white">
        <v-row
            v-for="(day, i) in days"
        >
            <v-col cols="3" align-self="center">
                <span class="">
                    {{ day }}
                </span>
            </v-col>
            <v-col cols="9" class="d-flex flex-row">
            <v-select
                v-model="timeItems()[36]"
                :items="timeItems()"
                label="From"
                density="compact"
                hide-details="auto"
                class="mr-2"
                base-color=""
                bg-color=""
                color=""
            />
            <v-select
                v-model="timeItems()[36]"
                :items="timeItems()"
                label="To"
                density="compact"
                hide-details="auto"
            />
        </v-col>

        </v-row>


    </v-container>

    <!-- <v-list class="" bg-color="">
        <v-list-item
            v-for="(day, i) in days"
            :key="i"
            :value="day"
            class=""
            active="false"
            base-color=""
            color=""
        >
        <template #prepend>
            <span class="">
                {{ day }}
            </span>
        </template>
        <template #append>
            <v-select
                v-model="timeItems()[36]"
                :items="timeItems()"
                label="From"
                density="compact"
                hide-details="auto"
                class="mr-5"
                base-color=""
                bg-color=""
                color=""
            />        
            <v-select
                v-model="timeItems()[36]"
                :items="timeItems()"
                label="To"
                density="compact"
                hide-details="auto"
            />
        </template>
        </v-list-item>
    </v-list> -->


</template>





