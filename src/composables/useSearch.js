import { ref, watch } from "vue"
import { useFirestore } from "./useFirestore";
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { userSearchResult, getAllUserInfo, getUserInfoByName } = useFirestore();

const searchedUsersInfo = useLocalStorage('searchedUsers', []);
// const searchResultToDisplay = ref([]);
const userSearch = ref('');

export function useSearch() {

    async function getUserSearchResult() {
        // searchedUsersInfo.value = [];
        if (userSearch.value.length > 0) {
            await getUserInfoByName(userSearch.value.toLowerCase());
        } else {
            await getAllUserInfo();
        }
    }

    //// Booking -> User Search
    async function getUserSearchResultToDisplay() {
        await getUserSearchResult();
        console.log("userSearchResult: ", userSearchResult.value);
        searchedUsersInfo.value = userSearchResult.value;

        // 여기가 문제임. 네임 입력시 checked가 로컬에 안들어감.
        searchedUsersInfo.value.forEach(user => {
            console.log("user: ", user);
            user['checked'] = false;
        });

        console.log("searchedUsersInfo: ", searchedUsersInfo.value);
    }

    return { userSearch, getUserSearchResult, getUserSearchResultToDisplay }
}