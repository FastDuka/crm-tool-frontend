<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
      <h2 class="text-2xl font-bold capitalize">{{ invoiceData?.type }} Details</h2>
      <div class="flex md:w-[250px] rounded-md overflow-hidden border border-gray-300 mt-1">
        <button type="button"
                class="flex-1 py-2 px-4 text-center transition-all duration-200 focus:outline-none flex items-center justify-center"
                :class="[
                  invoiceData?.type === 'invoice'
                    ? 'bg-blue-500 text-white font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
                @click="updateInvoiceType('invoice')">
          <svg class="w-4 h-4 mr-2"
               fill="currentColor"
               viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clip-rule="evenodd"></path>
          </svg>
          Invoice
        </button>
        <button type="button"
                class="flex-1 py-2 px-4 text-center transition-all duration-200 focus:outline-none flex items-center justify-center"
                :class="[
                  invoiceData?.type === 'quotation'
                    ? 'bg-blue-500 text-white font-medium'
                    : 'bg-white text-gray-700 hover:bg-gray-50',
                ]"
                @click="updateInvoiceType('quotation')">
          <svg class="w-4 h-4 mr-2"
               fill="currentColor"
               viewBox="0 0 20 20"
               xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clip-rule="evenodd"></path>
          </svg>
          Quotation
        </button>
      </div>
    </div>

    <div class="flex gap-2 justify-between md:px-4 ">
      <CompanyLogo :modelValue="invoiceData.company.logo"
                   :invoiceTypeValue="invoiceData.type"
                   @update:modelValue="updateLogo" />
      <CompanyAddress @update:modelValue="updateInvoiceData"
                      :model-value="invoiceData"></CompanyAddress>
    </div>
    <div class="flex h-1 border-b px-4 mx-4"></div>

    <CustomerAddress @update:modelValue="updateInvoiceData"
                     :model-value="invoiceData"></CustomerAddress>
    <div class="flex h-1 border-b px-4 mx-4"></div>

    <!-- Global Tax Settings -->
    <div class="bg-gray-50 rounded-lg p-4 mx-4">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">Tax Settings</h3>
      <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
        <label class="flex items-center space-x-3">
          <input type="checkbox"
                 :checked="invoiceData.taxSettings?.noTax || false"
                 @change="updateTaxSettings('noTax', $event.target.checked)"
                 class="checkbox h-5 w-5" />
          <span class="text-sm font-medium text-gray-700">Tax-Free Invoice</span>
        </label>

        <div v-if="!invoiceData.taxSettings?.noTax"
             class="flex items-center gap-4">
          <label class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Default Tax Rate:</span>
            <select :value="invoiceData.taxSettings?.defaultRate || 16"
                    @change="updateTaxSettings('defaultRate', Number($event.target.value))"
                    class="input w-32">
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="16">16%</option>
              <option value="20">20%</option>
            </select>
          </label>

          <button @click="applyDefaultTaxToAll"
                  class="btn-outline text-xs px-3 py-1">
            Apply to All Items
          </button>
        </div>
      </div>

      <div v-if="invoiceData.taxSettings?.noTax"
           class="mt-2">
        <p class="text-sm text-amber-600 bg-amber-50 p-2 rounded border">
          <svg class="w-4 h-4 inline mr-1"
               fill="currentColor"
               viewBox="0 0 20 20">
            <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"></path>
          </svg>
          Tax-free mode is enabled. All items will have 0% tax applied.
        </p>
      </div>
    </div>

    <!-- Products Card -->
    <div class="md:py-0 md:px-4">
      <h3 class="text-xl font-semibold mb-4">Products</h3>
      <div class="space-y-4">
        <div v-for="(item, index) in invoiceData.items"
             :key="item.id">
          <div class="flex md:flex-row border px-4 py-4 rounded-md flex-col gap-2 md:items-center justify-between">
            <div class="md:w-[80%]">
              <label>Item
                <input :value="item.name"
                       @input="updateItem(index, 'name', $event.target.value)"
                       class="input"
                       placeholder="Item name" />
              </label>
            </div>
            <div class="flex flex-col md:grid md:grid-cols-3 gap-4">
              <label>Qty
                <input type="number"
                       :value="item.quantity"
                       @input="updateItem(index, 'quantity', Number($event.target.value))"
                       class="input"
                       placeholder="Qty" />
              </label>
              <label>Price
                <input type="number"
                       :value="item.price"
                       @input="updateItem(index, 'price', Number($event.target.value))"
                       class="input"
                       placeholder="Price" />
              </label>
              <label>
                <p>Tax %</p>
                <select :value="getItemTax(item)"
                        @change="updateItem(index, 'tax', Number($event.target.value))"
                        :disabled="invoiceData.taxSettings?.noTax"
                        class="input"
                        :class="{ 'bg-gray-100 cursor-not-allowed': invoiceData.taxSettings?.noTax }">
                  <option value="0">No Tax (0%)</option>
                  <option value="5">Reduced Rate (5%)</option>
                  <option value="10">Standard Rate (10%)</option>
                  <option value="16">VAT (16%)</option>
                  <option value="20">Higher Rate (20%)</option>
                </select>
              </label>
            </div>
            <div class="h-full flex ">
              <button class="flex flex-row gap-2 md:mt-5 text-sm w-fit cursor-pointer items-center py-2 px-2 rounded-md bg-red-200 text-red-800"
                      @click="removeItem(index)">
                <span class="md:hidden block">Remove Item</span>
                <TrashIcon class="h-4 w-4 transition hover:scale-110" />
              </button>
            </div>
          </div>
        </div>
        <button @click="addItem"
                class="btn-outline flex gap-2 w-fit">
          <span>Add New Item</span>
          <PlusIcon class="h-4 w-4 text-blue-600" />
        </button>
      </div>
    </div>

    <!-- Discount Card -->
    <div class="flex flex-col md:flex-row items-start gap-2 md:items-center md:py-4 md:p-6">
      <label class="flex items-center space-x-2">
        <input type="checkbox"
               :checked="invoiceData.discount.enabled"
               @change="updateDiscount('enabled', $event.target.checked)"
               class="checkbox" />
        <span>Add Discount </span>
      </label>
      <div v-if="invoiceData.discount.enabled"
           class="mt-4">
        <label class="flex items-center space-x-2">
          <input :value="invoiceData.discount.value"
                 style="width: 10% !important"
                 type="number"
                 class=" input"
                 @input="updateDiscount('value', $event.target.value)">
          <span>% Discount </span>
        </label>
      </div>
    </div>

    <div class="flex flex-row justify-between items-start gap-2 md:px-6">
      <label class="flex flex-col gap-2 items-start ">
        <span>Notes </span>
        <textarea :value="invoiceData.notes"
                  @input="updateInvoiceData('notes', $event.target.value)"
                  class="input" />
      </label>
      <label class="flex flex-col gap-2 items-start ">
        <span>Payment Terms </span>
        <textarea :value="invoiceData.paymentTerms"
                  @input="updateInvoiceData('paymentTerms', $event.target.value)"
                  class="input" />
      </label>
    </div>

    <!-- Bottom Actions -->
    <div class="flex md:flex-col flex-col items-start gap-2 md:px-6 justify-between">
      <span class="text-sm text-gray-500">Last saved: Today at 4:30 PM</span>
      <div class="space-x-4 flex flex-row w-full">
        <button class="btn-outline">Cancel</button>
        <button class="btn-primary">Send Invoice</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, TrashIcon } from "lucide-vue-next";
