<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue'
import { useAuth } from './composables/useAuth';
import { useRouter } from 'vue-router'
import { auth } from './firebaseConfig';
import { useLocalStorage } from '@vueuse/core';
import { mdiHome, mdiAccountGroup, mdiClockOutline, mdiAccountCircle } from '@mdi/js';

const currentUserInLocalStorage = useLocalStorage('currentUser', {});
const { userStateObserver, logOut } = useAuth();
const router = useRouter();

userStateObserver();
const tab = ref(null);
const isUnreadMsgExist = computed(() => {
  let result = false;
  if (currentUserInLocalStorage.value.meetingsReceived) {
    for (const requestObj of currentUserInLocalStorage.value.meetingsReceived) {
      if (!requestObj.isRead) {
        result = true;
        break;
      }
    }
  }
  return result;
});

function clickInboxBtn() {
    router.push('/inbox');
    tab.value = 10;
}

function clickLogout() {
  logOut();
  window.location.href = "/";
}

</script>

<template>
  <div class="d-flex justify-center">
    <div class="d-flex flex-column h-screen w-75 tw-bg-red-50">
      <div v-if="Object.keys(currentUserInLocalStorage).length > 0" class="d-flex tw-h-[80px]">
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
                @click="clickInboxBtn"
                variant="plain"
                :color="isUnreadMsgExist ? 'red' : 'black'"
                class="tw-cursor-pointer"
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
      </div>
      <div class="flex-1-1-100 tw-bg-red-50">
        <div class="w-100 h-100 d-flex justify-center pa-5">
          <router-view/>        
        </div>
      </div>
    </div>
  </div>
</template>
