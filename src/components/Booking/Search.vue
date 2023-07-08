<script setup>
import { ref, watch, onBeforeMount } from "vue"
// import { useMemberSearch } from '../../composables/useMemberSearch';
import { useFirestore } from '../../composables/useFirestore';
import { useSearch } from '../../composables/useSearch';
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import SearchResult from "./SearchResult.vue";

const { userSearch, getUserSearchResult, getUserSearchResultToDisplay } = useSearch();
const searchedUsersInfo = useLocalStorage('searchedUsers', []);

// watch(userSearch, async() => {
//     await getUserSearchResultToDisplay();
// });

// const searchResult = ref([]);

// async function clickSearch() {
//     await getUserSearchResult();
//     console.log("searchedUsersInfo: ", searchedUsersInfo.value);
//     searchResultToDisplay.value = searchedUsersInfo.value;
//     searchResultToDisplay.value.forEach(user => {
//         console.log("user: ", user);
//         user['checked'] = false;
//     });
// }

// onBeforeMount(async() => {
//     await getUserSearchResultToDisplay();
// });




</script>

<template>
    <v-container fluid class="">
        <v-row>
            <v-text-field
                v-model="userSearch"
                label="Search"
                color="black"
                bg-color=""
                single-line
                hide-details
                class="tw-mb-1"
                variant="outlined"
                @keypress.enter="getUserSearchResultToDisplay"
            >
                <template #append-inner>
                    <!-- <v-icon icon="md:home" @click.prevent="getSearchResult"/> -->
                    <v-icon  @click.prevent="getUserSearchResultToDisplay">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </v-icon>
                </template>
            </v-text-field>
        </v-row>
    </v-container>

    <SearchResult/>

</template>