import { defineEmits, defineProps } from "vue";
import CompanyAddress from "./components/designer/CompanyAddress.vue";
import CompanyLogo from "./components/designer/CompanyLogo.vue";
import CustomerAddress from "./components/designer/CustomerAddress.vue";

const props = defineProps({
  designerHidden: {
    type: Boolean,
    default: false,
  },
  invoiceData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:invoiceData"]);

const updateLogo = (logoData) => {
  emit("update:invoiceData", {
    ...props.invoiceData,
    company: {
      ...props.invoiceData.company,
      logo: logoData,
    },
  });
};

const updateInvoiceType = (invoiceType) => {
  emit("update:invoiceData", {
    ...props.invoiceData,
    'type': invoiceType
  });
};

const updateInvoiceData = (field, value) => {
  emit("update:invoiceData", {
    ...props.invoiceData,
    [field]: value,
  });
};

const updateTaxSettings = (field, value) => {
  const updatedTaxSettings = {
    ...props.invoiceData.taxSettings,
    [field]: value,
  };

  let updatedInvoiceData = {
    ...props.invoiceData,
    taxSettings: updatedTaxSettings,
  };

  // If enabling noTax, set all items tax to 0
  if (field === 'noTax' && value) {
    updatedInvoiceData.items = props.invoiceData.items.map(item => ({
      ...item,
      tax: 0
    }));
  }

  emit("update:invoiceData", updatedInvoiceData);
};

const applyDefaultTaxToAll = () => {
  const defaultRate = props.invoiceData.taxSettings?.defaultRate || 16;
  const updatedItems = props.invoiceData.items.map(item => ({
    ...item,
    tax: defaultRate
  }));

  emit("update:invoiceData", {
    ...props.invoiceData,
    items: updatedItems,
  });
};

const getItemTax = (item) => {
  return props.invoiceData.taxSettings?.noTax ? 0 : (item.tax || 0);
};

const updateItem = (index, field, value) => {
  const updatedItems = [...props.invoiceData.items];

  // If tax-free mode is enabled, force tax to 0
  if (field === 'tax' && props.invoiceData.taxSettings?.noTax) {
    value = 0;
  }

  updatedItems[index] = {
    ...updatedItems[index],
    [field]: value,
  };

  emit("update:invoiceData", {
    ...props.invoiceData,
    items: updatedItems,
  });
};

const addItem = () => {
  const defaultTax = props.invoiceData.taxSettings?.noTax ? 0 : (props.invoiceData.taxSettings?.defaultRate || 16);

  const newItem = {
    id: Date.now(),
    name: "",
    price: 0,
    quantity: 1,
    tax: defaultTax,
  };

  emit("update:invoiceData", {
    ...props.invoiceData,
    items: [...props.invoiceData.items, newItem],
  });
};

const removeItem = (index) => {
  const updatedItems = props.invoiceData.items.filter((_, i) => i !== index);
  emit("update:invoiceData", {
    ...props.invoiceData,
    items: updatedItems,
  });
};

const updateDiscount = (field, value) => {
  emit("update:invoiceData", {
    ...props.invoiceData,
    discount: {
      ...props.invoiceData.discount,
      [field]: value,
    },
  });
};
</script>