<template>
  <div class="md:px-4 md:space-y-6">
    <!-- Bill To Address -->
    <div class="space-y-4">
      <h3 class="font-semibold text-gray-900">Bill To</h3>
      <div class="flex flex-wrap gap-2">
        <label class="block">
          <span class="text-sm font-medium text-gray-700">Customer Name *</span>
          <input :value="modelValue.customer.name"
                 @input="updateCustomerField('name', $event.target.value)"
                 class="input mt-1"
                 placeholder="Customer name" />
        </label>
        <label class="block w-full md:w-fit">
          <span class="text-sm font-medium text-gray-700">Email</span>
          <input :value="modelValue.customer.email"
                 @input="updateCustomerField('email', $event.target.value)"
                 type="email"
                 class="input mt-1"
                 placeholder="customer@example.com" />
        </label>
        <p class="cursor-pointer w-full text-blue-400"
           @click="showMoreAddressDetails = !showMoreAddressDetails">
          <span v-if="showMoreAddressDetails">Show Less</span><span v-else>Show More</span>
        </p>

        <template v-if="showMoreAddressDetails">
          <label class="block">
            <span class="text-sm font-medium text-gray-700">Address</span>
            <textarea :value="modelValue.customer.address"
                      @input="updateCustomerField('address', $event.target.value)"
                      class="input mt-1"
                      rows="2"
                      placeholder="Customer address"></textarea>
          </label>

          <label class="block">
            <span class="text-sm font-medium text-gray-700">Phone</span>
            <input :value="modelValue.customer.phone"
                   @input="updateCustomerField('phone', $event.target.value)"
                   class="input mt-1"
                   placeholder="Phone number" />
          </label>
        </template>
      </div>
    </div>

    <!-- Invoice Details -->

    <div class="space-y-2 flex flex-col border-t">
      <div class="w-full flex flex-row justify-between">
        <p class="cursor-pointer text-start pt-4 w-full text-blue-400"
           @click="showSubject = !showSubject">
          <span v-if="showSubject">Collapse Section</span><span v-else>Show Section</span>
        </p>
      </div>
      <template v-if="showSubject">
        <label class="block">
          <span class="text-sm font-medium text-gray-700">Subject</span>
          <input :value="modelValue.subject"
                 @input="updateField('subject', $event.target.value)"
                 class="input mt-1"
                 placeholder="Invoice subject" />
        </label>
        <label class="block">
          <span class="text-sm font-medium text-gray-700">Invoice Number</span>
          <input :value="modelValue.invoiceNumber"
                 @input="updateField('invoiceNumber', $event.target.value)"
                 class="input mt-1"
                 placeholder="Invoice subject" />
        </label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-gray-700">Issue date</span>
            <div class="mt-1 relative">
              <input type="date"
                     :value="modelValue.date"
                     @input="updateField('date', $event.target.value)"
                     class="input" />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <i class="fas fa-calendar"></i>
              </span>
            </div>
          </label>
          <label class="block">
            <span class="text-sm font-medium text-gray-700">Due date</span>
            <div class="mt-1 relative">
              <input type="date"
                     :value="modelValue.dueDate"
                     @input="updateField('dueDate', $event.target.value)"
                     class="input" />
              <span class="absolute right-3 top-2.5 text-gray-400">
                <i class="fas fa-calendar"></i>
              </span>
            </div>
          </label>
          <SearchableCurrencyDropdown :modelValue="modelValue"
                                      @update:currency="updateCurrency"
                                      :currencyOptions="currencyOptionsVals" />

          <!-- <label class="block">
            <span class="text-sm font-medium text-gray-700">Currency</span>
            <select
              :value="modelValue.currency"
              @change="updateField('currency', $event.target.value)"
              class="input px-2 mt-1"
            >
              {{
                currencyOptionsVals
              }}
              <option
                :value="item?.code"
                v-for="item in currencyOptionsVals"
                :key="item.code"
              >
                {{ item?.label }}
              </option>
            </select>
          </label> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { currencyOptions } from "../../constants";
import SearchableCurrencyDropdown from "./SearchableCurrencyDropdown.vue";

const showMoreAddressDetails = ref(false);
const showSubject = ref(true);

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
// Method to update the currency field specifically
const updateCurrency = (currencyCode) => {
  emit("update:modelValue", { ...props.modelValue, currency: currencyCode });
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
