<script setup>
import { ref, watch, onBeforeMount } from "vue"
import { useSearch } from '../../composables/useSearch';
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import SearchBar from "./SearchBar.vue";
import SearchResult from "./SearchResult.vue";

const { userSearch, getUserSearchResult } = useSearch();
const searchedUsers = useLocalStorage('searchedUsers', []);

// watch(userSearch, async() => {
//     await getUserSearchResult();
// });

// onBeforeMount(async() => {
//     await getUserSearchResult();
// });

</script>

<template>
    <SearchBar/>
    <SearchResult/>
</template>