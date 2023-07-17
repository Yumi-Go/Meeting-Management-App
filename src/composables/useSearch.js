import { ref, watch } from "vue"
import { useFirestore } from "./useFirestore";
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { getAllUserInfo, getUserInfoByName } = useFirestore();

const searchedUsers = useLocalStorage('searchedUsers', []);
const userSearch = ref('');
// const userSearchResult = ref([]);

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
    
    // async function getUserSearchResult(search) {
    //     if (search) {
    //         await getUserInfoByName(userSearch.value.toLowerCase());
    //     } else {
    //         await getAllUserInfo();
    //     }
    //     userSearchResult.value = searchedUsers.value;
    //     console.log("userSearchResult: ", userSearchResult.value);
    // }



    // return { userSearch, userSearchResult, getUserSearchResult }
    return { userSearch, getUserSearchResult }
}