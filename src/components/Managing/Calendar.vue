<script setup>
import { ref, watch, computed, onBeforeMount } from "vue"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import { useAuth } from '../../composables/useAuth'
import { useCalendar } from '../../composables/useCalendar'
import { useDateTime } from '../../composables/useDateTime'
import { useFirestore } from '../../composables/useFirestore'
import { useLocalStorage } from '@vueuse/core';

const currentUser = useLocalStorage('currentUser', {});
const { getWeeklyEventForCalendar, deleteWeeklyEvent, editWeeklyEvent } = useCalendar();
const { format2digits } = useDateTime();
const { userStateObserver } = useAuth();

userStateObserver();

watch(currentUser, (updatedCurrentUser) => {
    console.log("updatedCurrentUser: ", updatedCurrentUser);
    addEventToCalendar();
});

const testExDate = new Date('August 11, 2023 08:30:00');

const calendarOptions = ref({
    plugins: [ dayGridPlugin, interactionPlugin, rrulePlugin ],
    initialView: 'dayGridMonth',
    dateClick: handleDateClick,
    events: [
        {
            groupId: 'blueEvents',
            title: 'My Event',
            daysOfWeek: [ '4' ],
            startTime: '18:45:00',
            endTime: '19:30:00',
            color: 'red'
        },
        {
            daysOfWeek: [ '6' ],
            startTime: '15:00:00',
            endTime: '16:30:00',
            color: 'purple'
        },
        {
            title: 'test recurring event',
            color: 'orange',
            rrule: {
                freq: 'weekly',
                byweekday: [ 'fr' ],
                dtstart: '2023-07-25T10:30:00',
                until: '2023-10-25'
            },
            exdate: ['2023-08-18T10:30:00']
        }
    ],
})

function getToday() { // e.g. 2023-01-01
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let result = `${year}-${format2digits(month)}-${format2digits(day)}`;
    console.log("today result: ", result);
    return result;
}

function getTimeFromIsoString(isoString) {
    let result = isoString.match(/\d\d:\d\d/);
    console.log(result[0]);
    return result[0];
}

// weeklyAvailability: {
//     tuesday: ["09:00", true, "03:00", false],
//     monday: ["09:45", true, "05:00", false]
// }

// result of getWeeklyEventForCalendar()
// {
//     tu: ["09:00", "17:00"],
//     mo: ["12:15", "17:05"]
// }
function addEventToCalendar() {
    calendarOptions.value.events = [];
    //// weekly events
    for (const [key, value] of Object.entries(getWeeklyEventForCalendar())) {
        const weekly = {
            title: 'added recurring event',
            color: 'pink',
            rrule: {
                freq: 'weekly',
                byweekday: [key],
                dtstart: `${getToday()}T${value[0]}:00`,
                until: '2023-10-25'
            },
            exdate: [`2023-08-15T${value[0]}:00`]
        }
        calendarOptions.value.events.push(weekly);
    }

    //// date overrides
}

addEventToCalendar();


function handleDateClick(arg) {
      alert('date click! ' + arg.dateStr)
    }

</script>

<template>
    <div>
        <p>getWeeklyEventForCalendar(): {{ getWeeklyEventForCalendar() }}</p>
        <p>calendarOptions: {{ calendarOptions.events }}</p>
        <h1>this is calendar</h1>

        <FullCalendar :options="calendarOptions"/>
    </div>




</template>
