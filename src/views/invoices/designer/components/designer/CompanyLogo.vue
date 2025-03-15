<template>
  <div class=" ">

    <div class="flex flex-col items-start  gap-2">
      <h3 class="font-semibold text-sm md:text-md text-gray-900">Logo</h3>

      <div
           class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
        <template v-if="modelValue">
          <img :src="modelValue"
               alt="Company logo"
               class="max-w-full max-h-full object-contain" />
          <button @click="removeLogo"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-4 w-4"
                 viewBox="0 0 20 20"
                 fill="currentColor">
              <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
            </svg>
          </button>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-8 w-8 text-gray-400"
               viewBox="0 0 20 20"
               fill="currentColor">
            <path fill-rule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clip-rule="evenodd" />
          </svg>
        </template>
      </div>

      <div class="flex-1 space-y-2">
        <input type="file"
               ref="fileInput"
               @change="handleLogoUpload"
               accept="image/*"
               class="hidden" />
        <button @click="$refs.fileInput.click()"
                class=" md:px-4 md:py-2 py-1 px-2 text-xs md:text-md bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          {{ modelValue ? 'Change ' : 'Upload Logo' }}
        </button>
        <p class="text-xs text-gray-500">
          300x100 pixels, PNG or JPG
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

console.log("mode", props)

const emit = defineEmits(['update:modelValue'])
const fileInput = ref(null)

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      emit('update:modelValue', e.target.result)
    }
    reader.readAsDataURL(file)
  }
}

const removeLogo = () => {
  emit('update:modelValue', null)
}
</script>