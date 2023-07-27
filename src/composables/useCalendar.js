import { ref } from 'vue'
import { useFirestore } from './useFirestore';
import { useDateTime } from '../composables/useDateTime'
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const currentUser = useLocalStorage('currentUser', {});





export function useCalendar() {

    // events: [
    //     {
    //         groupId: 'blueEvents', // recurrent events in this group move together
    //         title: 'My Event',
    //         daysOfWeek: [ '4' ],
    //         startTime: '18:45:00',
    //         endTime: '19:30:00'
    //     },
    //     {
    //         daysOfWeek: [ '2' ], // these recurrent events move separately
    //         startTime: '11:00:00',
    //         endTime: '11:30:00',
    //         color: 'orange'
    //     },
    //     {
    //         daysOfWeek: [ '6' ], // these recurrent events move separately
    //         startTime: '15:00:00',
    //         endTime: '16:30:00',
    //         color: 'purple'
    //     },
    //     {
    //         title: 'rrule recurring event',
    //         rrule: {
    //             freq: 'weekly',
    //             dtstart: '2023-07-14'
    //         },
    //         exdate: ['2023-08-11']
    //     }
    // ],
    
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




    function addWeeklyEvent() {
        const weeklyEvents = [];
        const weeklyAvailability = sortWeek(currentUser.value.weeklyAvailability);
        console.log("weeklyAvailability: ", weeklyAvailability);
        return weeklyAvailability;
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