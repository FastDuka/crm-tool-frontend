<!-- Searchable Currency Dropdown using Vue Composition API -->
<template>
  <div class="relative" ref="dropdownRef">
    <label class="block">
      <span class="text-sm font-medium text-gray-700">Currency</span>
      <div class="relative mt-1">
        <!-- Selected currency display (dropdown trigger) -->
        <div
          @click="toggleDropdown"
          class="input px-2 py-2 flex items-center justify-between cursor-pointer"
        >
          <span>{{ selectedCurrency.label }}</span>
          <svg
            class="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <!-- Dropdown -->
        <div
          v-if="isOpen"
          class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <!-- Search input -->
          <div class="sticky top-0 bg-white p-2 border-b">
            <input
              :value="searchTerm"
              @input="searchTerm = $event.target.value"
              type="text"
              placeholder="Search currencies..."
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @click.stop
              ref="searchInput"
            />
          </div>

          <!-- Currency options -->
          <div class="py-1">
            <div
              v-for="currency in filteredCurrencies"
              :key="currency.code"
              @click="selectCurrency(currency)"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              :class="{ 'bg-gray-50': currency.code === selectedCurrency.code }"
            >
              <span class="mr-2 text-gray-500">{{ currency.code }}</span>
              <span>{{ currency.label }}</span>
            </div>
            <div
              v-if="filteredCurrencies.length === 0"
              class="px-4 py-2 text-gray-500"
            >
              No currencies found
            </div>
          </div>
        </div>
      </div>
    </label>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  currencyOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "update:currency"]);

// Reactive state
const isOpen = ref(false);
const searchTerm = ref("");
const selectedCurrency = ref({ code: "USD", label: "US Dollar" });
const dropdownRef = ref(null);
const searchInput = ref(null);

// Computed properties
const filteredCurrencies = computed(() => {
  return props.currencyOptions.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      currency.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;

  // If opening the dropdown, focus the search input after the DOM updates
  if (isOpen.value) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
};

const selectCurrency = (currency) => {
  selectedCurrency.value = currency;
  isOpen.value = false;

  // Emit the update:currency event for v-bind/v-on pattern
  emit("update:currency", currency.code);

  // Also emit the standard modelValue update for compatibility
  emit("update:modelValue", { ...props.modelValue, currency: currency.code });
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Set initial selected currency based on prop value
  const code = props.modelValue.currency;
  const found = props.currencyOptions.find((c) => c.code === code);
  if (found) {
    selectedCurrency.value = found;
  }

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Reset search term when dropdown closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchTerm.value = "";
  }
});

// Watch for external model changes
watch(
  () => props.modelValue.currency,
  (newValue) => {
    const found = props.currencyOptions.find((c) => c.code === newValue);
    if (found) {
      selectedCurrency.value = found;
    }
  }
);
</script>
