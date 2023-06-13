<script setup>
import { ref } from "vue"
// import { useMemberSearch } from '../../composables/useMemberSearch'
import { useFirestore } from '../../composables/useFirestore';
import SearchResult from "./SearchResult.vue";

const { userSearchResult, getAllUserInfo, getUserInfoByName } = useFirestore();
const userSearch = ref('');

function getUserSearchResult() {
    if (userSearch.value.length > 0) {
        getUserInfoByName(userSearch.value.toLowerCase());
    } else {
        getAllUserInfo();
    }
    console.log("userSearchResult: ", userSearchResult.value);
}

</script>

<template>
    <v-container fluid class="">
        <!-- <v-row>
            {{ userSearchResult }}
        </v-row> -->
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
                @keypress.enter="getUserSearchResult"
            >
                <template #append-inner>
                    <!-- <v-icon icon="md:home" @click.prevent="getSearchResult"/> -->
                    <v-icon  @click.prevent="getUserSearchResult">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </v-icon>
                </template>
            </v-text-field>

        </v-row>
    </v-container>

    <SearchResult
        :userSearchResult="userSearchResult"
    />

</template>