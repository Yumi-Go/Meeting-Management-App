<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import rrulePlugin from '@fullcalendar/rrule'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendar } from '../../composables/useCalendar'

const { addWeeklyEvent, deleteWeeklyEvent, editWeeklyEvent } = useCalendar();

console.log("addWeeklyEvent: ", addWeeklyEvent());

const testDate = new Date('July 10, 2023 08:30:00');

const calendarOptions = {
    plugins: [ dayGridPlugin, interactionPlugin, rrulePlugin ],
    initialView: 'dayGridMonth',
    dateClick: handleDateClick,
    events: [
        {
            groupId: 'blueEvents', // recurrent events in this group move together
            title: 'My Event',
            daysOfWeek: [ '4' ],
            startTime: '18:45:00',
            endTime: '19:30:00'
        },
        {
            daysOfWeek: [ '2' ], // these recurrent events move separately
            startTime: '11:00:00',
            endTime: '11:30:00',
            color: 'orange'
        },
        {
            daysOfWeek: [ '6' ], // these recurrent events move separately
            startTime: '15:00:00',
            endTime: '16:30:00',
            color: 'purple'
        },
        {
            title: 'rrule recurring event',
            rrule: {
                freq: 'weekly',
                dtstart: testDate,
                until: '2023-09-25'
            },
            exdate: ['2023-08-11']
        }
    ],
}

function addEvent() {

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
