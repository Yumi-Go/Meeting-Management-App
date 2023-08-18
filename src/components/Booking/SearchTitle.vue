<script setup>
import { useLocalStorage } from '@vueuse/core'
import { mdiAccountSearch } from '@mdi/js';

const currentUser = useLocalStorage('currentUser', {});

</script>

<template>
    <div class="w-100 d-flex pl-3 mb-3 py-5 tw-border-b-[1px] tw-border-gray-400">
        <div class="mr-2">
            <v-icon :icon="mdiAccountSearch" size="large" class="ma-0 pa-0"/>
        </div>
        <div class="tw-text-xl tw-font-bold ma-0 pa-0">
            SEARCH FOR USERS
        </div>
    </div>
</template>