<script setup>
import { ref, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useRouter } from 'vue-router'
import { useFirestore } from '../../composables/useFirestore';
import { useFormat } from '../../composables/useFormat';
import { useDateTime } from '../../composables/useDateTime'
import DateAvailability from './DateAvailability.vue'
import { mdiCalendarClock, mdiCalendarEdit } from '@mdi/js';

const router = useRouter();
const { updateWeeklyAvailability, addDateOverrides } = useFirestore();
const { timeItems } = useDateTime();
const { capitalize } = useFormat();

const props = defineProps({
    days: Object
});

</script>

<template>
    <v-container fluid class="bg-white ma-0 pa-0 tw-h-full">
        <v-row
            v-for="(day, i) in Object.keys(days)"
            no-gutters
        >
            <v-col cols="3"
                class="d-flex align-center"
                align-self="center"
            >
                <v-checkbox
                    v-model="days[day][0]"
                    :label="capitalize(day)"
                    hide-details="auto"
                />
            </v-col>
            <v-col
                v-if="days[day][0]"
                cols="9"
                class="d-flex align-center flex-row"
            >
                <v-combobox
                    v-model="days[day][1]"
                    :items="timeItems()"
                    label="From"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    class="mr-0"
                    base-color=""
                    bg-color=""
                    color=""
                />
                <v-chip
                    class="ml-1 mr-5 px-1"
                    :color="days[day][3] ? 'pink' : 'purple'"
                    @click="days[day][3] = !(days[day][3])"
                    variant="text"
                    label
                    :ripple="false"
                >
                    <span v-if="days[day][3]" class="">
                        am
                    </span>
                    <span v-else class="">
                        pm
                    </span>
                </v-chip>
                <v-combobox
                    v-model="days[day][2]"
                    :items="timeItems()"
                    label="Until"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    class="mr-0"
                />
                <v-chip
                    class="ml-1 mr-5 px-1"
                    :color="days[day][4] ? 'pink' : 'purple'"
                    @click="days[day][4] = !(days[day][4])"
                    variant="text"
                    label
                    :ripple="false"
                >
                    <span v-if="days[day][4]" class="">
                        am
                    </span>
                    <span v-else class="">
                        pm
                    </span>
                </v-chip>
            </v-col>
            <v-col
                v-else
                cols="9"
                class="d-flex align-center tw-text-gray-400 tw-font-semibold"
            >
                Unavailable
            </v-col>
        </v-row>

    </v-container>

</template>

<style>
</style>
