<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useLocalStorage } from '@vueuse/core';
import { auth } from '../../firebaseConfig'
// import { useAuth } from '../../composables/useAuth'
import { useFirestore } from '../../composables/useFirestore';
import { useSearch } from '../../composables/useSearch';
import { useFormat } from '../../composables/useFormat'
import { useDateTime } from '../../composables/useDateTime'
import { mdiGmail } from '@mdi/js';

const searchedUsers = useLocalStorage('searchedUsers', []);
// const users = ref([]);

const props = defineProps({
});

const emit = defineEmits(['closeMeetingRequestPopup']);

function closeBtnClick() {
    emit('closeMeetingRequestPopup');
    console.log("Meeting Request popup closed!");
}

const { userSearchResult, getUserInfoByUID, getAllUserInfo, getUserInfoByName, requestConnection, requestMeeting } = useFirestore();
const { getUserSearchResult } = useSearch();
const { capitalize } = useFormat();
const { timeItems } = useDateTime();
const popupUser = useLocalStorage('popupUser', {});
const meetingRequested = ref({
    status: false, // Boolean, Default: false(Pending), Only Accepted meetings(=true) are displayed on the calendar
    title: '',
    link: '',
    location: '',
    type: true, // Boolean, Default: true(internal), internal(=true, via this app) / external(=false, from external platform such as Google Calendar or manually added meetings)
    category: '',
    organizer: [],
    participants: [],
    start: [timeItems()[0], true], // e.g. [03:30, true] => AM(true)/PM(false)
    end: [timeItems()[0], false], // e.g. [03:30, false]
    duration: 0,
    timezone: '',
    etc: []
});

const selected = ref([]);
const autocompleteItems = ref([]);

async function getAutocompleteItems() {
    // await getAllUserInfo();
    // console.log("userSearchResult: ", userSearchResult.value);
    autocompleteItems.value = searchedUsers.value.map(
        user => user.fName + " " + user.lName + " // " + user.email
    );
    console.log("autocompleteItems.value: ", autocompleteItems.value);
}
getAutocompleteItems();
// onBeforeMount(() => {
//     getAutocompleteItems();
//     console.log("autocompleteItems.value: ", autocompleteItems.value);
// });

function sendMeetingRequest() {
    console.log("auth.currentUser.uid: ", auth.currentUser.uid);
    console.log("popupUser.value.uid: ", popupUser.value.uid);
    requestMeeting(auth.currentUser.uid, popupUser.value.uid, meetingRequested.value);
}



</script>

<template>

    <v-card
        class="mx-auto"
        color="blue-grey-lighten-5"
    >
        <v-sheet width="800" class="mx-auto">
            <v-form ref="form" @submit.prevent>
                <v-container>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.title"
                            label="Title"
                            required
                        />
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.link"
                            label="Link"
                        />
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.location"
                            label="Location"
                        />
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.category"
                            label="Category"
                        />
                    </v-row>
                    <v-row>

                        <v-autocomplete
                            v-model="selected"
                            :items="autocompleteItems"
                            chips
                            closable-chips
                            color="blue-grey-lighten-2"
                            item-title="fName"
                            item-value="fName"
                            label="Participants"
                            multiple
                        >
                            <template v-slot:chip="{ props, item }">
                                <v-chip
                                    v-bind="props"
                                    :text="item.raw.fName"
                                />
                            </template>
                            <!-- <template v-slot:item="{ props, item }">
                                <v-list-item
                                    v-bind="props"
                                    :title="item?.raw?.fName"
                                    :subtitle="item?.raw?.email"
                                />
                            </template> -->
                        </v-autocomplete>


                    </v-row>
                    <v-row>
                        <div class="d-flex flex-row justify-space-between w-100">
                            <div class="d-flex flex-row tw-w-[50%]">
                                <v-combobox
                                    v-model="meetingRequested.start[0]"
                                    :items="timeItems()"
                                    label="From"
                                    variant="outlined"
                                    density="compact"
                                    hide-details="auto"
                                    class="mr-0"
                                    base-color=""
                                    bg-color=""
                                    color=""
                                />
                                <v-chip
                                    class="ml-1 px-1"
                                    :color="meetingRequested.start[1] ? 'pink' : 'purple'"
                                    @click="meetingRequested.start[1] = !(meetingRequested.start[1])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="meetingRequested.start[1]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                            <div class="d-flex flex-row tw-w-[50%]">
                                <v-combobox
                                    v-model="meetingRequested.end[0]"
                                    :items="timeItems()"
                                    label="From"
                                    variant="outlined"
                                    density="compact"
                                    hide-details="auto"
                                    class="mr-0"
                                    base-color=""
                                    bg-color=""
                                    color=""
                                />
                                <v-chip
                                    class="ml-1 px-1"
                                    :color="meetingRequested.end[1] ? 'pink' : 'purple'"
                                    @click="meetingRequested.end[1] = !(meetingRequested.end[1])"
                                    variant="text"
                                    label
                                    :ripple="false"
                                >
                                    <span v-if="meetingRequested.end[1]" class="">
                                        am
                                    </span>
                                    <span v-else class="">
                                        pm
                                    </span>
                                </v-chip>
                            </div>
                        </div>
                    </v-row>
                    <v-row>
                        <v-text-field
                            v-model="meetingRequested.etc"
                            label="Other References / Links"
                        />
                    </v-row>

                    <v-row>
                        <v-col class="mr-1 pa-0">
                            <v-btn
                                width="100%"
                                height="40"
                                color="error"
                                class=""
                                @click="closeBtnClick"
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
                                @click="sendMeetingRequest"
                                type="submit"
                            >
                                Save
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-sheet>


        <v-card-actions>
            <v-spacer/>
            <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeBtnClick"
            >
                Cancel
            </v-btn>



        </v-card-actions>
    </v-card>

</template>

