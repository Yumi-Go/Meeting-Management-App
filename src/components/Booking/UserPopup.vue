<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { useFormat } from '../../composables/useFormat'
import MeetingRequestPopup from './MeetingRequestPopup.vue';
import UserAvailabilityCalendar from './UserAvailabilityCalendar.vue'

const props = defineProps({
    user: Object,
});

const popupUser = useLocalStorage('popupUser', {});
popupUser.value = props.user;

const displayedItems = [
    'email',
    'location',
    'organization',
    'department',
    'position',
    'role',
    'timezone'
];

const userInfoToDisplay = computed(() => {
    let result = {};
    if (popupUser.value) {
        for (const [key, value] of Object.entries(popupUser.value)) {
            if (displayedItems.includes(key)) {
                result[key] = value;
            }
        }
    }
    return result;
});

const { capitalize } = useFormat();
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
            <v-toolbar-title class="font-weight-bold">
                {{ capitalize(popupUser.fName) }}
                {{ capitalize(popupUser.mName) }}
                {{ capitalize(popupUser.lName) }}
            </v-toolbar-title>
        </v-toolbar>

        <v-container class="">
            <v-row no-gutters class="">
                <v-col class="bg-white" cols="12" lg="3">
                    <v-sheet class="pa-2 ma-2">
                        <v-list>
                            <v-list-item v-for="[key, value] in Object.entries(userInfoToDisplay)">
                                <template #subtitle>
                                    {{ capitalize(key) }}
                                </template>
                                {{ value }}
                            </v-list-item>
                            <v-list-item>
                                <v-btn
                                    @click="openMeetingRequestPopup = true"
                                    variant="flat"
                                    color="indigo"
                                    class="mt-10 w-100"
                                >
                                    Request a Meeting
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
                            </v-list-item>
                        </v-list>
                    </v-sheet>
                </v-col>
                <v-col class="bg-white" cols="12" lg="9">
                    <v-sheet class="pa-2 ma-2">
                        <div class="w-100 tw-text-center tw-text-xl tw-font-extrabold mb-10">
                            Availability
                        </div>
                        <div class="">
                            <UserAvailabilityCalendar/>
                        </div>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>