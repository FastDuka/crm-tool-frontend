<script setup>

import SettingsLinksView from "@/views/settings/components/SettingsLinksView.vue";
import TheSideNav from "@/components/TheSideNav.vue";
</script>

<template>
  <div class="theme-flex-col h-full">

    <h1 class="primary-header">Settings</h1>

    <div class="flex flex-1 h-full w-full">
      <div class="hidden md:block z-50 h-full bg-white">
        <settings-links-view/>
      </div>

      <div class=" w-full  p-4 md:p-0 primary-bg overflow-x-hidden overflow-y-auto h-full ">
        <div class="p-2 flex-grow flex-1 h-full w-full overflow-y-scroll">
          <router-view/>
        </div>

      </div>

    </div>

  </div>
</template>

<style scoped>

</style>