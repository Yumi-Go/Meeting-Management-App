<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from "../composables/useAuth"
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { auth } from "../firebaseConfig"

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            return true;
        },
        uiShown: function() {
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'redirect',
    signInSuccessUrl: '/setting',
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
};
var ui = new firebaseui.auth.AuthUI(auth);
ui.start('#firebaseui-auth-container', uiConfig);

const { emailSignUp } = useAuth();
const email = ref('');
const password = ref('');

const router = useRouter();

</script>

<template>
    <v-sheet width="800" class="mx-auto">
        <v-form ref="form">
            <v-container>
                <v-row>
                    <v-text-field
                        v-model="email"
                        label="Email"
                        required
                    />
                </v-row>
                <v-row>
                    <v-text-field
                        v-model="password"
                        label="Password"
                        required
                    />
                </v-row>
                <v-row>
                    <button @click="router.push('/signup')">Don't have an account? Register</button>
                </v-row>
                <v-row>
                    <v-col class="mr-1 pa-0">
                        <v-btn
                            width="100%"
                            height="40"
                            color="error"
                            class=""
                            @click="cancel"
                        >
                            Cancel
                        </v-btn>
                    </v-col>
                    <v-col class="ml-1 pa-0">
                        <v-btn
                            width="100%"
                            height="40"
                            color="success"
                            class=""
                            @click="emailSignUp(email, password)"
                        >
                            Submit
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row align-content="center" class="flex justify-center">
                    <div id="firebaseui-auth-container"></div>
                    <div id="loader">Loading...</div>
                </v-row>
            </v-container>
        </v-form>
    </v-sheet>
</template>
