<script setup>
import { onBeforeMount, watch, ref, reactive, computed } from 'vue'
import { useFirestore } from '../composables/useFirestore'
import { useAuth } from '../composables/useAuth'
import { auth, db } from '../firebaseConfig'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength, sameAs } from '@vuelidate/validators'
import PasswordResetPopup from '../components/Setting/PasswordResetPopup.vue';

const router = useRouter();
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
const { updateUserInfo, getUserInfoByUID } = useFirestore();
const { currentUser, userStateObserver, reAuthentication, changePassword } = useAuth();

userStateObserver();


const currentUserInLocalStorage = useLocalStorage("currentUser", null, { serializer: StorageSerializers.object });

// const currentUserInLocalStorage = userStateObserver();

console.log("currentUserInLocalStorage in Setting.vue: ", currentUserInLocalStorage.value);
console.log("currentUserInLocalStorage.fName in Setting.vue: ", currentUserInLocalStorage.value.fName);

const fName = ref(currentUserInLocalStorage.value.fName);
const mName = ref (currentUserInLocalStorage.value.mName);
const lName = ref(currentUserInLocalStorage.value.lName);
const organization = ref(currentUserInLocalStorage.value.organization);
const department = ref(currentUserInLocalStorage.value.department);
const position = ref(currentUserInLocalStorage.value.position);
const role = ref(currentUserInLocalStorage.value.role);
const location = ref(currentUserInLocalStorage.value.location);
const timezone = ref(currentUserInLocalStorage.value.timezone);
console.log("email in currentUserInLocalStorage.value: ", currentUserInLocalStorage.value.email);

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
        fName.value,
        mName.value,
        lName.value,
        organization.value,
        department.value,
        position.value,
        role.value,
        location.value,
        timezone.value
    );
    router.push('/');
}

const openPasswordResetPopup = ref(false);

function closePasswordResetPopup() {
    openPasswordResetPopup.value = false;
}

// const timeZones = Intl.supportedValuesOf('timeZone')

// timeZones.forEach(timeZone => {
//     console.log(timeZone)
// });

</script>


<template>
    <p
        v-for="error of v$.$errors"
        :key="error.$uid"
    >
    <strong> {{ error.$message }} </strong>
    </p>
    <p v-if="currentUser === null">No exist user logged in</p>
    <v-sheet v-else width="800" class="mx-auto ma-10 pa-5">
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
                        v-model="currentUser.email"
                        label="Email"
                        disabled
                    />
                </v-row>

                <v-row>
                    <v-btn
                        variant="tonal"
                        class="tw-w-full tw-mb-10"
                    >
                        Change Password
                        <v-dialog
                            v-model="openPasswordResetPopup"
                            activator="parent"
                            width="500"
                        >
                        <PasswordResetPopup
                            v-if="openPasswordResetPopup"
                            @closePasswordResetPopup="closePasswordResetPopup"/>
                        </v-dialog>
                    </v-btn>
                </v-row>
                <v-row>
                    <v-col class="mr-1 pa-0">
                        <v-btn
                            width="100%"
                            height="40"
                            color="indigo-darken-3"
                            variant="outlined"
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
                            color="indigo-darken-3"
                            variant="flat"
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
