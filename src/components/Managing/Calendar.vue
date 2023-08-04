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
const { getWeeklyEventsForCalendar, deleteWeeklyEvent, editWeeklyEvent, getDateOverridesForCalendar } = useCalendar();
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

function getToday() { // e.g. '2023-01-01'
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

function addEventToCalendar() {
    calendarOptions.value.events = [];

    //// weekly events
    for (const [key, value] of Object.entries(getWeeklyEventsForCalendar())) {
        const weekly = {
            title: 'added recurring event',
            color: 'pink',
            rrule: {
                freq: 'weekly',
                byweekday: [key],
                dtstart: `${getToday()}T${value[0]}:00`,
                until: '2023-10-25'
            },
            exdate: []
        }
        
        //// date overrides: corresponding to 'exdate' in above weekly obj
        const dateOverrides = currentUser.value.dateOverrides;
        const dateOverridesFromTimes = dateOverrides.map(fromUntilPairObj => 
            `${format2digits(new Date(fromUntilPairObj.from).getHours())}
            :${format2digits(new Date(fromUntilPairObj.from).getMinutes())}`
        );
        console.log("dateOverridesFromTimes: ", dateOverridesFromTimes);
        for (let i in dateOverridesFromTimes) {
            weekly.exdate.push(`${getDateOverridesForCalendar()[i]}T${value[0]}:00`);
            console.log("weekly.exdate: ", weekly.exdate);
        }
        // leave below codes for later
        // dateOverridesFromTimes.forEach((fromTime, index) => {
        //     weekly.exdate.push(`${getDateOverridesForCalendar()[index]}T${fromTime}:00`);
        //     console.log("weekly.exdate: ", weekly.exdate);
        // });
        console.log("weekly: ", weekly);
        calendarOptions.value.events.push(weekly);
    }
    console.log("calendarOptions.value.events: ", calendarOptions.value.events);
}

addEventToCalendar();

function handleDateClick(arg) {
    alert('date click! ' + arg.dateStr);
}

</script>

<template>
    <div>
        <FullCalendar :options="calendarOptions"/>
    </div>
</template>
