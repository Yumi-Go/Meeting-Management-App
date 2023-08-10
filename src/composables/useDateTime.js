import { useLocalStorage } from '@vueuse/core';

const currentUser = useLocalStorage('currentUser', {});

export function useDateTime() {

    function format2digits(number) {
        return ("0" + number).slice(-2);
    }

    function timeItems() {
        var interval = 15;
        var times = [];
        var minuteSum = 0;
        for (var i = 0; minuteSum < 60*12; i++) {
            var hour = Math.floor(minuteSum / 60);
            var minute = (minuteSum % 60);
            // times[i] = ("0" + (hour % 12)).slice(-2) + ':' + ("0" + minute).slice(-2);
            times[i] = format2digits(hour % 12) + ':' + format2digits(minute);
            minuteSum = minuteSum + interval;
        }
        // console.log("times: ", times);
        return times;
    }

    function timeItemsIn24hrs() {
        var interval = 15;
        var times = [];
        var minuteSum = 0;
        for (var i = 0; minuteSum < 60*24; i++) {
            var hour = Math.floor(minuteSum / 60);
            var minute = (minuteSum % 60);
            times[i] = format2digits(hour % 24) + ':' + format2digits(minute);
            minuteSum = minuteSum + interval;
        }
        console.log("timeItemsIn24hrs: ", times);
        return times;
    }

    function removeApmFromTimeArr(timeArr) { // e.g. ['03:00', false] => '15:00'
        let hour = Number(timeArr[0].split(":")[0]);
        hour = timeArr[1] === false ? hour += 12 : hour; // PM
        hour = format2digits(hour);
        let minute = Number(timeArr[0].split(":")[1]);
        minute = format2digits(minute);
        return [hour, minute];
    }

    function removeApmFromTimeStr(timeStr) { // e.g. '03:00 pm' => '15:00'

    }

    function generateApmWithTimeArr(timeStr) { // e.g. '15:00' => ['03:00', false]
        let hour = Number(timeStr.split(":")[0]);
        let minute = Number(timeStr.split(":")[1]);
        if (hour > 11) {
            return [`${format2digits(hour - 12)}:${format2digits(minute)}`, false]
        } else {
            return [`${format2digits(hour)}:${format2digits(minute)}`, true]
        }
    }

    function generateApmWithTimeStr(timeStr) { // e.g. '15:00' => '03:00 pm'
        
    }

    function formatDateStrWithTimezone(date) { // e.g. Date object => '2023-07-12'
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

    return {
        format2digits,
        timeItems,
        timeItemsIn24hrs,
        removeApmFromTimeArr,
        generateApmWithTimeArr,
        formatDateStrWithTimezone,
        getTimeApm,
        getDuration
    }
}