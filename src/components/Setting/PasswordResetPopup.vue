<script setup>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const { isUserReAuthenticated, isPasswordChanged, userStateObserver, reAuthentication, changePassword } = useAuth();
const router = useRouter();

userStateObserver();
const props = defineProps({
});

const emit = defineEmits(['closePasswordResetPopup']);

function closeBtnClick() {
    emit('closePasswordResetPopup');
    console.log("popup closed!");
}

const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

function reAuthenticationBtnClick() {
    reAuthentication(currentPassword.value);
    console.log("isUserReAuthenticated in popup: ", isUserReAuthenticated.value);
    if (isUserReAuthenticated.value !== true) {
        alert("Password is not correct!");
        currentPassword.value = "";
    }
}

function changePasswordBtnClick() {
    if (newPassword.value === confirmNewPassword.value) {
        console.log("newPassword: ", newPassword.value);
        changePassword(newPassword.value);
        console.log("isPasswordChanged: ", isPasswordChanged.value);
           if (isPasswordChanged.value === true) {
            userStateObserver();
                alert("Password is changed successfully!");
                emit('closePasswordResetPopup');
                router.push('/account');
            } else {
                alert("Fail to change password.. something is wrong");
            }
            newPassword.value = "";
            confirmNewPassword.value = "";
    } else {
        alert("Enter password correctly!");
    }
}

</script>

<template>

    <p>{{ currentPassword }}</p>
    <v-card v-if="isUserReAuthenticated === false">
        <v-card-title>
            <span class="text-h5">Re-Authentication</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-text-field
                        v-model="currentPassword"
                        label="Current Password*"
                        type="password"
                        required
                    />
                </v-row>
                <v-row>
                    <v-btn
                        @click="reAuthenticationBtnClick"
                    >
                        Re-Authentication
                    </v-btn>

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
        </v-card-actions>
    </v-card>

    <v-card v-else>
        <v-card-title>
            <span class="text-h5">Change Password</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-text-field
                        v-model="newPassword"
                        label="New Password*"
                        type="password"
                        required
                    />
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="confirmNewPassword"
                        label="Confirm Password*"
                        type="password"
                        required
                    />
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
                @click="changePasswordBtnClick"
            >
                Save
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
