<script setup>
import { ref, watch, computed, onBeforeMount } from "vue"
import { Calendar } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/vue3'
import listPlugin from '@fullcalendar/list';

// let calendar = new Calendar(calendarEl, {
//   plugins: [ listPlugin ],
//   initialView: 'listWeek'
// });

const calendarOptions = ref({
    plugins: [ listPlugin ],
    initialView: 'listWeek',
    height: 600,
})


</script>

<template>
    <div class="bg-white">
        <FullCalendar :options="calendarOptions"/>
    </div>

</template>
