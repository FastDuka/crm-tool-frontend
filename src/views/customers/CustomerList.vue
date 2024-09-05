<script setup>
import BaseDataTable from "@/components/base/BaseDataTable.vue";
import {ref} from "vue";
import router from "@/router/index.js";
import {formatDate} from "@/utility/functions.js";

const columns = ref([
  {prop: "name", label: "Name", minWidth: "200"},
  {prop: "email", label: "Email", minWidth: "200"},
  {prop: "phone", label: "Phone", minWidth: "150"},
  {prop: "location", label: "Location", minWidth: "150"},
  {prop: "account_number", label: "Account Number", minWidth: "150"},
  {prop: "id", label: "Actions", minWidth: "200", key: "actions"},
]);

const goTo = (name, id) => {
  router.push({name: name, params: {id: id}});
};

const formatDateColumn = (dateString) => {
  return formatDate(dateString); // Assuming formatDate handles date formatting
};
</script>

<template>
  <router-view/>

  <h2 class="text-xl font-bold my-2">Customers</h2>

  <BaseDataTable
      :columns="columns"
      fetch-url="customer"
      create-route-name="customer"
      title="Customers"
  >
    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.prop === 'name'">
        {{ slotProps.text }}
      </template>

      <template v-if="slotProps.column.prop === 'email'">
        {{ slotProps.text }}
      </template>

      <template v-if="slotProps.column.prop === 'phone'">
        {{ slotProps.text }}
      </template>

      <template v-if="slotProps.column.prop === 'location'">
        {{ slotProps.text }}
      </template>

      <template v-if="slotProps.column.prop === 'account_number'">
        {{ slotProps.text }}
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <ElButton type="primary" link @click="goTo('customer-edit', slotProps.text)" size="default" plain>
          Edit
          <span class="w-2"></span>
          <el-icon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </el-icon>
        </ElButton>
      </template>
    </template>
  </BaseDataTable>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>
