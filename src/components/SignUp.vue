<script setup>
import { ref } from 'vue'
import { useAuth } from "../composables/useAuth"
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { auth } from "../firebaseConfig"


var uiConfig = {
    signInSuccessUrl: 'http://www.google.com',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
};
var ui = new firebaseui.auth.AuthUI(auth);
ui.start('#firebaseui-auth-container', uiConfig);

const { emailSignUp } = useAuth();

const fName = ref('');
const mName = ref('');
const lName = ref('');
const organization = ref('');
const department = ref('');
const position = ref('');
const role = ref('');
const location = ref('');
const timeZone = ref('');
const email = ref('');
const password = ref('');
const pNumber = ref('');
const error = ref(null);

</script>


<template>
    <v-sheet width="800" class="mx-auto">
        <v-form ref="form">
            <v-container>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="fName"
                            label="First Name"
                            required
                        />
                    </v-col>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="mName"
                            label="Middle Name (optional)"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="lName"
                            label="Last Name"
                            required
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="organization"
                            label="Organization"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="department"
                            label="Department"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="position"
                            label="Position"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="role"
                            label="Role"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="location"
                            label="Location"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="timeZone"
                            label="Time Zone"
                        />
                    </v-col>
                </v-row>
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
                </v-row>
            </v-container>
        </v-form>
    </v-sheet>
</template>
