<script setup>
import { ref } from 'vue'

const props = defineProps({
    search: String,
    searchResult: Array,
});

</script>

<template>
    <v-container fluid class="tw-px-5">
        <v-row>
            {{ searchResult }}
        </v-row>
        <v-row>
                <v-list
                    bg-color="purple"
                    class="tw-w-full tw-h-[600px] tw-m-0 tw-text-white"
                >
                    <v-list-item v-if="searchResult.length < 1" class="tw-p-5 tw-font-bold">
                        <div
                            class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-h-[500px]"
                        >
                            <div>
                                No Result
                                <!-- icon -->
                            </div>
                            <div>
                                <span class="tw-text-[#E0E0E0] tw-opacity-80">
                                    User Does Not Exist
                                </span>
                            </div>
                        </div>
                    </v-list-item>
                    <v-list-item v-else class="tw-font-bold">
                        <span class="tw-text-[#FFF9C4]">
                            Users Search Result
                        </span>
                    </v-list-item>
                    <v-list-item
                        v-for="user in searchResult"
                        class="tw-group"
                    >
                        <div class="tw-flex tw-flex-row tw-hover:bg-red-300 tw-cursor-pointer tw-hover:text-black group-hover:tw-bg-pink-700">
                            <div class="tw-w-[40%] tw-bg-white tw-opacity-80 tw-text-black tw-px-3 tw-py-2 tw-mr-1 tw-font-bold">
                                {{ user.fName }}
                                {{ user.mName }}
                                {{ user.lName }}
                            </div>
                            <div class="tw-grow tw-bg-white tw-opacity-50 tw-text-black tw-px-3 tw-py-2 tw-font-bold">
                                {{ user.email }}
                            </div>
                        </div>
                        <!-- <v-divider thickness="3px" class="tw-mt-1"/> -->
                    </v-list-item>
                </v-list>
            </v-row>

    </v-container>

</template>




