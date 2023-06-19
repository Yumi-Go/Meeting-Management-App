<script setup>
import { ref } from 'vue'
import Inbox from '../components/Managing/Inbox.vue'
import Availability from '../components/Managing/Availability.vue';

const showAvailability = ref(false);
const showInbox = ref(false);

function clickAvailabilityBtn() {
    showAvailability.value = !showAvailability.value;
    showInbox.value = false;
}

function clickInboxBtn() {
    showInbox.value = !showInbox.value;
    showAvailability.value = false;
}

</script>

<template>
    <div class="d-flex justify-space-between">
        <div class="text-left">
            <v-btn
                @click="clickAvailabilityBtn"
                variant="outlined"
            >
                <template #prepend>
                    <v-icon color="">
                        <span class="material-symbols-outlined">
                            more_time
                        </span>
                    </v-icon>
                </template>
                    Set Availability
            </v-btn>
        </div>

        <div class="text-right">
            <v-btn
                @click="clickInboxBtn"
                variant="outlined"
            >
                <template #prepend>
                    <v-icon color="">
                        <span class="material-symbols-outlined">
                            mail
                        </span>
                    </v-icon>
                    <v-icon color="red">
                        <span class="material-symbols-outlined">
                            mark_email_unread
                        </span>
                    </v-icon>
                </template>
                    Inbox
            </v-btn>
        </div>
    </div>
    <div class="tw-w-[100%]">
        <Inbox v-if="showInbox"/>
        <Availability v-else-if="showAvailability"/>
        <div v-else>
            Calendar / List / Chart
        </div>
    </div>



</template>