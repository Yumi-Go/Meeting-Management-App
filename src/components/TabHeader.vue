<script setup>
const props = defineProps({
    tabHeaderText: String
});

</script>
<template>
    <v-container fluid class="d-flex mb-5">
        <v-row justify="center" class="tw-text-3xl tw-font-extrabold tw-tracking-wide text-indigo-darken-4">
            {{ tabHeaderText.toUpperCase() }}
        </v-row>
    </v-container>
</template>
