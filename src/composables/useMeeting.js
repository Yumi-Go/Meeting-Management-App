import { ref, watch } from "vue"
import { useFirestore } from "./useFirestore";
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { getAllUserInfo, getUserInfoByName } = useFirestore();

const currentUser = useLocalStorage('currentUser', []);

export function useMeeting() {

    async function getMeetingObj() {

    }
    
    // function getAllRequestsReceived() {
    //     return currentUser.value.meetingRequestsReceived;


    // }



    // return { getAllRequestsReceived }
}