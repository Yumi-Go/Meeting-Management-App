import { ref, watch } from "vue"
import { useFirestore } from "./useFirestore";
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { userSearchResult, getAllUserInfo, getUserInfoByName } = useFirestore();

const searchedUsersInfo = useLocalStorage('searchedUsers', []);
// const searchResultToDisplay = ref([]);
const userSearch = ref('');

export function useSearch() {

    // async function users() {
    //     console.log("userSearchResult in users() before: ", userSearchResult.value);    
    //     await getUserSearchResult();
    //     userSearchResult.value.forEach(user => {
    //         console.log("user: ", user);
    //         user['checked'] = false;
    //     });
    //     console.log("userSearchResult in users(): ", userSearchResult.value);
    //     // return userSearchResult.value;
    // }



    async function getUserSearchResult() {
        // searchedUsersInfo.value = [];
        if (userSearch.value.length > 0) {
            await getUserInfoByName(userSearch.value.toLowerCase());
            // .then(result => {
            //     console.log("result: ", result);
            //     searchedUsersInfo.value.push(result);
            //     console.log("searchedUsersInfo.value: ", searchedUsersInfo.value);
            // })
        } else {
            await getAllUserInfo();
            // .then(result => {
            //     console.log("result: ", result);
            //     searchedUsersInfo.value = result;
            //     console.log("searchedUsersInfo.value: ", searchedUsersInfo.value);
            // })
        }

        // return userSearchResult.value;
    }


    //// Booking -> User Search
    async function getUserSearchResultToDisplay() {
        await getUserSearchResult();
        console.log("userSearchResult: ", userSearchResult.value);
        userSearchResult.value.forEach(user => {
            console.log("user: ", user);
            user['checked'] = false;
        });
        searchedUsersInfo.value = userSearchResult.value;
        console.log("searchedUsersInfo: ", searchedUsersInfo.value);
    }

    return { userSearch, getUserSearchResult, getUserSearchResultToDisplay }
}