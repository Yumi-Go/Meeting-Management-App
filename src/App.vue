<script setup>
import HomeView from './views/HomeView.vue'

</script>

<template>

  <!-- add conditional rendering Nav bar (only if user logged in) later -->

  <div
    id="outerWrapper"
    class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-w-full tw-h-full"
  >
    <div class="tw-flex tw-flex-col tw-mt-10 tw-w-[80vw] tw-h-[80vh] tw-bg-red-50">
      <router-view/>
    </div>
  </div>
</template>
