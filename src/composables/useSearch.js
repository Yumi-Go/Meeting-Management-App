import { ref, watch } from "vue"
import { useFirestore } from "./useFirestore";
import { useLocalStorage, StorageSerializers } from '@vueuse/core'

const { getAllUserInfo, getUserInfoByName } = useFirestore();

const searchedUsersInfo = useLocalStorage('searchedUsers', []);
const userSearchResult = ref([]);
const userSearch = ref('');

export function useSearch() {

    async function getUserSearchResult() {
        if (userSearch.value.length > 0) {
            await getUserInfoByName(userSearch.value.toLowerCase());

        } else {
            await getAllUserInfo();
        }
    }

    return { userSearch, userSearchResult, getUserSearchResult }
}