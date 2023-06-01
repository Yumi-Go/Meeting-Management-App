<script setup>
import { onBeforeMount, ref, reactive, computed } from 'vue'
import { useFirestore } from '../composables/useFirestore'
import { useAuth } from '../composables/useAuth'
import { auth, db } from '../firebaseConfig'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers, minLength, maxLength, sameAs } from '@vuelidate/validators'

const router = useRouter();
const { getUserInfo, updateUserInfo } = useFirestore();
const { changePassword } = useAuth();
const userAuth = auth.currentUser;

function userData() {
    getUserInfo()
    .then((data) => {
        console.log("data: ", data);
        console.log("data type: ", typeof data);
        return data;
    });
}
userData();

const fName = ref('');
const mName = ref('');
const lName = ref('');
const organization = ref('');
const department = ref('');
const position = ref('');
const role = ref('');
const location = ref('');
const timezone = ref('');

onBeforeMount(() => {
    fName.value = userData.fName ?? '';
    mName.value = userData.mName ?? '';
    lName.value = userData.lName ?? '';
    organization.value = userData.organization ?? 'nope';
    department.value = userData.department ?? '';
    position.value = userData.position ?? '';
    role.value = userData.role ?? '';
    location.value = userData.location ?? '';
    timezone.value = userData.timezone ?? '';
    console.log("fName: ", fName.value);
    console.log("userData|: ", userData.email);
});



const rules = {
    fName: {
        required,
        maxLength: helpers.withMessage(
            'First Name must be 50 characters or less.',
            maxLength(50)
        ),
    },
    mName: {
        maxLength: helpers.withMessage(
            'Middle Name must be 50 characters or less.',
            maxLength(50)
        ),
    },
    lName: {
        required,
        maxLength: helpers.withMessage(
            'Last Name must be 50 characters or less.',
            maxLength(50)
        ),
    },
    organization: {
        maxLength: helpers.withMessage(
            'Organization must be 50 characters or less.',
            maxLength(50)
        ),
    },
    department: {
        maxLength: helpers.withMessage(
            'Department must be 50 characters or less.',
            maxLength(50)
        ),
    },
    position: {
        maxLength: helpers.withMessage(
            'Position must be 50 characters or less.',
            maxLength(50)
        ),
    },
    role: {
        maxLength: helpers.withMessage(
            'Role must be 50 characters or less.',
            maxLength(50)
        ),
    },
    location: {
        maxLength: helpers.withMessage(
            'Location must be 50 characters or less.',
            maxLength(50)
        ),
    },
    timezone: {
        maxLength: helpers.withMessage(
            'Time Zone must be 50 characters or less.',
            maxLength(50)
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
    await updateUserInfo(
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
    <v-sheet width="800" class="mx-auto">
        <v-form ref="form" @submit.prevent="submit">
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
                        v-model="userAuth.email"
                        label="Email"
                        disabled
                    />
                </v-row>
                <v-row>
                    <v-btn variant="tonal" class="tw-w-full tw-mb-10">Change Password</v-btn>
                </v-row>
                <!-- <v-row>
                    <v-col class="mr-2 pa-0">
                        <v-text-field
                            v-model="state.password"
                            label="Password"
                            required
                        />
                    </v-col>
                    <v-col class="ma-0 pa-0">
                        <v-text-field
                            v-model="state.passwordConfirm"
                            label="Password Confirmation"
                            required
                        />
                    </v-col>
                </v-row> -->
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
