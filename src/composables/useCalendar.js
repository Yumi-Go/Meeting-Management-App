import { ref } from 'vue'
import { useFirestore } from './useFirestore';
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const currentUser = useLocalStorage('currentUser', {});
const { getMeetingByDocID } = useFirestore();
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
        return sortedDays;
    }

    function getWeeklyAvailabilityForCalendar() {
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

    function deleteWeeklyAvailability() {
    
    }

    function updateWeeklyAvailability() {

    }

    function getDateOverridesForCalendar() {
        const dateOverrides = currentUser.value.dateOverrides;
        const yearMonthDate = [];
        dateOverrides.forEach(fromUntilPairObj => {
            yearMonthDate.push(getYearMonthDayStr(new Date(fromUntilPairObj.from)));
        });
        return yearMonthDate;
    }

    function deleteDateOverrides() {
    
    }

    function updateDateOverrides() {

    }

    return {
        weekdayNames,
        getYearMonthDayStr,
        getToday,
        getDayNameOfDateObj,
        getDurationMinutesFromISOstrings,
        getWeeklyAvailabilityForCalendar,
        deleteWeeklyAvailability,
        updateWeeklyAvailability,
        getDateOverridesForCalendar,
    }
}