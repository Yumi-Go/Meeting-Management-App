<script setup>
import { ref } from "vue"
// import { useMemberSearch } from '../../composables/useMemberSearch'
import { useFirestore } from '../../composables/useFirestore';
import SearchResult from "./SearchResult.vue";

const { searchResult, getAllUserInfo, getUserInfoByName } = useFirestore();
const search = ref('');

function getSearchResult() {
    if (search.value.length > 0) {
        getUserInfoByName(search.value.toLowerCase());
    } else {
        getAllUserInfo();
    }
    console.log("searchResult: ", searchResult.value);
}

</script>

<template>
    <v-container fluid class="">
        <!-- <v-row>
            {{ searchResult }}
        </v-row> -->
        <v-row>
            <v-text-field
                v-model="search"
                label="Search"
                color="black"
                bg-color=""
                single-line
                hide-details
                class="tw-mb-1"
                variant="outlined"
                @keypress.enter="getSearchResult"
            >
                <template #append-inner>
                    <!-- <v-icon icon="md:home" @click.prevent="getSearchResult"/> -->
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