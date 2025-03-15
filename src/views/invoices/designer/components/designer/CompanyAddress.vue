<template>
  <!-- From Address -->
  <div class="space-y-4">
    <div class="space-y-3">
      <label class="block">
        <span class="text-sm font-medium text-gray-700">Company Name *</span>
        <input :value="modelValue.company.name"
               @input="updateCompanyField('name', $event.target.value)"
               class="input mt-1"
               placeholder="Your company name" />
      </label>
      <label class="block">
        <span class="text-sm font-medium text-gray-700">Email</span>
        <input :value="modelValue.company.email"
               @input="updateCompanyField('email', $event.target.value)"
               type="email"
               class="input mt-1"
               placeholder="company@example.com" />
      </label>

      <p class="cursor-pointer text-blue-400"
         @click="showMoreAddressDetails = !showMoreAddressDetails"><span v-if="showMoreAddressDetails">Show
          Less</span><span v-else>Show More</span></p>


      <div v-if="showMoreAddressDetails">


        <label class="block">
          <span class="text-sm font-medium text-gray-700">Address</span>
          <textarea :value="modelValue.company.address"
                    @input="updateCompanyField('address', $event.target.value)"
                    class="input mt-1"
                    rows="2"
                    placeholder="Street address"></textarea>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-gray-700">Phone</span>
          <input :value="modelValue.company.phone"
                 @input="updateCompanyField('phone', $event.target.value)"
                 class="input mt-1"
                 placeholder="Phone number" />
        </label>
      </div>
    </div>


  </div>
</template>

<script setup>

import { ref } from "vue";
import { currencyOptions } from "../../constants";

const showMoreAddressDetails = ref(false)

const currencyOptionsVals = currencyOptions;
console.log("vals", currencyOptionsVals);
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const updateCompanyField = (field, value) => {
  emit("update:modelValue", {
    ...props.modelValue,
    company: {
      ...props.modelValue.company,
      [field]: value,
    },
  });
};

const updateCustomerField = (field, value) => {
  emit("update:modelValue", {
    ...props.modelValue,
    customer: {
      ...props.modelValue.customer,
      [field]: value,
    },
  });
};

const updateField = (field, value) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};
</script>

<style scoped>
.input {
  @apply w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}

.select {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500;
}
</style>
