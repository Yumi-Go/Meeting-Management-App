import { ref } from "vue";
import { useFirestore } from "./useFirestore";

const search = ref('');
const { searchResult, allUsers, getUserInfoByName } = useFirestore();

export function useMemberSearch() {

    function filterByName() {
        return getUserInfoByName(search.value);
    }




    return { search, filterByName }
}