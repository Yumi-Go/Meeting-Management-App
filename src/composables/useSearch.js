import { ref, watch } from "vue"
import { useFirestore } from "./useFirestore";
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const currentUser = useLocalStorage('currentUser', []);

const { getAllUserInfo, getUserInfoByName } = useFirestore();
const userSearch = ref('');
// const userSearchResult = ref([]);

// const inboxSearch = ref('');

export function useSearch() {

    async function getUserSearchResult() {
        if (userSearch.value.length > 0) {
            await getUserInfoByName(userSearch.value.toLowerCase());
        } else {
            await getAllUserInfo();
        }
        // userSearchResult.value = searchedUsers.value;
        // console.log("userSearchResult: ", userSearchResult.value);
    }
    

    // function getInboxSearchResult() {
    //     if (currentUser.value.meetingRequestsReceived.length > 0) {
    //         if (inboxSearch.value.length > 0) {
    //             const input = inboxSearch.value.toLowerCase();
    //             inboxSearchResult.value = currentUserInLocalStorage.meetingRequestsReceived.filter(
    //                 request => request.toLowerCase().match(input));
    //         } else {
    //             inboxSearchResult.value = currentUserInLocalStorage.meetingRequestsReceived;
    //         }
    //     } else {
    //         inboxSearchResult.value = [];
    //     }
    // }



    return { userSearch, getUserSearchResult }
}