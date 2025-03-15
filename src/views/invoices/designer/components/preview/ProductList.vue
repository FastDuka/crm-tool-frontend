<template>
  <div>
    <table class="w-full mb-8">
      <thead>
        <tr class="border-b">
          <th class="text-left py-2 text-gray-500 font-medium">ITEM</th>
          <th class="text-right py-2 text-gray-500 font-medium w-32 md:block hidden">QTY</th>
          <th class="text-right py-2 text-gray-500 font-medium w-32">PRICE</th>
          <th class="text-right py-2 text-gray-500 font-medium w-32">TAX</th>
          <th class="text-right py-2 text-gray-500 font-medium w-40">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items"
            :key="item.id"
            class="border-b">
          <td class="py-4">
            <p class="font-medium flex gap-2">
              <span>{{ item.name }}</span><span class="md:hidden flex gap-1">x {{ item.quantity }} </span>
            </p>
          </td>
          <td class="py-4 text-right md:block hidden">{{ item.quantity }}</td>
          <td class="py-4 text-right">{{ formatCurrency(item.price) }}</td>
          <td class="py-4 text-right">{{ item.tax }}%</td>
          <td class="py-4 text-right">
            {{ formatCurrency(item.price * item.quantity) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
});

const formatCurrency = (number) => {
  return `${props.currency} ${number.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
</script>
