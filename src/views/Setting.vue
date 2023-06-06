<script setup>
import { onBeforeMount, watch, ref, reactive, computed } from 'vue'
import { useFirestore } from '../composables/useFirestore'
import { useAuth } from '../composables/useAuth'
import { auth, db } from '../firebaseConfig'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength, sameAs } from '@vuelidate/validators'
import PasswordResetPopup from '../components/PasswordResetPopup.vue';

const router = useRouter();
const { getUserInfo, updateUserInfo } = useFirestore();
const { userInfo, currentUser, userStateObserver, reAuthentication, changePassword } = useAuth();

userStateObserver();

// console.log("provider: ", user.providerData[0].providerId);


const pwd = ref('');
// const fName = ref('');
// const mName = ref('');
// const lName = ref('');
// const organization = ref('');
// const department = ref('');
// const position = ref('');
// const role = ref('');
// const location = ref('');
// const timezone = ref('');
console.log("userInfo: ", userInfo.value);


// const fName = ref(userInfo.value.fName ?? '');
// const mName = ref (userInfo.value.mName ?? '');
// const lName = ref(userInfo.value.lName ?? '');
// const organization = ref(userInfo.value.organization ?? 'nope');
// const department = ref(userInfo.value.department ?? '');
// const position = ref(userInfo.value.position ?? '');
// const role = ref(userInfo.value.role ?? '');
// const location = ref(userInfo.value.location ?? '');
// const timezone = ref(userInfo.value.timezone ?? '');
// console.log("fName: ", fName.value);

const fName = ref(userInfo.value.fName);
const mName = ref (userInfo.value.mName);
const lName = ref(userInfo.value.lName);
const organization = ref(userInfo.value.organization);
const department = ref(userInfo.value.department);
const position = ref(userInfo.value.position);
const role = ref(userInfo.value.role);
const location = ref(userInfo.value.location);
const timezone = ref(userInfo.value.timezone);
console.log("fName: ", fName);





// function loadUserInfo(data) {
//     fName.value = data.fName ?? '';
//     mName.value = data.mName ?? '';
//     lName.value = data.lName ?? '';
//     organization.value = data.organization ?? 'nope';
//     department.value = data.department ?? '';
//     position.value = data.position ?? '';
//     role.value = data.role ?? '';
//     location.value = data.location ?? '';
//     timezone.value = data.timezone ?? '';
//     console.log("fName: ", fName.value);
//     console.log("userData|: ", data.email);
// }

// async function userData() {
//     const data = await getUserInfo();
//     console.log("data: ", data);
//     console.log("data type: ", typeof data);
//     loadUserInfo(data);
// }
// userData();

const rules = {
    fName: {
        required: helpers.withMessage(
            'First Name is required.',
            required
        ),
        maxLength: helpers.withMessage(
            'First Name must be 20 characters or less.',
            maxLength(20)
        ),
    },
    mName: {
        maxLength: helpers.withMessage(
            'Middle Name must be 20 characters or less.',
            maxLength(20)
        ),
    },
    lName: {
        required: helpers.withMessage(
            'Last Name is required.',
            required
        ),
        maxLength: helpers.withMessage(
            'Last Name must be 20 characters or less.',
            maxLength(20)
        ),
    },
    organization: {
        maxLength: helpers.withMessage(
            'Organization must be 20 characters or less.',
            maxLength(20)
        ),
    },
    department: {
        maxLength: helpers.withMessage(
            'Department must be 20 characters or less.',
            maxLength(20)
        ),
    },
    position: {
        maxLength: helpers.withMessage(
            'Position must be 20 characters or less.',
            maxLength(20)
        ),
    },
    role: {
        maxLength: helpers.withMessage(
            'Role must be 20 characters or less.',
            maxLength(20)
        ),
    },
    location: {
        maxLength: helpers.withMessage(
            'Location must be 20 characters or less.',
            maxLength(20)
        ),
    },
    timezone: {
        maxLength: helpers.withMessage(
            'Time Zone must be 20 characters or less.',
            maxLength(20)
        ),
    },
    // password: {
    //     required,
    //     minLength: helpers.withMessage(
    //         'Password must be at least 6 characters.',
    //         minLength(6)
    //     ),
    //     maxLength: helpers.withMessage(
    //         'Password must be 20 characters or less.',
    //         maxLength(20)
    //     ),
    // },
    // passwordConfirm: {
    //     required,
    //     sameAsPassword: sameAs(state.password)
    // }
}

const v$ = useVuelidate(
    rules,
    {
        fName,
        mName,
        lName,
        organization,
        department,
        position,
        role,
        location,
        timezone
    }
);

async function submit() {
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
        console.log("Invalid form!!");
        return;
    }
    console.log("form validation succeed!");
    updateUserInfo(
        userInfo.value.fName,
        userInfo.value.mName,
        userInfo.value.lName,
        userInfo.value.organization,
        userInfo.value.department,
        userInfo.value.position,
        userInfo.value.role,
        userInfo.value.location,
        userInfo.value.timezone
    );
    router.push('/');
}

const passwordResetPopup = ref(false);

function closePasswordResetPopup() {
    passwordResetPopup.value = false;
}

// const timeZones = Intl.supportedValuesOf('timeZone')

// timeZones.forEach(timeZone => {
//     console.log(timeZone)
// });

</script>


<template>
    This is setting page
    <p
        v-for="error of v$.$errors"
        :key="error.$uid"
    >
    <strong> {{ error.$message }} </strong>
    </p>
    <p>{{ fName }}</p>
    <v-sheet width="800" class="mx-auto">
        <v-form ref="form" @submit.prevent>
            <v-container>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="userInfo.fName"
                            label="First Name"
                            required
                        />
                    </v-col>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="userInfo.mName"
                            label="Middle Name (optional)"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="userInfo.lName"
                            label="Last Name"
                            required
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="userInfo.organization"
                            label="Organization"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="userInfo.department"
                            label="Department"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="userInfo.position"
                            label="Position"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="userInfo.role"
                            label="Role"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="userInfo.location"
                            label="Location"
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="userInfo.timezone"
                            label="Time Zone"
                        />
                    </v-col>
                </v-row>
                <!-- <v-row>
                    <v-text-field
                        v-model="currentUser.email"
                        label="Email"
                        disabled
                    />
                </v-row> -->
                <v-row>
                    <v-text-field
                        v-model="pwd"
                        label="pwd"
                    />
                </v-row>
                <v-row>
                    <v-btn
                        @click="reAuthentication(pwd)"
                    >
                        Re-Authentication
                    </v-btn>

                </v-row>

                <v-row>
                    <v-btn
                        variant="tonal"
                        class="tw-w-full tw-mb-10"
                    >
                        Change Password
                        <v-dialog
                            v-model="passwordResetPopup"
                            activator="parent"
                            width="500"
                        >
                        <PasswordResetPopup
                            v-if="passwordResetPopup"
                            @closePasswordResetPopup="closePasswordResetPopup"/>
                        <!-- <v-card>
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
                                    @click="passwordResetPopupOpen = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    color="blue-darken-1"
                                    variant="text"
                                    @click="passwordResetPopupOpen = false"
                                >
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card> -->


                        </v-dialog>
                    </v-btn>
                </v-row>
                <v-row>
                    <v-col class="mr-1 pa-0">
                        <v-btn
                            width="100%"
                            height="40"
                            color="error"
                            class=""
                            @click="router.push('/')"
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
                            @click="submit"
                            type="submit"
                        >
                            Save
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </v-sheet>
</template>
