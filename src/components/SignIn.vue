<script setup>
import { useRouter } from 'vue-router'
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { auth } from "../firebaseConfig"
import { useFirestore } from '../composables/useFirestore';
import { useAuth } from '../composables/useAuth';

const { addUser } = useFirestore();
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            addUser(authResult.user.uid, authResult.user.email);
            return false;
        },
        uiShown: function() {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInSuccessUrl: '/account',
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

const router = useRouter();

</script>

<template>
    <v-container fluid class="tw-h-full">
        <div class="tw-h-full tw-grid tw-place-content-center tw-bg-white/70">
            <div id="firebaseui-auth-container"></div>
            <div id="loader" class="tw-text-center tw-font-black">Loading...</div>
        </div>
    </v-container>
</template>
