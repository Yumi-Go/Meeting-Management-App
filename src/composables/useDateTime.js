import { useLocalStorage } from '@vueuse/core';

const currentUser = useLocalStorage('currentUser', {});

export function useDateTime() {

    function timeItems() {
        var interval = 15;
        var times = [];
        var minuteSum = 0;
        for (var i = 0; minuteSum < 60*12; i++) {
            var hour = Math.floor(minuteSum / 60);
            var minute = (minuteSum % 60);
            times[i] = ("0" + (hour % 12)).slice(-2) + ':' + ("0" + minute).slice(-2);
            minuteSum = minuteSum + interval;
        }
        return times;
    }
    
    function formatDate(date) { // e.g. 2023-07-12
        const tzOffset = date.getTimezoneOffset() * 60 * 1000;
        return new Date(date.getTime() - tzOffset).toISOString().split('T')[0];;
    }

    function formatStartEndTime(time) { // e.g. 09:00 am - 05:00 pm
 
    }

    function getTimeApm(timeArr) {
        if (timeArr[1] === true) {
            return timeArr[0] + ' am';
        } else {
            return timeArr[0] + ' pm';
        }
    }

    function getDuration(startTimeArr, endTimeArr) {

    }

    return { timeItems, formatDate, getTimeApm, getDuration }
}