<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useAuth } from './composables/useAuth';
import { auth } from './firebaseConfig';
import { useLocalStorage } from '@vueuse/core';
import { mdiHome, mdiAccountGroup, mdiClockOutline, mdiAccountCircle } from '@mdi/js';

const currentUser = useLocalStorage('currentUser', {});
const { userStateObserver, logOut } = useAuth();

userStateObserver();
const tab = ref(null);
const isUnreadMsgExist = ref(false);



function clickLogout() {
  logOut();
  window.location.href = "/";
}

</script>

<template>
  <v-container fluid class="d-flex flex-column flex-nowrap h-screen w-75 tw-bg-red-50">
    <v-row class="tw-h-[80px]">
      <div class="w-100 d-flex flex-row justify-space-between">
        <div class="d-flex">
          <v-tabs
            v-model="tab"
            color="indigo-darken-4"
          >
            <v-tab :value="1" :prepend-icon="mdiHome" to="/">
              Home
            </v-tab>
            <v-tab :value="2" :prepend-icon="mdiAccountGroup" to="/booking">
              book a meeting
            </v-tab>
            <v-tab :value="3" :prepend-icon="mdiClockOutline" to="/managing">
              manage schedules
            </v-tab>
            <v-tab :value="4" :prepend-icon="mdiAccountCircle" to="/account">
              account
            </v-tab>
          </v-tabs>
        </div>
        <div class="d-flex flex-row">
          <div>
            <v-btn
                variant="plain"
                :color="isUnreadMsgExist ? 'red' : 'black'"
            >
              <template #prepend>
                <v-icon v-if="isUnreadMsgExist" color="red">
                  <span class="material-symbols-outlined">
                      mark_email_unread
                  </span>
                </v-icon>
                <v-icon v-else color="black">
                  <span class="material-symbols-outlined">
                      mail
                  </span>
                </v-icon>
              </template>
                  Inbox
            </v-btn>
          </div>
          <div>
            <v-btn
              @click="clickLogout()"
              variant="plain"
              class="ma-0 py-0">
              Log Out
            </v-btn>
          </div>
        </div>
      </div>

    </v-row>
    <v-row class="flex-1-1-100 tw-bg-red-50">
      <div class="w-100 d-flex justify-center tw-pt-5">
        <router-view/>        
      </div>
    </v-row>
  </v-container>
</template>
