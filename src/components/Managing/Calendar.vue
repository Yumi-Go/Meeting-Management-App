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
    // console.log("updatedCurrentUser: ", updatedCurrentUser);
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
    businessHours: [],
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

// weeklyAvailability: {
//     tuesday: ["09:30", "20:00"],
//     monday: ["14:00", "17:00"]
// }

function addWeeklyAvailabilityToCalendar() {
    calendarOptions.value.businessHours = [];
    for (const [key, value] of Object.entries(currentUser.value.weeklyAvailability)) {
        const weeklyAvailability = {
            daysOfWeek: [],
            startTime: '',
            endTime: '',
            endRecur: '2023-10-30',
        };
        switch(key) {
            case 'sunday':
                weeklyAvailability.daysOfWeek = [0];
                break;
            case 'monday':
                weeklyAvailability.daysOfWeek = [1];
                break;
            case 'tuesday':
                weeklyAvailability.daysOfWeek = [2];
                break;
            case 'wednesday':
                weeklyAvailability.daysOfWeek = [3];
                break;
            case 'thursday':
                weeklyAvailability.daysOfWeek = [4];
                break;
            case 'friday':
                weeklyAvailability.daysOfWeek = [5];
                break;
            case 'saturday':
                weeklyAvailability.daysOfWeek = [6];
        }
        weeklyAvailability.startTime = value[0];
        weeklyAvailability.endTime = value[1];
        // console.log("weeklyAvailability: ", weeklyAvailability);
        calendarOptions.value.businessHours.push(weeklyAvailability);
    }
}

addWeeklyAvailabilityToCalendar();

function addAvailabilityDateOverridesToCalendar() { // shown as background events on calendar
    const dateOverrides = currentUser.value.dateOverrides;
    dateOverrides.forEach((fromUntilPairObj, index) => {
        const dateStr = getDateOverridesForCalendar()[index];
        const fromTimeStr = `${format2digits(new Date(fromUntilPairObj.from).getHours())}:${format2digits(new Date(fromUntilPairObj.from).getMinutes())}`;
        const untilTimeStr = `${format2digits(new Date(fromUntilPairObj.until).getHours())}:${format2digits(new Date(fromUntilPairObj.until).getMinutes())}`;
        const overrideBgEvent = {
            groupId: 'availabilityDateOverrides', // date overrides for availability (solved as background event)
            title: 'Not Available',
            start: `${dateStr}T${fromTimeStr}`,
            end: `${dateStr}T${untilTimeStr}`,
            color: 'grey',
            display: 'background'
        }
        // console.log("overrideBgEvent: ", overrideBgEvent);
        calendarOptions.value.events.push(overrideBgEvent);
    });
}

function addEventToCalendar() { // 이건 미팅 스케쥴 추가하는 함수로 바뀌어야함.
    calendarOptions.value.events = [];
    addAvailabilityDateOverridesToCalendar(); // 여기까지 했음!!!!!!!!

// result of getWeeklyEventForCalendar()
// {
//     tu: ["09:00", "17:00"],
//     mo: ["12:15", "17:05"]
// }

    //// weekly events: 이거 recurring 이벤트로 바꿔야 함!!!!!!!!!!!!!!!
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
            title: 'event from DB',
            color: '#993333',
            textColor: '#ffffe6',
            borderColor: 'red',
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
            // console.log("weekly.exdate: ", weekly.exdate);
        }
        // console.log("weekly: ", weekly);
        calendarOptions.value.events.push(weekly);
    }
    // console.log("calendarOptions.value.events: ", calendarOptions.value.events);
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
