<template>
  <div class="flex flex-col gap-2 ">
    <p class="font-semibold">{{ invoiceData?.company?.name }}</p>
    <p>{{ invoiceData?.company?.email }}</p>
    <p>{{ invoiceData?.company?.address }}</p>
    <p>{{ invoiceData?.company?.phone }}</p>

  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  invoiceData: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.border-gray-200 {
  @apply border-opacity-75;
}
</style>