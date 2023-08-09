<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { auth } from '../../firebaseConfig'
// import { useAuth } from '../../composables/useAuth'
import { useFirestore } from '../../composables/useFirestore';
import { useSearch } from '../../composables/useSearch';
import { useFormat } from '../../composables/useFormat'
import { useDateTime } from '../../composables/useDateTime'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { addDays } from 'date-fns';
import { mdiEmailArrowRight, mdiRepeat } from '@mdi/js';

const searchedUsers = useLocalStorage('searchedUsers', []);
const emit = defineEmits(['closeMeetingRequestPopup']);
const { allUsers, getUserInfoByUID, getAllUserInfo, getUserInfoByName, requestConnection, requestMeeting } = useFirestore();
const { getUserSearchResult } = useSearch();
const { capitalize } = useFormat();
const { timeItems, removeApmFromTimeArr, formatDateStrWithTimezone } = useDateTime();
const popupUser = useLocalStorage('popupUser', {});
const selectedParticipant = ref([]);
const selectedDate = ref(new Date());
const weeklyRecurring = ref(false);
const monthlyRecurring = ref(false);
const meetingRequested = ref({
    status: false, // Boolean, Default: false(Pending), Only Accepted meetings(=true) are displayed on the calendar
    title: '',
    link: '',
    location: '',
    type: true, // Boolean, Default: true(internal), internal(=true, via this app) / external(=false, from external platform such as Google Calendar or manually added meetings)
    category: '',
    organizer: [],
    participants: [],
    date: null,
    startTime: [timeItems()[0], true], // e.g. [03:30, true] => AM(true)/PM(false)
    endTime: [timeItems()[0], false], // e.g. [03:30, false]
    duration: 0,
    timezone: '',
    etc: [],
    isRead: false
});

watch(selectedParticipant, async(newSelected) => {
    console.log("selected: ", newSelected);
});

watch(selectedDate, (newDate) => {
    meetingRequested.value.date = formatDateStrWithTimezone(newDate);
    console.log("meetingRequested.value.date: ", meetingRequested.value.date);
});

function getParticipantUids() {
    return selectedParticipant.value.map(user => user.uid);
}

function sendMeetingRequest() {
    meetingRequested.value.participants = getParticipantUids();
    const startTimeArr = removeApmFromTimeArr(meetingRequested.value.startTime);
    meetingRequested.value.startTime = `${startTimeArr[0]}:${startTimeArr[1]}`;
    const endTimeArr = removeApmFromTimeArr(meetingRequested.value.endTime);
    meetingRequested.value.endTime = `${endTimeArr[0]}:${endTimeArr[1]}`;
    requestMeeting(auth.currentUser.uid, popupUser.value.uid, meetingRequested.value);
    closeBtnClick();
}

function closeBtnClick() {
    emit('closeMeetingRequestPopup');
    console.log("Meeting Request popup closed!");
}

</script>

<template>
    <v-card
        class="mx-auto pa-5"
        color="blue-grey-lighten-5"
    >
        <v-card-title class="">
            <v-icon start :icon="mdiEmailArrowRight" class="mr-2"/>
            Request a Meeting
        </v-card-title>
        <v-sheet
            width="800"
            class="mx-auto mt-5 pa-10"
        >
            <v-form ref="form" @submit.prevent>
                <v-container fluid class="ma-0 pa-0">
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.title"
                            label="Title"
                            required
                        />
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.link"
                            label="Link"
                        />
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.location"
                            label="Location"
                        />
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.category"
                            label="Category"
                        />
                    </v-row>
                    <v-row>
                        <v-autocomplete
                            v-model="selectedParticipant"
                            :items="allUsers"
                            chips
                            closable-chips
                            color="blue-grey-lighten-2"
                            label="Participants"
                            multiple
                        >
                            <template v-slot:chip="{ props, item }">
                                <v-chip
                                    v-bind="props"
                                    :text="item?.raw?.fName + ' ' + item?.raw?.lName"
                                />
                            </template>
                            <template v-slot:item="{ props, item }">
                                <v-list-item
                                    v-bind="props"
                                    :title="item?.raw?.fName + ' ' + item?.raw?.lName"
                                    :subtitle="item?.raw?.email"
                                />
                            </template>
                        </v-autocomplete>
                    </v-row>
                    <v-row class="mb-1">
                        <div>
                            <v-chip
                                class="mr-2 pa-2"
                                color="indigo"
                                :variant="weeklyRecurring ? 'elevated' : 'default'"
                                @click="weeklyRecurring = !weeklyRecurring"
                                :ripple="false"
                            >
                                <v-icon start :icon="mdiRepeat"/>
                                Weekly
                            </v-chip>
                        </div>
                        <div>
                            <v-chip
                                class="ma-0 pa-2"
                                color="indigo"
                                :variant="monthlyRecurring ? 'elevated' : 'default'"
                                @click="monthlyRecurring = !monthlyRecurring"
                                :ripple="false"
                            >
                                <v-icon start :icon="mdiRepeat"/>
                                Monthly
                            </v-chip>
                        </div>
                    </v-row>
                    <v-row class="mb-5 mt-0">
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
                    </v-row>
                    <v-row align-content="center" class="mb-5">
                        <div class="d-flex flex-row justify-space-between w-100">
                            <div class="d-flex flex-row tw-w-[50%] pr-2">
                                <v-combobox
                                    v-model="meetingRequested.startTime[0]"
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
                                    class="ml-1 px-1"
                                    :color="meetingRequested.startTime[1] ? 'pink' : 'purple'"
                                    @click="meetingRequested.startTime[1] = !(meetingRequested.startTime[1])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="meetingRequested.startTime[1]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                            <div class="d-flex flex-row tw-w-[50%] pl-2">
                                <v-combobox
                                    v-model="meetingRequested.endTime[0]"
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
                                    class="ml-1 px-1"
                                    :color="meetingRequested.endTime[1] ? 'pink' : 'purple'"
                                    @click="meetingRequested.endTime[1] = !(meetingRequested.endTime[1])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="meetingRequested.endTime[1]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                        </div>
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.etc"
                            label="Other References / Links"
                        />
                    </v-row>
                    <!-- <v-row>
                        <v-col class="mr-1 pa-0">
                            <v-btn
                                width="100%"
                                height="40"
                                color="indigo-darken-3"
                                variant="outlined"
                                class=""
                                @click="closeBtnClick"
                            >
                                Cancel
                            </v-btn>
                        </v-col>
                        <v-col class="ml-1 pa-0">
                            <v-btn
                                width="100%"
                                height="40"
                                color="indigo-darken-3"
                                variant="flat"
                                class=""
                                @click="sendMeetingRequest"
                                type="submit"
                            >
                                Save
                            </v-btn>
                        </v-col>
                    </v-row> -->
                </v-container>
            </v-form>
        </v-sheet>
        <v-card-actions>
            <v-spacer/>
            <v-container fluid class="ma-3">
                <v-row>
                    <v-col class="mr-1 pa-0">
                        <v-btn
                            width="100%"
                            color="indigo-darken-3"
                            variant="outlined"
                            class=""
                            @click="closeBtnClick"
                        >
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col class="ml-1 pa-0">
                        <v-btn
                            width="100%"
                            color="indigo-darken-3"
                            variant="flat"
                            class=""
                            @click="sendMeetingRequest"
                        >
                            Save
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<sytle lang="scss">
    @import "./src/assets/scss/datePicker.scss";
</sytle>