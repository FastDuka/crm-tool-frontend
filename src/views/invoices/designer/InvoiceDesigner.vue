<template>

  <div class="flex flex-col  gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Invoice Details</h2>

    </div>
    <div class="flex gap-2 justify-between md:px-4 ">
      <CompanyLogo :modelValue="invoiceData.company.logo"
                   @update:modelValue="updateLogo" />
      <CompanyAddress @update:modelValue="updateInvoiceData"
                      :model-value="invoiceData"></CompanyAddress>
    </div>
    <div class="flex h-1 border-b px-4 mx-4"></div>

    <CustomerAddress @update:modelValue="updateInvoiceData"
                     :model-value="invoiceData"></CustomerAddress>
    <div class="flex h-1 border-b px-4 mx-4"></div>
    <!-- Products Card -->
    <div class="md:py-0 md:px-4">
      <h3 class="text-xl font-semibold mb-4">Products</h3>
      <div class="space-y-4">
        <div v-for="(item, index) in invoiceData.items"
             :key="item.id">
          <div class="flex md:flex-row border px-4 py-4 rounded-md flex-col gap-2 md:items-center justify-between">
            <div class="md:w-[80%]">
              <label>Item<input :value="item.name"
                       @input="updateItem(index, 'name', $event.target.value)"
                       class="input"
                       placeholder="Item name" /></label>

            </div>
            <div class="flex flex-col md:grid md:grid-cols-3 gap-4">
              <label>Qty
                <input type="number"
                       :value="item.quantity"
                       @input="
                        updateItem(index, 'quantity', Number($event.target.value))
                        "
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
                <input type="number"
                       :value="16"
                       @change="updateItem(index, 'tax', Number($event.target.value))"
                       class=" input ">
                </input>
              </label>
            </div>
            <div class="h-full flex ">
              <button class="flex flex-row gap-2 md:mt-5 text-sm w-fit cursor-pointer  items-center py-2 px-2 rounded-md bg-red-200 text-red-800"
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
                 @input="updateDiscount('value', $event.target.value)"></input>
          <span>% Discount </span>
        </label>

      </div>
    </div>
    <div class="flex flex-row justify-between  items-start gap-2 md:px-6">
      <label class="flex flex-col gap-2 items-start ">
        <span>Notes </span>
        <textarea :value="invoiceData.notes"
                  @input="updateInvoiceData('notes', $event.target.checked)"
                  class="input" />
      </label>
      <label class="flex flex-col gap-2 items-start ">
        <span>Payment Terms </span>

        <textarea :value="invoiceData.paymentTerms"
                  @input="updateInvoiceData('paymentTerms', $event.target.checked)"
                  class="input" />
      </label>

    </div>
    <!-- Bottom Actions -->
    <div class="flex md:flex-col flex-col items-start gap-2  md:px-6 justify-between">
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
console.log("invoiceData", props.invoiceData)
const updateLogo = (logoData) => {
  emit("update:invoiceData", {
    ...props.invoiceData,
    company: {
      ...props.invoiceData.company,
      logo: logoData,
    },
  });
};

const updateInvoiceData = (newData) => {
  emit("update:invoiceData", newData);
};

const updateItem = (index, field, value) => {
  const updatedItems = [...props.invoiceData.items];
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
  const newItem = {
    id: Date.now(), // Simple way to generate unique ID
    name: "",
    price: 0,
    quantity: 1,
    tax: 0,
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
