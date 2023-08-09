<script setup>
import { ref, watch, computed, onBeforeMount } from "vue"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useAuth } from '../../composables/useAuth'
import { useCalendar } from '../../composables/useCalendar'
import { useDateTime } from '../../composables/useDateTime'
import { useFirestore } from '../../composables/useFirestore'
import { useLocalStorage } from '@vueuse/core';

const currentUser = useLocalStorage('currentUser', {});
const { getMeetingByDocID } = useFirestore();
const {
    weekdayNames,
    getYearMonthDayStr,
    getToday,
    getDayNameOfDateObj,
    getDurationMinutesFromISOstrings,
    getWeeklyAvailabilityForCalendar,
    deleteWeeklyAvailability,
    updateWeeklyAvailability,
    getDateOverridesForCalendar,
} = useCalendar();
const { format2digits } = useDateTime();
const { userStateObserver } = useAuth();
const meetings = ref([]);

userStateObserver();

watch(currentUser, (updatedCurrentUser) => {
    addEventsToCalendar();
});

const calendarOptions = ref({
    plugins: [ dayGridPlugin, interactionPlugin, rrulePlugin, timeGridPlugin ],
    initialView: 'timeGridWeek',
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: handleDateClick,
    businessHours: [],
    events: []
})

function getTimeFromIsoString(isoString) {
    let result = isoString.match(/\d\d:\d\d/);
    return result[0];
}

function addAvailabilityToCalendar() {
    for (const [key, value] of Object.entries(getWeeklyAvailabilityForCalendar())) {
        const weeklyStartStr = `${getToday()}T${value[0]}:00`;
        const weeklyEndStr = `${getToday()}T${value[1]}:00`;
        const durationHrsMins = () => {
            let durationInMins = getDurationMinutesFromISOstrings(weeklyStartStr, weeklyEndStr);
            let hours = Math.floor(durationInMins / 60);
            if (hours < 0) {
                hours = 24 + hours;
            }
            let minutes = Math.floor(durationInMins % 60);
            if (minutes < 0) {
                minutes = 60 + minutes;
            }
            return `${format2digits(hours)}:${format2digits(minutes)}`;
        }
        const weekly = {
            title: 'Weekly Availability',
            color: 'yellow',
            display: 'background',
            rrule: {
                freq: 'weekly',
                byweekday: [key],
                dtstart: weeklyStartStr,
                until: '2023-10-25'
            },
            // exdate: ['2023-08-08T14:00:00', '2023-08-15T14:00', '2023-08-15T14:00'],
            exdate: [],
            duration: durationHrsMins()
        }

        //// date overrides: corresponding to 'exdate' in above weekly obj
        const dateOverrides = currentUser.value.dateOverrides;
        dateOverrides.forEach((fromUntilPairObj, index) => {
            const dateStr = getDateOverridesForCalendar()[index];
            const fromTimeStr = `${format2digits(new Date(fromUntilPairObj.from).getHours())}:${format2digits(new Date(fromUntilPairObj.from).getMinutes())}:00`;
            const untilTimeStr = `${format2digits(new Date(fromUntilPairObj.until).getHours())}:${format2digits(new Date(fromUntilPairObj.until).getMinutes())}:00`;
            const overwrittenAvailability = {
                title: 'Overwritten Availability',
                start: `${dateStr}T${fromTimeStr}`,
                end: `${dateStr}T${untilTimeStr}`,
                display: 'background',
                color: 'yellow'
            }
            const availableDayFullNames = Object.keys(currentUser.value.weeklyAvailability);
            const dayFullName = getDayNameOfDateObj(new Date(fromUntilPairObj.from));
            if (availableDayFullNames.includes(dayFullName)) {
                const exdateTime = currentUser.value.weeklyAvailability[dayFullName][0];
                weekly.exdate.push(`${dateStr}T${exdateTime}:00`);
                calendarOptions.value.events.push(overwrittenAvailability);
            }
        });
        calendarOptions.value.events.push(weekly);
    }
}

function addMeetingsToCalendar() {
    currentUser.value.meetings.forEach(meetingID => {
        getMeetingByDocID(meetingID)
        .then(meeting => {
            meetings.value.push(meeting);
        });
    });
    meetings.value.forEach(meetingObj => {
        const meeting = {
            title: meetingObj.title,
            start: `${meetingObj.date}T${meetingObj.startTime}:00`,
            end: `${meetingObj.date}T${meetingObj.endTime}:00`,
            color: 'blue'
        }
        calendarOptions.value.events.push(meeting);
    });
}

function addEventsToCalendar() {
    calendarOptions.value.events = [];
    addAvailabilityToCalendar();
    addMeetingsToCalendar()
}

addEventsToCalendar();

function handleDateClick(arg) {
    alert('date click! ' + arg.dateStr);
}

</script>

<template>
    <div class="tw-bg-white">
        <FullCalendar :options="calendarOptions"/>
    </div>
</template>
