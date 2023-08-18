<script setup>
import { useAuth } from '../composables/useAuth'
import { auth } from '../firebaseConfig'
import { useLocalStorage } from '@vueuse/core'
import { useFormat } from '../composables/useFormat'
import SignIn from '../components/SignIn.vue'
import TabHeader from '../components/TabHeader.vue'
import SearchTitle from "../components/Booking/SearchTitle.vue";
import SearchBar from "../components/Booking/SearchBar.vue";
import SearchResult from "../components/Booking/SearchResult.vue";


const { userStateObserver, logOut } = useAuth();
const { capitalize } = useFormat();

userStateObserver();
const currentUser = useLocalStorage('currentUser', {});
const tabHeaderText = "Book a Meeting"


</script>


<template>
    <!-- 필터 넣기 (커넥션 리스트만 체크해서 보여주는) -->
    <!-- 컴포넌트 구조 Inbox.vue랑 통일할지 말지 결정해서 수정하기 -->
    <SignIn v-if="currentUser.length < 1"/>
    <v-container v-else fluid class="d-flex flex-column">
        <v-row>
            <TabHeader
                :tabHeaderText="tabHeaderText"
            />
        </v-row>
        <v-row class="flex-1-1-100">
            <div class="w-100 d-flex flex-column">
                <div class="d-flex">
                    <SearchTitle/>
                </div>
                <div class="d-flex">
                    <SearchBar/>
                </div>
                <div class="d-flex">
                    <SearchResult/>  
                </div>
            </div>
        </v-row>
    </v-container>
</template>