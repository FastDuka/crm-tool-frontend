<script setup>
import {ref} from "vue"
const props = defineProps({
  iconBgColor: {
    type: String,
    default: 'bg-gray-200'
  },
  iconTextColor: {
    type: String,
    default: 'text-gray-400'
  },
  loading: {
    type: Boolean,
    default: false
  },
});
import BaseLoader from "@/components/base/BaseLoader.vue";
</script>

<template>
  <div class="flex items-center p-4 bg-white rounded-lg shadow-xs min-w-56" >
    <div :class="[iconBgColor, iconTextColor]"
        class="p-3 mr-4 h-fit w-fit theme-flex rounded-full">
      <el-icon :size="32">
        <slot name="icon"></slot>
      </el-icon>
    </div>
    <div>
      <p class="mb-2 text-sm font-medium text-gray-600">
        <slot name="title"></slot>
      </p>
      <base-loader v-if="loading"></base-loader>
      <p  class="text-lg font-semibold text-gray-700">
        <slot name="text"></slot>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>