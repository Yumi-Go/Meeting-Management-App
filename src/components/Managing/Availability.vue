<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useFirestore } from '../../composables/useFirestore';

const router = useRouter();
const { updateWeeklyAvailability } = useFirestore();

const date = ref();
const days = ref({
    Monday: [true, timeItems()[36], timeItems()[68], false],
    Tuesday: [true, timeItems()[36], timeItems()[68], false],
    Wednesday: [true, timeItems()[36], timeItems()[68], false],
    Thursday: [true, timeItems()[36], timeItems()[68], false],
    Friday: [true, timeItems()[36], timeItems()[68], false],
    Saturday: [true, timeItems()[36], timeItems()[68], false],
    Sunday: [true, timeItems()[36], timeItems()[68], false]
});

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

    <VueDatePicker v-model="date"></VueDatePicker>

    <v-container class="bg-white">
        <v-row
            v-for="(day, i) in Object.keys(days)"
            no-gutters
        >
            <v-col cols="3" class="d-flex align-center" align-self="center">
                <v-checkbox
                    v-model="days[day][0]"
                    :label="day"
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
                            id="from"
                            name="from"
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
                            id="to"
                            name="to"
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
            <v-col v-else cols="9" class="d-flex align-center">
                Unavailable
            </v-col>
        </v-row>
        <v-row>
            <v-col class="mr-1 pa-0">
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
            <v-col class="ml-1 pa-0">
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

        <!-- <v-list color="" class="">
            <v-list-item
                v-for="(day, i) in Object.keys(days)"
                :key="i"
                :value="day"
                class=""
                active="false"
                base-color=""
                bg-color=""
                color=""
            >
                <template #prepend>
                    <v-list-item-action start>
                        <v-checkbox-btn
                            v-model="days[day]"
                            :label="day"
                            :value="day"
                        />
                    </v-list-item-action>
                </template>
                <template #append>
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
                </template>

            </v-list-item>
        </v-list> -->

    </v-container>

</template>

<style>
</style>
