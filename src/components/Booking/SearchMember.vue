<script setup>
import { ref } from "vue"
// import { useMemberSearch } from '../../composables/useMemberSearch'
import { useFirestore } from '../../composables/useFirestore';
import SearchResult from "./SearchResult.vue";

const { searchResult, allUsers, getAllUserInfo, getUserInfoByName } = useFirestore();
const search = ref('');

function getSearchResult() {
    getUserInfoByName(search.value.toLowerCase());
    console.log("searchResult: ", searchResult.value);
}

</script>

<template>
    <v-container fluid class="tw-bg-blue-100">
        <v-row>
            searchResult in SearchMember.vue: 
        </v-row>
        <v-row>
            {{ searchResult }}
        </v-row>
        <v-row>
            <v-text-field
                v-model="search"
                label="Search"
                color="blue"
                bg-color="purple"
                single-line
                hide-details
                class="tw-mb-1"
                @keypress.enter="getSearchResult"
            >
                <template #append-inner>
                    <v-icon  @click.prevent="getSearchResult">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </v-icon>
                </template>
            </v-text-field>

        </v-row>
    </v-container>

    <SearchResult
        :search="search"
        :searchResult="searchResult"
    />

</template>