<script setup>
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { auth } from '../../firebaseConfig'
import { useFirestore } from '../../composables/useFirestore';
import { useFormat } from '../../composables/useFormat'

const props = defineProps({
    requestedMeetingObj: Object,
});


</script>

<template>
    <p>{{ requestedMeetingObj }}</p>
    this is message popup in Inbox
</template>

