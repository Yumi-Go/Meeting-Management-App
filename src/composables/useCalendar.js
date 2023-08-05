import { ref } from 'vue'
import { useFirestore } from './useFirestore';
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const currentUser = useLocalStorage('currentUser', {});
const { format2digits } = useDateTime();

export function useCalendar() {

    function getToday() { // e.g. '2023-01-01'
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let result = `${year}-${format2digits(month)}-${format2digits(day)}`;
        return result;
    }

    function getDurationMinutesFromISOstrings(startISOstr, endISOstr) {
        const start = new Date(startISOstr);
        console.log("start: ", start);
        const end = new Date(endISOstr);
        console.log("end: ", end);
        const duration = (end.getTime() - start.getTime()) / 60000; // in minutes
        console.log("duration: ", duration);
        return duration;
    }

    function sortWeek(obj) {
        const sortedDays = {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null
        };
        for (const [key, value] of Object.entries(sortedDays)) {
            if (obj[key]) {
                sortedDays[key] = obj[key];
            }
        }
        console.log("sortedDays: ", sortedDays);
        return sortedDays;
    }

    function formatWeeklyEventTime(timeArr) { // e.g. [ 9, 0, 5, 0 ]
        const result = timeArr[0] + ":" + timeArr[1]

    }



    function getWeeklyAvailabilityForCalendar() {
        
    }


    function getWeeklyEventsForCalendar() {
        const weeklyAvailability = sortWeek(currentUser.value.weeklyAvailability);
        const result = {};
        for (const [key, value] of Object.entries(weeklyAvailability)) {
            if (value) {
                const newKey = key.slice(0, 2);
                result[newKey] = value;
            }
        }
        return result;
    }

    function deleteWeeklyEvent() {
    
    }

    function editWeeklyEvent() {

    }


    function getDateOverridesForCalendar() {
        const dateOverrides = currentUser.value.dateOverrides;
        const yearMonthDate = [];
        dateOverrides.forEach(fromUntilPairObj => {
            const year = new Date(fromUntilPairObj.from).getFullYear();
            const month = new Date(fromUntilPairObj.from).getMonth();
            const date = new Date(fromUntilPairObj.from).getDate();
            yearMonthDate.push(`${year}-${format2digits(month+1)}-${format2digits(date)}`);
        });
        console.log("yearMonthDate: ", yearMonthDate);
        return yearMonthDate;
    }

    function deleteDateOverrides() {
    
    }

    function editDateOverrides() {

    }



    return { getToday, getDurationMinutesFromISOstrings, getWeeklyEventsForCalendar, deleteWeeklyEvent, editWeeklyEvent, getDateOverridesForCalendar }
}