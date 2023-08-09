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
    weekdayNames,
    getYearMonthDayStr,
    getToday,
    getDayNameOfDateObj,
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
    addEventToCalendar();
});

const calendarOptions = ref({
    plugins: [ dayGridPlugin, interactionPlugin, rrulePlugin, timeGridPlugin ],
    initialView: 'timeGridWeek',
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: handleDateClick,
    businessHours: [],
    events: []
})

function getTimeFromIsoString(isoString) {
    let result = isoString.match(/\d\d:\d\d/);
    console.log(result[0]);
    return result[0];
}

function addAvailabilityToCalendar() {
    // console.log("getWeeklyEventsForCalendar(): ", getWeeklyEventsForCalendar());
    for (const [key, value] of Object.entries(getWeeklyEventsForCalendar())) {
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
        const weekly = {
            title: 'Weekly Availability',
            color: 'yellow',
            display: 'background',
            rrule: {
                freq: 'weekly',
                byweekday: [key],
                dtstart: weeklyStartStr,
                until: '2023-10-25'
            },
            // exdate: ['2023-08-08T14:00:00', '2023-08-15T14:00', '2023-08-15T14:00'],
            exdate: [],
            duration: durationHrsMins()
        }

        //// date overrides: corresponding to 'exdate' in above weekly obj
        const dateOverrides = currentUser.value.dateOverrides;
        dateOverrides.forEach((fromUntilPairObj, index) => {
            console.log("getDateOverridesForCalendar(): ", getDateOverridesForCalendar());
            const dateStr = getDateOverridesForCalendar()[index];
            console.log("dateStr: ", dateStr);

            const fromTimeStr = `${format2digits(new Date(fromUntilPairObj.from).getHours())}:${format2digits(new Date(fromUntilPairObj.from).getMinutes())}:00`;
            const untilTimeStr = `${format2digits(new Date(fromUntilPairObj.until).getHours())}:${format2digits(new Date(fromUntilPairObj.until).getMinutes())}:00`;
            const overrideEvent = {
                title: 'Overwritten Availability',
                start: `${dateStr}T${fromTimeStr}`,
                end: `${dateStr}T${untilTimeStr}`,
                display: 'background',
                color: 'yellow'
            }

            // 여기 하다말았음. 데이터 더 넣어서 테스트해봐야 함!
            const availableDayFullNames = Object.keys(currentUser.value.weeklyAvailability);
            const dayFullName = getDayNameOfDateObj(new Date(fromUntilPairObj.from));
            console.log("availableDayFullNames: ", availableDayFullNames);
            console.log("getDayNameOfDateObj(new Date(fromUntilPairObj.from)): ", getDayNameOfDateObj(new Date(fromUntilPairObj.from)));
            if (availableDayFullNames.includes(dayFullName)) {
                const exdateTime = currentUser.value.weeklyAvailability[dayFullName][0];
                weekly.exdate.push(`${dateStr}T${exdateTime}:00`);
                calendarOptions.value.events.push(overrideEvent);
            }
        });
        console.log("weekly: ", weekly);
        calendarOptions.value.events.push(weekly);
    }
    console.log("calendarOptions.value.events: ", calendarOptions.value.events);

}

function addAvailabilityDateOverridesToCalendar() { // shown as background events on calendar
    const dateOverrides = currentUser.value.dateOverrides;
    dateOverrides.forEach((fromUntilPairObj, index) => {
        const dateStr = getDateOverridesForCalendar()[index];
        const fromTimeStr = `${format2digits(new Date(fromUntilPairObj.from).getHours())}:${format2digits(new Date(fromUntilPairObj.from).getMinutes())}`;
        const untilTimeStr = `${format2digits(new Date(fromUntilPairObj.until).getHours())}:${format2digits(new Date(fromUntilPairObj.until).getMinutes())}`;
        const overrideBgEvent = {
            groupId: 'availabilityDateOverrides', // date overrides for availability (solved as background event)
            start: `${dateStr}T${fromTimeStr}`,
            end: `${dateStr}T${untilTimeStr}`,
            display: 'background',
        }
        calendarOptions.value.events.push(overrideBgEvent);
    });
}

function addEventToCalendar() {
    calendarOptions.value.events = [];
    addAvailabilityToCalendar();
    // addAvailabilityDateOverridesToCalendar();
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
