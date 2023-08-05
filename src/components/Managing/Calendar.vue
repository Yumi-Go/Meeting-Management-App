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
const {
    getToday,
    getDurationMinutesFromISOstrings,
    getWeeklyEventsForCalendar,
    deleteWeeklyEvent,
    editWeeklyEvent,
    getDateOverridesForCalendar
} = useCalendar();
const { format2digits } = useDateTime();
const { userStateObserver } = useAuth();

userStateObserver();

watch(currentUser, (updatedCurrentUser) => {
    console.log("updatedCurrentUser: ", updatedCurrentUser);
    addEventToCalendar();
});

const testExDate = new Date('August 11, 2023 08:30:00');

const calendarOptions = ref({
    plugins: [ dayGridPlugin, interactionPlugin, rrulePlugin, timeGridPlugin ],
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: handleDateClick,
    businessHours: [
        {
            daysOfWeek: [ 1, 2, 3 ],
            startTime: '08:00',
            endTime: '18:00'
        },
        {
            daysOfWeek: [ 4, 5 ],
            startTime: '10:00',
            endTime: '16:00'
        }
    ],
    events: [
        // {
        //     groupId: 'blueEvents',
        //     title: 'My Event',
        //     daysOfWeek: [ '4' ],
        //     startTime: '18:45:00',
        //     endTime: '19:30:00',
        //     color: 'red'
        // },
        // {
        //     daysOfWeek: [ '6' ],
        //     startTime: '15:00:00',
        //     endTime: '16:30:00',
        //     color: 'purple'
        // },
        // {
        //     title: 'test recurring event',
        //     color: 'orange',
        //     rrule: {
        //         freq: 'weekly',
        //         byweekday: [ 'fr' ],
        //         dtstart: '2023-07-25T10:30:00',
        //         until: '2023-10-25'
        //     },
        //     exdate: ['2023-08-18T10:30:00']
        // }
    ],
})

function getTimeFromIsoString(isoString) {
    let result = isoString.match(/\d\d:\d\d/);
    console.log(result[0]);
    return result[0];
}

function addEventToCalendar() {
    calendarOptions.value.events = [];

// weeklyAvailability: {
//     tuesday: ["09:00", true, "03:00", false],
//     monday: ["09:45", true, "05:00", false]
// }

// result of getWeeklyEventForCalendar()
// {
//     tu: ["09:00", "17:00"],
//     mo: ["12:15", "17:05"]
// }

    //// weekly events
    console.log("getWeeklyEventsForCalendar(): ", getWeeklyEventsForCalendar());
    for (const [key, value] of Object.entries(getWeeklyEventsForCalendar())) {
        //// used getToday() arbitrarily for date to get time (time without date is unavailable in vanilla js)
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
        console.log("durationHrsMins: ", durationHrsMins());
        const weekly = {
            title: 'added recurring event',
            color: 'pink',
            rrule: {
                freq: 'weekly',
                byweekday: [key],
                dtstart: weeklyStartStr,
                until: '2023-10-25'
            },
            exdate: [],
            duration: durationHrsMins()
        }

        //// date overrides: corresponding to 'exdate' in above weekly obj
        const dateOverrides = currentUser.value.dateOverrides;
        const dateOverridesFromTimes = dateOverrides.map(fromUntilPairObj => 
            `${format2digits(new Date(fromUntilPairObj.from).getHours())}:${format2digits(new Date(fromUntilPairObj.from).getMinutes())}`
        );
        console.log("dateOverridesFromTimes: ", dateOverridesFromTimes);
        for (let i in dateOverridesFromTimes) {
            weekly.exdate.push(`${getDateOverridesForCalendar()[i]}T${value[0]}:00`);
            console.log("weekly.exdate: ", weekly.exdate);
        }
        //// leave below codes for later
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
    <div class="tw-bg-white">
        <FullCalendar :options="calendarOptions"/>
    </div>
</template>
