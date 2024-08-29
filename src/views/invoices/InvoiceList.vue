<script setup>
import BaseDataTable from "@/components/base/BaseDataTable.vue";
import { ref } from "vue";
import router from "@/router/index.js";
import {formatDate} from "@/utility/functions.js";

const columns = ref([
  { prop: "invoice_number", label: "Invoice Number", minWidth: "150" },
  { prop: "issue_date", label: "Issue Date", minWidth: "150" },
  { prop: "total_billed", label: "Total Billed", minWidth: "150" },
  { prop: "customer", label: "Customer Name", minWidth: "200" },
  { prop: "id", label: "Actions", minWidth: "200", key:"actions" },
]);

const goTo = (name, id) => {
  router.push({name: name, params: {id: id}});
};
</script>

<template>
  <router-view/>

  <h2 class="text-xl font-bold my-2">Invoices</h2>

  <BaseDataTable
      :columns="columns"
      fetch-url="invoice"
      create-route-name="invoice"
      title="Invoices"
  >
    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.prop === 'invoice_number'">
        {{slotProps.text}}
      </template>

      <template v-if="slotProps.column.prop === 'issue_date'">
        {{formatDate(slotProps.text)}}
      </template>

      <template v-if="slotProps.column.prop === 'customer'">
        {{slotProps.text?.name}}
      </template>

      <template v-if="slotProps.column.prop === 'total_billed'">
        {{slotProps.text}}
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <ElButton type="primary" link @click="goTo('invoice-view', slotProps.text)" size="default" plain>
          View

          <span class="w-2"></span>

          <el-icon>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </el-icon>
        </ElButton>

        <ElButton type="success" link @click="goTo('invoice-view', slotProps.text)" size="default" plain>
          Download

          <span class="w-2"></span>
          <el-icon >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </el-icon>
        </ElButton>

      </template>
    </template>
  </BaseDataTable>
</template>

<style scoped>

</style>
