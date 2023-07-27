<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendar } from '../../composables/useCalendar'

const { addWeeklyEvent, deleteWeeklyEvent, editWeeklyEvent } = useCalendar();

console.log("addWeeklyEvent: ", addWeeklyEvent());

const calendarOptions = {
    plugins: [ dayGridPlugin, interactionPlugin ],
    initialView: 'dayGridMonth',
    dateClick: handleDateClick,
    events: [
        {
            groupId: 'blueEvents', // recurrent events in this group move together
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
