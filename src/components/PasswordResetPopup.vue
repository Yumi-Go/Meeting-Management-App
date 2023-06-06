<script setup>
import { useAuth } from '../composables/useAuth'

const { changePassword } = useAuth();

const props = defineProps({
});

const emit = defineEmits(['closePasswordResetPopup']);

function closeBtnClick() {
    emit('closePasswordResetPopup');
    console.log("popup closed!");
}

</script>

<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">Change Password</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-text-field
                        label="Password*"
                        type="password"
                        required
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field
                        label="Confirm Password*"
                        type="password"
                        required
                    ></v-text-field>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer/>
            <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeBtnClick"
            >
                Cancel
            </v-btn>
            <v-btn
                color="blue-darken-1"
                variant="text"
                @click="changePassword()"
            >
                Save
            </v-btn>
        </v-card-actions>
    </v-card>



</template>
