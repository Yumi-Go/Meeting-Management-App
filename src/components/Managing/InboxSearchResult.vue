<script setup>
import { ref } from "vue"
import ReceivedRequestsPopup from './ReceivedRequestsPopup.vue';

const props = defineProps({
    inboxSearchResult: Array,
});

const openRequestPopup = ref(false);

const chosenRequest = ref();

function clickRequest(request) {
    openRequestPopup.value = true;
    chosenRequest.value = user;
    console.log("chosenRequest: ", chosenRequest.value);
    // local storage need to hold this chosenRequest info for refreshing of the page
}

</script>

<template>
    this is InboxSearchResult component
    <v-container fluid class="tw-px-5">
        <!-- <v-row>
            {{ inboxSearchResult }}
        </v-row> -->
        <v-row>
            <v-list
                bg-color="grey-lighten-2"
                class="tw-w-full tw-h-[600px] tw-m-0 tw-text-white"
            >

                <v-list-subheader class="tw-text-black">
                    Requests I received
                </v-list-subheader>

                <v-list-item v-if="inboxSearchResult.length < 1" class="tw-p-5 tw-font-bold">
                    <div
                        class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-[500px]"
                    >
                        <div>
                            No Result
                            <!-- icon -->
                        </div>
                        <div>
                            <span class="tw-text-[#E0E0E0] tw-opacity-80">
                                Received Request Does Not Exist
                            </span>
                        </div>
                    </div>
                </v-list-item>
                <v-list-item v-else class="tw-font-bold">
                    <span class="tw-text-black">
                        Requests Search Result
                    </span>
                </v-list-item>
                <v-list-item
                    v-for="request in inboxSearchResult"
                    class="tw-group"
                >
                    <div
                        @click="clickRequest(request)"
                        class="tw-flex tw-flex-row tw-hover:bg-red-300 tw-cursor-pointer tw-hover:text-black group-hover:tw-bg-slate-400">
                        <div class="tw-w-[40%] tw-bg-white tw-opacity-80 tw-text-black tw-px-3 tw-py-2 tw-mr-1 tw-font-bold">
                            {{ request }}
                        </div>
                        <!-- <div class="tw-grow tw-bg-white tw-opacity-50 tw-text-black tw-px-3 tw-py-2 tw-font-bold">
                            {{ request }}
                        </div> -->
                    </div>
                    <v-dialog
                        v-model="openRequestPopup"
                        width="auto"
                    >
                        <ReceivedRequestsPopup
                            request:="chosenRequest"
                            width="80vw"/>
                    </v-dialog>
                </v-list-item>
            </v-list>
        </v-row>

    </v-container>

</template>
