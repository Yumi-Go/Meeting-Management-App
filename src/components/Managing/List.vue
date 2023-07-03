<script setup>
import { Calendar } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';

let calendar = new Calendar(calendarEl, {
  plugins: [ listPlugin ],
  initialView: 'listWeek'
});




</script>

<template>
    <div>

        <h1>this is List</h1>

    </div>




</template>
