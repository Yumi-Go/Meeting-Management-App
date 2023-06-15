<script setup>
import { ref } from 'vue'
import UserRequestPopup from './UserRequestPopup.vue';

const props = defineProps({
    userSearchResult: Array,
});

function users() {
    props.userSearchResult.forEach(user => {
        user['checked'] = false;
    });
    return props.userSearchResult;
}


// props.userSearchResult.forEach(user => {
//     console.log("user: ", user);
//     user['checked'] = false;
// });

console.log("users(): ", users());

const openUserPopup = ref(false);

const chosenUser = ref();
const chosenUsers = ref([]);

function clickUser(user) {
    openUserPopup.value = true;
    chosenUser.value = user;
    console.log("chosenUser: ", chosenUser.value);
    // local storage need to hold this chosenUser info for refreshing of the page
}

</script>

<template>
    <v-container fluid class="">
        <!-- <v-row>
            {{ userSearchResult }}
        </v-row> -->
        <v-row>
            <v-list
                class="tw-w-full"
                select-strategy="classic"
            >
                <v-list-subheader class="tw-text-black">
                    Users Search Result
                </v-list-subheader>
                <v-list-item v-if="userSearchResult.length < 1" class="tw-p-5 tw-font-bold">
                    <div
                        class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-[500px]"
                    >
                        <div>
                            No Result
                            <!-- icon -->
                        </div>
                    </div>
                </v-list-item>
                <v-list-item
                    v-else
                    v-for="user in users()"
                    :value="user"
                >
                    <!-- {{ user.checked }} -->
                    <v-list-item-action>
                        <v-checkbox v-model="user.checked">
                            <template #label>
                                <div
                                    @click="clickUser(user)"
                                    class="tw-flex tw-flex-row tw-w-full"
                                >
                                    <div class="tw-w-[40%]">
                                        {{ user.fName }}
                                        {{ user.mName }}
                                        {{ user.lName }}
                                    </div>
                                    <div class="tw-grow">
                                        {{ user.email }}
                                    </div>
                                </div>
                            </template>
                        </v-checkbox>
                    </v-list-item-action>
                    <v-dialog
                        v-model="openUserPopup"
                        width="auto"
                    >
                        <UserRequestPopup
                            :user="chosenUser"
                            width="80vw"/>
                    </v-dialog>
                </v-list-item>
            </v-list>
        </v-row>
        <v-row>
            <div class="tw-w-full tw-my-2">
                <v-btn
                    @click=""
                    variant="flat"
                    block
                    color="grey-darken-4"
                    :disabled="chosenUsers.length < 1"
                    class=""
                >
                    <template #prepend>
                        <v-icon color="">
                            <span class="material-symbols-outlined">
                                groups
                            </span>
                        </v-icon>
                    </template>
                    Check the availability for all selected
                </v-btn>
            </div>

        </v-row>

    </v-container>

</template>

<style>
  .activeListItem {
    background-color: red !important;

}
</style>


