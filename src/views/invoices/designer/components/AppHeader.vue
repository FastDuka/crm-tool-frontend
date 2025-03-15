<template>
  <div class="relative overflow-hidden border-b bg-gradient-to-r from-blue-50 to-purple-50">
    <div class="max-w-7xl mx-auto p-2">
      <div class="flex items-center justify-between">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-3">
          <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg">
            <ShoppingBag class="h-4 w-4 text-white" />
            <Zap class="h-4 w-4 text-white absolute -right-1 -top-1" />
          </div>
          <div>
            <h1 class="text-xl font-bold">
              <span class="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                FastDuka
              </span>
              <span class="text-gray-700"> Invoice Maker</span>
            </h1>
            <p class="text-gray-600 text-sm">
              Create professional invoices in minutes
            </p>
          </div>
        </div>

        <!-- Pro Badge -->
        <!-- <div class="hidden sm:flex items-center space-x-4">
          <div
            class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md"
          >
            <span class="text-white font-medium">Pro Version</span>
          </div>
        </div> -->
      </div>
    </div>

    <!-- Decorative Background Elements -->
    <div class="absolute top-0 right-0 -mt-20 -mr-20">
      <div class="w-40 h-40 bg-blue-200 rounded-full opacity-10"></div>
    </div>
    <div class="absolute bottom-0 left-0 -mb-20 -ml-20">
      <div class="w-40 h-40 bg-purple-200 rounded-full opacity-10"></div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingBag, Zap } from "lucide-vue-next";
</script>
