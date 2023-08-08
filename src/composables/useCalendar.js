import { ref } from 'vue'
import { useFirestore } from './useFirestore';
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const currentUser = useLocalStorage('currentUser', {});
const { format2digits } = useDateTime();
const weekdayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function useCalendar() {

    function getYearMonthDayStr(dateObj) { // e.g. '2023-01-01'
        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();
        let result = `${year}-${format2digits(month)}-${format2digits(day)}`;
        return result;
    }

    function getToday() { // e.g. '2023-01-01'
        const date = new Date();
        return getYearMonthDayStr(date);
    }

    function getDayNameOfDateObj(date) {
        return weekdayNames[date.getDay()];
    }

    function getDurationMinutesFromISOstrings(startISOstr, endISOstr) {
        const start = new Date(startISOstr);
        const end = new Date(endISOstr);
        const duration = (end.getTime() - start.getTime()) / 60000; // in minutes
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
        // console.log("sortedDays: ", sortedDays);
        return sortedDays;
    }

    function formatWeeklyEventTime(timeArr) { // e.g. [ 9, 0, 5, 0 ]
        const result = timeArr[0] + ":" + timeArr[1]

    }



    function getWeeklyAvailabilityForCalendar() {
        
    }


    function getWeeklyEventsForCalendar() {
        const weeklyAvailability = sortWeek(currentUser.value.weeklyAvailability);
        // console.log("weeklyAvailability: ", weeklyAvailability);
        const result = {};
        for (const [key, value] of Object.entries(weeklyAvailability)) {
            if (value) {
                const newKey = key.slice(0, 2);
                result[newKey] = value;
            }
        }
        // console.log("result: ", result);
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
            yearMonthDate.push(getYearMonthDayStr(new Date(fromUntilPairObj.from)));
        });
        // console.log("yearMonthDate: ", yearMonthDate);
        return yearMonthDate;
    }

    function deleteDateOverrides() {
    
    }

    function editDateOverrides() {

    }

    return {
        weekdayNames,
        getYearMonthDayStr,
        getToday,
        getDayNameOfDateObj,
        getDurationMinutesFromISOstrings,
        getWeeklyEventsForCalendar,
        deleteWeeklyEvent,
        editWeeklyEvent,
        getDateOverridesForCalendar
    }
}