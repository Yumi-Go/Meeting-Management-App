<script setup>
import { ref } from 'vue'
import { useFirestore } from '../composables/useFirestore';
import { useRouter } from 'vue-router'

const router = useRouter();

const { 
        fName,
        mName,
        lName,
        organization,
        department,
        position,
        role,
        location,
        timezone,
    } = useFirestore();

const password = ref();
function submit() {

}

</script>


<template>
    This is setting page
    <v-sheet width="800" class="mx-auto">
        <v-form ref="form" @submit.prevent>
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
                            v-model="timezone"
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
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="password"
                            label="Password"
                            required
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="passwordConfirm"
                            label="Password Confirmation"
                            required
                        />
                    </v-col>
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
                            @click="submit()"
                            type="submit"
                        >
                            Submit
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-sheet>
</template>
