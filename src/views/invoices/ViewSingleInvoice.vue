<script setup>
import store from "@/store/index.js";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { formatDate } from "@/utility/functions.js";
import { Plus } from "@element-plus/icons-vue";
import BaseDialog from "@/components/base/BaseDialog.vue";

const route = useRoute();
const tableData = ref([]);
const organisationDetails = ref({});
const customerDetails = ref({});
const invoiceDetails = ref({});

const getInvoices = () => {
  store.dispatch("fetchSingleItem", { url: "invoice", id: route.params.id }).then((res) => {
    tableData.value = res?.data.products || [];
    organisationDetails.value = res?.data?.beneficiary;
    customerDetails.value = res?.data?.customer;
    invoiceDetails.value = res?.data;
  });
};

const addRow = () => {
  tableData.value.push({
    name: "",
    quantity: 0,
    unit_price: 0,
    taxable_percentage: 0.16,
    net_total: 0,
    total_tax: 0,
    total: 0,
  });
};

const removeRow = (index) => {
  tableData.value.splice(index, 1);
};

const calculateTotals = () => {
  tableData.value.forEach((item) => {
    item.net_total = item.quantity * item.unit_price;
    item.total_tax = item.unit_price * (item.taxable_percentage / 100);
    item.total = item.unit_price + item.total_tax;
  });
};

// Watch for changes in tableData and update totals
watch(tableData, calculateTotals, { deep: true });

// Watch for changes in tableData and trigger a PATCH request
watch(
    tableData,
    (newData) => {
      const updatedInvoice = {
        products: newData,
        total_billed: newData.reduce((total, item) => total + item.total, 0),
        total_tax: newData.reduce((total, item) => total + item.total_tax, 0),
      };

      store.dispatch('patchData', {'url': 'invoice', id: route.params.id, data: updatedInvoice});

      // axios
      //     .patch(`${process.env.VUE_APP_API_URL}/invoice/${route.params.id}/`, route.params.id)
      //     .then((response) => {
      //       console.log("Invoice updated successfully:", response.data);
      //     })
      //     .catch((error) => {
      //       console.error("Error updating invoice:", error);
      //     });
    },
    { deep: true }
);

onMounted(() => {
  getInvoices();
});
</script>



<template>
  <BaseDialog>
    <template #content>
      <div class="flex flex-col gap-4 p-2 justify-start items-start bg-white overflow-x-auto h-full">
        <!--    organization details -->
        <div class="rounded-xl bg-gray-900 text-white flex flex-wrap gap-4 justify-between p-4 w-full">
          <!--  logo and email    -->
          <div class="flex flex-wrap gap-4 py-2 w-full md:w-fit">
            <el-avatar size="large" :src="organisationDetails?.logo"
            >Fast</el-avatar>

            <div class="font-bold text-lg w-fit">{{organisationDetails?.organization_name}}</div>

          </div>

          <div class="flex flex-col gap-4">
            <div>{{organisationDetails?.email}}</div>
            <div>{{organisationDetails?.phone}}</div>
          </div>
        </div>

        <!--    invoice details -->
        <div class="rounded-lg bg-gray-100 text-black flex flex-wrap gap-4 justify-between p-4 w-full">
          <!--  logo and email    -->
          <div class="flex flex-col gap-4">
            <div class="text-lg font-bold">Invoice Number</div>
            <div>{{invoiceDetails?.invoice_number}}</div>
            <div>{{invoiceDetails?.account_number}}</div>
            <div>{{formatDate(invoiceDetails?.issue_date)}}</div>
            <div>due date</div>
          </div>

          <div class="flex flex-col gap-4">
            <div class="text-lg font-bold">Billed To</div>
            <div>{{customerDetails?.name}}</div>
            <div>{{customerDetails?.email}}</div>
            <div>{{customerDetails?.phone}}</div>
          </div>
        </div>

        <!--    table-->
        <div class="flex flex-col gap-4 w-full">
          <h2 class="text-lg font-bold text-black">
            Item Details
          </h2>

          <div class="flex flex-col items-center gap-4 w-full">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="name" label="Name" width="180">
                <template #default="{ row }">
                  <el-input v-model="row.name" placeholder="Enter name"  />
                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="Quantity" width="180">
                <template #default="{ row }">
                  <el-input-number v-model="row.quantity" :min="0"  />
                </template>
              </el-table-column>
              <el-table-column prop="unit_price" label="Unit Price" width="180">
                <template #default="{ row }">
                  <el-input-number v-model="row.unit_price" :min="0" />
                </template>
              </el-table-column>
              <el-table-column prop="taxable_percentage" label="Taxable Percentage" width="180">
                <template #default="{ row }">
                  <el-input-number v-model="row.taxable_percentage" :min="0" :max="100"  />
                </template>
              </el-table-column>
              <el-table-column prop="net_total" label="Net Total" width="180">
                <template #default="{ row }">
                  <el-input-number v-model="row.net_total" :min="0"  />
                </template>
              </el-table-column>
              <el-table-column prop="total_tax" label="Total Tax" width="180">
                <template #default="{ row }">
                  <el-input-number v-model="row.total_tax" :min="0"  />
                </template>
              </el-table-column>
              <el-table-column prop="total" label="Total" min-width="160">
                <template #default="{ row }">
                  <el-input-number v-model="row.total" :min="0" />
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="Operations" min-width="100">
                <template #default="{ $index }">
                  <el-button link type="primary" size="small" @click="removeRow($index)">Delete</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="w-full flex px-2 ">
              <el-button size="large" circle type="primary" @click="addRow">
                <Plus class="h-6 w-6"/>
              </el-button>
            </div>

          </div>
        </div>

        <div class="flex flex-col gap-4  w-full">
          <div class="flex font-bold w-full justify-end p-2">
            <div class="flex w-fit gap-4 items-center">
              <h3>Total Billed</h3>
              <h3>KES {{invoiceDetails?.total_billed}}</h3>
            </div>
          </div>
          <div class="flex w-full justify-end p-2">
            <div class="flex w-fit gap-4 items-center">
              <h3>Tax</h3>
              <h3>{{invoiceDetails?.total_tax}}</h3>
            </div>
          </div>
          <div class="flex w-full justify-end p-2">
            <div class="flex w-fit gap-4 items-center border-t text-lg font-bold text-black pt-2">
              <h3>Total Paid</h3>
              <h3>KES
                {{ invoiceDetails?.payment_information && Array.isArray(invoiceDetails.payment_information)
                    ? invoiceDetails.payment_information.reduce((total, item) => total + Number(item.amount || 0), 0)
                    : 0
                }}
              </h3>
            </div>
          </div>
        </div>


      </div>
    </template>
  </BaseDialog>

</template>

<style scoped>

</style>