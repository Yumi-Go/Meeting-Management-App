<script setup>
import { ref } from 'vue'
import Inbox from '../components/Managing/Inbox.vue'

const showInbox = ref(false);

function clickInboxBtn() {
    showInbox.value = true;

}

</script>

<template>
    this is managing page

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
    <Inbox v-if="showInbox"/>

</template>