<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import UserRequestPopup from './UserRequestPopup.vue';
import { mdiOpenInNew } from '@mdi/js';
import { useLocalStorage, StorageSerializers } from '@vueuse/core'
import { useSearch } from '../../composables/useSearch';
import { useFirestore } from '../../composables/useFirestore';

const searchedUsersInfo = useLocalStorage('searchedUsers', []);
// const searchResultToDisplay = ref([]);

// const props = defineProps({
//     searchResultToDisplay: Array
// });

// const emit = defineEmits(['clickSearch']);


const { userSearch, getUserSearchResult, getUserSearchResultToDisplay } = useSearch();
const { getAllUserInfo, getUserInfoByName } = useFirestore();

getUserSearchResultToDisplay();

// onBeforeMount(async() => {
//     await getUserSearchResultToDisplay();
// });




// onBeforeMount(async() => {
//     await getUserSearchResult();
//     searchResultToDisplay.value = searchedUsersInfo.value;
//     searchResultToDisplay.value.forEach(user => {
//         console.log("user: ", user);
//         user['checked'] = false;
//     });
// });

// async function users() {
//     await getUserSearchResult();
//     userSearchResult.value.forEach(user => {
//         console.log("user: ", user);
//         user['checked'] = false;
//     });
//     console.log("userSearchResult in users(): ", userSearchResult.value);
//     // return userSearchResult.value;
// }


watch(userSearch, async() => {
    await getUserSearchResultToDisplay();
});

const openUserPopup = ref(false);
const popupUser = ref();

function getSelectedUsers() {
    return searchedUsersInfo.value.filter(user => user.checked);
}

function clickUser(user) {
    openUserPopup.value = true;
    popupUser.value = user;
    console.log("popupUser: ", popupUser.value);
    // local storage need to hold this chosenUser info for refreshing of the page
}

</script>

<template>
    <v-container fluid class="">
        <v-row>
            {{ searchedUsersInfo }}
        </v-row>
        <v-row>
            <v-list
                class="tw-w-full"
                select-strategy="classic"
            >
                <v-list-subheader class="tw-text-black">
                    Users Search Result
                </v-list-subheader>


                <v-list-item
                    v-if="searchedUsersInfo.length > 0"
                    v-for="user in searchedUsersInfo"
                    :value="user"
                    :key="user.uid"
                >
                    {{ user.checked }}
                    <template #prepend="{ isActive }">
                        <v-list-item-action start>
                            <v-checkbox-btn :model-value="isActive" v-model="user.checked">
                            </v-checkbox-btn>
                        </v-list-item-action>
                    </template>
                    <v-list-item-title
                        class="tw-w-[50%]"
                    >
                        {{ user.fName }}
                        {{ user.mName }}
                        {{ user.lName }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                        class=""
                    >
                        {{ user.email }}
                    </v-list-item-subtitle>
                    <template #append>
                        <v-btn
                            @click="clickUser(user)"
                            variant="tonal"
                        >
                            Open Dialog
                        </v-btn>
                    </template>
                    <v-dialog
                        v-model="openUserPopup"
                        width="auto"
                    >
                        <UserRequestPopup
                            :user="popupUser"
                            width="80vw"/>
                    </v-dialog>
                </v-list-item>


                <v-list-item
                    v-else
                    class="tw-p-5 tw-font-bold"
                >
                    <div
                        class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-[500px]"
                    >
                        <div>
                            No Result
                        </div>
                    </div>
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
                    :disabled="getSelectedUsers().length < 2"
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