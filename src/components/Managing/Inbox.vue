<script setup>
import { ref } from "vue"
import { useFirestore } from '../../composables/useFirestore';
import { useAuth } from "../../composables/useAuth";
import InboxSearchBar from "./InboxSearchBar.vue";
import InboxSearchResult from "./InboxSearchResult.vue";

const { userStateObserver } = useAuth();


const currentUserInfo = userStateObserver();


</script>

<template>
    <InboxSearchBar/>
    <InboxSearchResult/>

</template>