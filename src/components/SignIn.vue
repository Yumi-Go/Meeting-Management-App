<script setup>
import { useRouter } from 'vue-router'
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { auth } from "../firebaseConfig"
import { useFirestore } from '../composables/useFirestore';

const { addUser } = useFirestore();
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            console.log("authResult: ", authResult);
            console.log("uid in authResult: ", authResult.user.uid);
            console.log("email in authResult: ", authResult.user.email);
            addUser(authResult.user.uid, authResult.user.email);
            return false;
        },
        uiShown: function() {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
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

const router = useRouter();

</script>

<template>
    <v-container fluid class="tw-h-[50vh] tw-bg-red-500">
        <v-row class="tw-h-full tw-grid tw-place-content-center tw-bg-blue-100">
            <div id="firebaseui-auth-container"></div>
            <div id="loader" class="tw-font-black">Loading...</div>
        </v-row>
    </v-container>
</template>
