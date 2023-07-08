<script setup>
import { ref, watch, onBeforeMount } from "vue"
import { useSearch } from '../../composables/useSearch';

const { userSearch, getUserSearchResult, getUserSearchResultToDisplay } = useSearch();

async function clickSearch() {
    await getUserSearchResultToDisplay();
}

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
                @keypress.enter="clickSearch"
            >
                <template #append-inner>
                    <!-- <v-icon icon="md:home" @click.prevent="getSearchResult"/> -->
                    <v-icon  @click.prevent="clickSearch">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </v-icon>
                </template>
            </v-text-field>
        </v-row>
    </v-container>
</template>