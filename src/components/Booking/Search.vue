<script setup>
import { ref, watch, onBeforeMount } from "vue"
// import { useMemberSearch } from '../../composables/useMemberSearch';
import { useFirestore } from '../../composables/useFirestore';
import { useSearch } from '../../composables/useSearch';
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import SearchBar from "./SearchBar.vue";
import SearchResult from "./SearchResult.vue";

const { userSearch, getUserSearchResult, getUserSearchResultToDisplay } = useSearch();
const searchedUsersInfo = useLocalStorage('searchedUsers', []);

watch(userSearch, async() => {
    await getUserSearchResultToDisplay();
});

onBeforeMount(async() => {
    await getUserSearchResultToDisplay();
});

</script>

<template>
    <SearchBar/>
    <SearchResult/>
</template>