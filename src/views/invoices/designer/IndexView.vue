<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Import and use the Header component -->
    <AppHeader />

    <!-- Main Content -->
    <div class="px-6 py-8">
      <div class="max-w-7xl mx-auto gap-2 flex flex-col">
        <!-- Designer and Preview Grid -->
        <div class="flex justify-between lg:grid-cols-2 gap-8 relative">
          <button @click="designerHidden = !designerHidden"
                  class="flex gap-2 text-xs items-center md:text-md rounded-md border px-2 py-2 h-fit w-fit bg-white">
            <div class="flex gap-2"
                 v-if="designerHidden">
              <EyeIcon class="w-4 h-4"></EyeIcon> <span>Show Editor </span>
            </div>
            <div class="flex gap-2"
                 v-else>
              <EyeOffIcon class="w-4 h-4"></EyeOffIcon> <span>Hide Editor</span>
            </div>
          </button>
          <button @click="previewHidden = !previewHidden"
                  class="flex gap-2 text-xs items-center md:text-md rounded-md border px-2 py-2 h-fit w-fit bg-white">
            <div class="flex gap-2"
                 v-if="previewHidden">
              <EyeIcon class="w-4 h-4"></EyeIcon> <span>Show Preview </span>
            </div>
            <div class="flex gap-2"
                 v-else>
              <EyeOffIcon class="w-4 h-4"></EyeOffIcon> <span>Hide Preview </span>
            </div>
          </button>
        </div>
        <div
             :class="`${designerHidden || previewHidden ? 'grid-cols-1 ' : ' grid-cols-1 lg:grid-cols-2'} grid gap-8 relative`">
          <!-- Designer Section -->
          <div v-if="!designerHidden"
               class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">

            <InvoiceDesigner v-model:invoiceData="invoiceData" />
          </div>

          <!-- Separator -->
          <div v-if="!designerHidden && !previewHidden"
               class="hidden lg:block absolute left-1/2 top-8 bottom-8 -ml-px">
            <div class="w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
            <div
                 class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-gray-200">
              <div
                   class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <i class="fas fa-arrow-right text-white"></i>
              </div>
            </div>
          </div>

          <!-- Preview Section -->

          <div v-if="!previewHidden"
               class="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <InvoicePreview :invoiceData="invoiceData" />
          </div>
        </div>
        <div v-if="designerHidden && previewHidden"
             class="flex flex-col gap-2 md:pt-12 w-full h-96 items-center justify-center ">
          <span class="text-6xl animate-[fade-in-out_4s_ease-in-out_infinite]"> 🤯</span>
          <p class="text-center">You discovered Jon Cena mode </p>
          <img class="animate-[fade-in-out_4s_ease-in-out_infinite]"
               src="../../../assets/gifs/cena.gif" />

        </div>
        <!-- <ChatInterface v-model="invoiceData" /> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import InvoiceDesigner from "@/views/invoices/designer/InvoiceDesigner.vue";
import InvoicePreview from "@/views/invoices/designer/InvoicePreview.vue";
import AppHeader from "@/views/invoices/designer/components/AppHeader.vue";
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";
import { ref } from "vue";
let today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
const tomorrow = yyyy + '-' + mm + '-' + dd + 1;
console.log("today", today)
const designerHidden = ref(false)
const previewHidden = ref(false)
const invoiceData = ref({
  company: {
    name: "",
    email: "",
    address: "",
    phone: "",
    logo: null,
  },
  customer: {
    name: "",
    email: "",
    address: "",
    phone: "",
  },
  subject: "",
  invoiceNumber: `INV-001-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
  date: today,
  dueDate: today,
  currency: "KES",
  items: [
    {
      id: 1,
      name: "Website Redesign",
      description:
        "Complete redesign of company website including responsive layouts",
      price: 2500.0,
      quantity: 1,
      tax: 16,
    },
  ],
  discount: {
    enabled: false,
    value: 10,
  },
  status: "draft",
  notes: "Thank you for your business! ",
  paymentTerms: "All Invoices Must be paid before the due date",
  paymentMethods: ["Credit Card", "Bank Transfer", "PayPal"],
  metadata: {
    createdAt: "2023-06-01T10:00:00Z",
    lastModified: "2023-06-01T15:30:00Z",
    createdBy: "sarah.designer@fikdesign.com",
  },
});
</script>

<style>
.card {
  @apply bg-white rounded-lg shadow;
}

.input {
  @apply w-full rounded-md py-2 border border-gray-300 px-2 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}

.select {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}

.btn-outline {
  @apply md:px-4 px-2 flex items-center text-sm py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700;
}

.btn-ghost {
  @apply p-2 text-gray-500 hover:text-gray-700;
}

.checkbox {
  @apply rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50;
}

@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes fade-in-out {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}
</style>
