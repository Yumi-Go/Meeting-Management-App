import { ref, watch } from "vue"
import { useFirestore } from "./useFirestore";
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { getAllUserInfo, getUserInfoByName } = useFirestore();

const searchedUsers = useLocalStorage('searchedUsers', []);

export function useMeeting() {

    async function getMeetingObj() {

    }
    

    return {  }
}