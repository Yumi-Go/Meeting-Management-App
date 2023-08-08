<script setup>
import { ref, watch, onBeforeMount } from "vue"
import { useSearch } from '../../composables/useSearch';
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import SearchTitle from "./SearchTitle.vue";
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
    <SearchTitle/>
    <SearchBar/>
    <SearchResult/>
</template>