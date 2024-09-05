<script setup lang="ts">
import store from "@/store/index.js";
import {useRoute, useRouter} from "vue-router";
import { onMounted, ref, watch } from "vue";
import { formatDate } from "@/utility/functions.js";
import {Delete, Plus, User} from "@element-plus/icons-vue";
import BaseDialog from "@/components/base/BaseDialog.vue";
import {ElNotification, FormInstance, FormRules} from "element-plus";


const route = useRoute();
const router = useRouter();
const productsArray = ref([
]);
const organisationDetails = ref({});
const customerDetails = ref({});
const totalBill = ref(0)

const invoiceDetails = ref({
  products: productsArray.value,
});


const getInvoices = () => {
  store.dispatch("fetchSingleItem", { url: "invoice", id: route.params.id }).then((res) => {
    productsArray.value = res?.data.products || [];
    organisationDetails.value = res?.data?.beneficiary;
    customerDetails.value = res?.data?.customer;
    invoiceDetails.value = res?.data;
  });
};

const addRow = () => {
  productsArray.value.push({
    name: "Test Product",
    quantity: 1,
    unit_price: 100,
    taxable_percentage: 16,
    net_total: 0,
    total_tax: 0,
    total: 0,
  });
};

const removeRow = (index) => {
  productsArray.value.splice(index, 1);
};

const calculateTotals = () => {
  totalBill.value = 0
  productsArray.value.forEach((item) => {
    item.net_total = item.quantity * item.unit_price;
    item.total_tax = item.net_total * (item.taxable_percentage / 100);
    item.total = item.net_total + item.total_tax;
    totalBill.value = totalBill.value + item.total
  });
  invoiceDetails.value.total_billed = totalBill.value
};

const customers = ref([]);

const getCustomers = () => {
  customers.value = []
  store.dispatch("fetchList", { url: "customer"}).then((res) => {
    res.data.results.map((item)=>{
      customers.value.push({
        label: item.name,
        value: item.id,
      })
    })
  })
};

// Watch for changes in tableData and update totals
watch(productsArray, calculateTotals, { deep: true });

// Watch for changes in tableData and trigger a PATCH request
watch(
    productsArray,
    (newData) => {
      const updatedInvoice = {
        products: newData,
        total_billed: newData.reduce((total, item) => total + item.total, 0),
        total_tax: newData.reduce((total, item) => total + item.total_tax, 0),
      };

      // store.dispatch('patchData', {'url': 'invoice', id: route.params.id, data: updatedInvoice});

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

const invoiceLoading = ref(false)
const ruleFormRef = ref<FormInstance>();

const submitForm = async (formEl: FormInstance | undefined) => {
  invoiceLoading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      store
          .dispatch("postData", {
            url: "invoice",
            data: invoiceDetails.value
          })
          .then((resp) => {
            invoiceLoading.value = false;
            useRouter().go(-1)

          })
          .catch((err)=>{
            invoiceLoading.value = false;
          });

    } else {
      invoiceLoading.value = false;
      ElNotification({
        title: 'Error',
        type: "error",
        position: "top-right",
        message: "Fill required fields"
      })
    }
    invoiceLoading.value = false;
  });
};


onMounted(() => {
  // getInvoices();
});
</script>



<template>
  <BaseDialog>
    <template #content>
        <!--    invoice details -->
      <el-form
          ref="ruleFormRef"
          :model="invoiceDetails"
          class="w-full flex flex-col gap-4"
          label-position="top">
        <div class="rounded-lg bg-gray-100 text-black flex flex-wrap gap-4 justify-between p-4 w-full">
          <!--  logo and email    -->
          <div
            class="w-full flex flex-col gap-4"
            >
            <div>
              <el-form-item
                  class="w-full md:w-[300px]"
                  label="Invoice Number"
                  prop="invoice_number"
                            :rules="[
                    {
                      required: false,
                      message: 'Please input invoice number',
                      trigger: 'blur',
                    },
                 ]"
              >
                <el-input
                    v-model="invoiceDetails.invoice_number"
                    :prefix-icon="User"
                    placeholder="invoice number"
                    size="large"
                />
              </el-form-item>
              <el-form-item
                  label="Account Number"
                  class="w-full md:w-[300px]"
                  prop="account_number"
                            :rules="[
                    {
                      required: true,
                      message: 'Please input account number',
                      trigger: 'blur',
                    },
                 ]"
              >
                <el-input
                    v-model="invoiceDetails.account_number"
                    :prefix-icon="User"
                    placeholder="account number"
                    size="large"
                />
              </el-form-item>
          </div>

          <div class="flex flex-col gap-4">
            <div class="text-lg font-bold">Billed To</div>
              <div class="flex gap-4 w-full justify-start items-center">
                <el-form-item label="Customer" prop="customer_id"
                              size="large"
                              class="w-full md:w-[300px]"
                              :rules="[
                        {
                          required: true,
                          message: 'Please select a customer',
                          trigger: 'blur',
                        },
                     ]"
                >
                  <el-select @focus="getCustomers"
                             v-model="invoiceDetails.customer_id" clearable placeholder="Select">
                    <el-option v-for="item in customers" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-button size="large" circle type="primary" @click="router.push({name: 'customer-create'})">
                  <Plus class="h-6 w-6"/>
                </el-button>
              </div>
          </div>
        </div>

        <!--    table-->
        <div class="flex flex-col gap-4 w-full">
          <h2 class="text-lg font-bold text-black">
            Item Details
          </h2>

          <div class="flex flex-col items-center gap-4 w-full">

            <el-table :data="productsArray" style="width: 100%">
              <el-table-column prop="name" label="Name" width="180">
                <template #default="{ row, $index }">
                  <span class="flex gap-4">
                     <el-button icon="Delete" circle type="danger"  @click="removeRow($index)"/>

                    <el-form-item>
                      <el-input v-model="row.name" placeholder="Enter name"  />
                    </el-form-item>
                  </span>

                </template>
              </el-table-column>
              <el-table-column prop="quantity" label="Quantity" width="180">
                <template #default="{ row }">
                  <el-form-item>
                    <el-input-number v-model="row.quantity" :min="0"  />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="unit_price" label="Unit Price" width="180">
                <template #default="{ row }">
                  <el-form-item>
                    <el-input-number v-model="row.unit_price" :min="0" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="taxable_percentage" label="Taxable Percentage" width="180">
                <template #default="{ row }">
                  <el-form-item>
                    <el-input-number v-model="row.taxable_percentage" :min="0" :max="100"  />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="net_total" label="Net Total" width="180">
                <template #default="{ row }">
                  <el-form-item>
                    <el-input-number v-model="row.net_total" :min="0"  />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="total_tax" label="Total Tax" width="180">
                <template #default="{ row }">
                  <el-form-item>
                    <el-input-number v-model="row.total_tax" :min="0"  />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="total" label="Total" min-width="160">
                <template #default="{ row }">
                  <el-form-item>
                    <el-input-number v-model="row.total" :min="0" />
                  </el-form-item>
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
              <h3>KES {{totalBill}}</h3>
            </div>
          </div>
          <div class="flex w-full justify-end p-2">
            <el-button size="large" :loading="invoiceLoading" type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
          </div>
        </div>


      </div>
      </el-form>
    </template>
  </BaseDialog>

</template>

<style scoped>

</style>