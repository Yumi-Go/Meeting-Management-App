<script setup>
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { auth } from '../../firebaseConfig'
// import { useAuth } from '../../composables/useAuth'
import { useFirestore } from '../../composables/useFirestore';
import { useFormat } from '../../composables/useFormat'
import MeetingRequestPopup from './MeetingRequestPopup.vue';
import UserAvailabilityCalendar from './UserAvailabilityCalendar.vue'

const props = defineProps({
    user: Object,
});

const popupUser = useLocalStorage('popupUser', {});
popupUser.value = props.user;

// const { currentUser } = useAuth();
const { getUserInfoByUID, requestConnection, requestMeeting } = useFirestore();
const { capitalize } = useFormat();
const isConnected = ref(false);

console.log("currentUser: ", auth.currentUser);
console.log("viewed user: ", popupUser.value);

const openMeetingRequestPopup = ref(false);

function closeMeetingRequestPopup() {
    openMeetingRequestPopup.value = false;
}

</script>

<template>

    <v-card
        class="mx-auto"
        color="blue-grey-lighten-5"
    >
        <v-toolbar flat color="blue-grey-darken-4">
            <!-- <v-btn icon>
                <span class="material-symbols-outlined">
                    person
                </span>
            </v-btn> -->

            <v-toolbar-title class="font-weight-bold">
                {{ capitalize(popupUser.fName) }}
                {{ capitalize(popupUser.mName) }}
                {{ capitalize(popupUser.lName) }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn
                v-if="isConnected"
                disabled
                class=""
            >
                <div>
                    <v-tooltip
                        activator="parent"
                        location="top"
                    >
                        Connected
                    </v-tooltip>
                    <span class="material-symbols-outlined">
                        how_to_reg
                    </span>
                </div>
            </v-btn>
            <v-btn
                v-else-if="!isConnected && auth.currentUser.uid !== popupUser.uid"
                @click="requestConnection(auth.currentUser.uid, popupUser.uid)"
                class=""
            >
                <div>
                    <v-tooltip
                        activator="parent"
                        location="top"
                    >
                        Request a connection
                    </v-tooltip>
                    <span class="material-symbols-outlined">
                        person_add
                    </span>
                </div>
            </v-btn>
        </v-toolbar>

        <v-container class="">
            <v-row no-gutters>
                <v-col class="" cols="12" lg="3">
                    <v-sheet class="pa-2 ma-2">
                        <v-list>
                            <v-list-item v-for="[key, value] in Object.entries(popupUser)">
                                <template #subtitle>
                                    {{ capitalize(key) }}
                                </template>
                                {{ value }}
                            </v-list-item>
                            <!-- <v-list-item>
                                <v-btn block variant="outlined" class="">
                                    Check Schedule
                                </v-btn>
                            </v-list-item> -->
                        </v-list>
                        <!-- <v-card-text>
                            <v-text-field bg-color="blue-grey-lighten-4" color="blue-grey-darken-4" variant="underlined">
                                <template #label>
                                    <div class="tw-italic">Message to {{ capitalize(user.fName) }}...</div>
                                </template>
                            </v-text-field>
                        </v-card-text> -->
                    </v-sheet>
                </v-col>
                <v-col cols="12" lg="9">
                    <v-sheet class="pa-2 ma-2">
                        <UserAvailabilityCalendar/>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                @click="openMeetingRequestPopup = true"
                variant="text"
                color="indigo"
            >
                Send a Meeting Request
            </v-btn>

            <v-dialog
                v-model="openMeetingRequestPopup"
                width="auto"
            >
                <MeetingRequestPopup
                    @closeMeetingRequestPopup="closeMeetingRequestPopup"
                    width="auto"
                />
            </v-dialog>

        </v-card-actions>
    </v-card>

</template>

