<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useCalendar } from '../../composables/useCalendar'

const calendarOptions = {
    plugins: [ dayGridPlugin, interactionPlugin ],
    initialView: 'dayGridMonth',
    dateClick: handleDateClick,
    events: [
        { title: 'event 1', date: '2023-07-10' },
        { title: 'event 2', date: '2023-07-20' }
    ]
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

        <h1>this is calendar</h1>

        <FullCalendar :options="calendarOptions"/>
    </div>




</template>
