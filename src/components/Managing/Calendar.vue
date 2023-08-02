<script setup>
import { ref, watch, computed, onBeforeMount } from "vue"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendar } from '../../composables/useCalendar'
import { useFirestore } from '../../composables/useFirestore'
import { useLocalStorage } from '@vueuse/core';

const currentUser = useLocalStorage('currentUser', {});
const { addWeeklyEvent, deleteWeeklyEvent, editWeeklyEvent } = useCalendar();

console.log("addWeeklyEvent: ", addWeeklyEvent());

const testExDate = new Date('August 11, 2023 08:30:00');
// const today = new Date();

const calendarOptions = {
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
}

function today() { // e.g. 2023-01-01
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let result = `${year}-${month}-${day}`;
    console.log(result);
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

// result of addWeeklyEvent()
// {
//     tu: ["09:00", true, "03:00", false],
//     mo: ["09:45", true, "05:00", false]
// }
function addEvent() {
    const weekly = {};
    for (const [key, value] of Object.entries(addWeeklyEvent())) {
        const weekly = {
        color: 'pink',
        rrule: {
            freq: 'weekly',
            byweekday: [key],
            dtstart: `${today()}T10:30:00`,
            until: '2023-10-25'
        },
        exdate: ['2023-08-18T10:30:00']
    }






    }
    calendarOptions.events.push();
    

}

function deleteEvent() {


}



function handleDateClick(arg) {
      alert('date click! ' + arg.dateStr)
    }

</script>

<template>
    <div>
        <p>{{ addWeeklyEvent() }}</p>
        <h1>this is calendar</h1>

        <FullCalendar :options="calendarOptions"/>
    </div>




</template>
