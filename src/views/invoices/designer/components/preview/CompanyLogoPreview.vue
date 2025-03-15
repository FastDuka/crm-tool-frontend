<template>
  <div class="">
    <!-- Logo Image -->
    <template v-if="logo">
      <img :src="logo"
           :alt="companyName"
           class="max-h-12 rounded-md w-auto object-contain"
           :class="[
            size === 'small' ? 'max-h-12' : '',
            size === 'large' ? 'max-h-20' : '',
          ]" />
    </template>

    <!-- Fallback to Company Initials -->
    <template v-else>
      <div class="rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-600 to-blue-800"
           :class="[
            size === 'small' ? 'w-10 h-10 text-lg' : '',
            size === 'medium' ? 'w-12 h-12 text-xl' : '',
            size === 'large' ? 'w-16 h-16 text-2xl' : '',
          ]">
        {{ companyInitials }}
      </div>
    </template>

    <!-- Company Name (Optional) -->
    <span v-if="showName"
          class="mt-2 text-gray-700 font-medium"
          :class="[
            size === 'small' ? 'text-sm' : '',
            size === 'large' ? 'text-lg' : '',
          ]">
      {{ companyName }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  logo: {
    type: String,
    default: null,
  },
  companyName: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  showName: {
    type: Boolean,
    default: false,
  },
});

const companyInitials = computed(() => {
  return props?.companyName
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2);
});
</script>

<style scoped>
.company-logo-preview {
  @apply flex flex-col items-center;
}

.company-logo-preview img {
  @apply transition-all duration-200;
}

.company-logo-preview img:hover {
  @apply opacity-90;
}
</style>
