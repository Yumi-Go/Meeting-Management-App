<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarOptions = {
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        dateClick: handleDateClick,
        events: [
          { title: 'event 1', date: '2019-04-01' },
          { title: 'event 2', date: '2019-04-02' }
        ]
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
