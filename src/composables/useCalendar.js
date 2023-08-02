import { ref } from 'vue'
import { useFirestore } from './useFirestore';
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const currentUser = useLocalStorage('currentUser', {});





export function useCalendar() {
    
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


// weeklyAvailability: {
//     tuesday: ["09:00", true, "03:00", false],
//     monday: ["09:45", true, "05:00", false]
// }

    function addWeeklyEvent() {
        const weeklyAvailability = sortWeek(currentUser.value.weeklyAvailability);
        console.log("weeklyAvailability: ", weeklyAvailability);
        const result = {};
        for (const [key, value] of Object.entries(weeklyAvailability)) {
            if (value) {
                const newKey = key.slice(0, 2);
                console.log("newKey: ", newKey);
                result[newKey] = value;
            }
        }
        console.log("result weeklyEvent: ", result);
        return result;
    }

    function deleteWeeklyEvent() {
    
    }

    function editWeeklyEvent() {

    }




    function addDateOverrides() {

    }

    function deleteDateOverrides() {
    
    }

    function editDateOverrides() {

    }



    return { addWeeklyEvent, deleteWeeklyEvent, editWeeklyEvent }
}