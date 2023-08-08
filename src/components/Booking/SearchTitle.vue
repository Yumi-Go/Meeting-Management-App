<script setup>
import { mdiAccountSearch } from '@mdi/js';

</script>

<template>
    <div class="d-flex flex-row pl-3 mb-3 py-5 bg-white tw-border-y-[1px] tw-border-gray-400">
        <div class="mr-2">
            <v-icon :icon="mdiAccountSearch" size="large" class="ma-0 pa-0"/>
        </div>
        <div class="tw-text-xl tw-font-bold ma-0 pa-0">
            SEARCH FOR USERS
        </div>
    </div>
    <!-- <v-card
        class="mx-auto"
        width="400"
        prepend-icon="mdi-account-search"
    >
        <template v-slot:title>
            Search for Users
        </template>
        <v-card-text>
            This is content
        </v-card-text>
    </v-card> -->

</template>