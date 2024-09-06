<template>
  <div class="flex flex-col gap-4 h-full py-4">

    <h2 class="secondary-header">
      Transactions
    </h2>

    <div class="md:hidden flex flex-col gap-4 w-full pr-2 h-full pb-4">

      <div class="">
        <el-button link class="my-2" @click="visible = true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
        </el-button>

        <el-dialog v-model="visible"
                   :show-close="true"
                    :before-close="handleClose"
                    style="border-radius: 5px; max-width: 90%; min-width: 50%">
          <div
              class="flex flex-col gap-4"
          >

            <h3 class="font-bold">Filters</h3>

            <el-input
                v-model="confirmationNumber"
                class="w-full"
                clearable
                placeholder="confirmation number"
            />

            <el-select v-model="selectedStatus" clearable placeholder="Transaction Status">
              <el-option v-for="item in payment_status" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

            <el-input v-model="amount" class="w-full" clearable placeholder="Amount" />

            <el-select clearable
                       v-model="selectedAccount"
                       :loading="accountsLoading"
                       @focus="getAccounts" placeholder="Receiving Account">
              <el-option
                  v-for="method in accountList"
                  :key="method.value"
                  :label="method.label"
                  :value="method.value"
              />
            </el-select>

            <el-date-picker
                clearable
                v-model="dateRange"
                type="daterange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                placeholder="Select date"
                style="width: 100%"
                format="YYYY-MM-DD"
                date-format="YYYY/MM/DD ddd"
            />
          </div>

        </el-dialog>
      </div>

      <div
          class="max-w-full pb-8 overflow-x-auto overflow-y-hidden md:hidden h-fit"
      >
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalTransactions"
        />
      </div>

      <div class="flex flex-grow flex-1 flex-col gap-2 pr-2 overflow-y-scroll">
        <TransactionCard
            v-for="transaction in tableData"
            :key="transaction.id"
            :transaction-obj="transaction"/>
      </div>

    </div>

    <el-table
        :data="tableData"
        class="hidden md:block"
        style="width: 100%; border-radius: 5px;"
        :pagination="false"
    >
      <el-table-column width="200" prop="confirmation_number">
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Confirmation Number</h2>
            <el-input
                v-model="confirmationNumber"
                class="max-w-56"
                clearable
                placeholder="Type to search" />
          </div>
        </template>
        <template #default="scope">
          <span v-if="scope.row.transaction_confirmation_number">
            {{ scope.row.transaction_confirmation_number }} {{ scope.row.transaction_status }}
          </span>
          <span v-else>Null</span>
        </template>
      </el-table-column>

      <el-table-column width="180" prop="amount">
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Amount</h2>
            <el-input v-model="amount" class="max-w-56" clearable placeholder="Type to search" />
          </div>
        </template>
      </el-table-column>

      <el-table-column width="180" prop="status">
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Status</h2>
            <el-select v-model="selectedStatus" clearable placeholder="Select">
              <el-option v-for="item in payment_status" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </template>
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.transaction_status === 'processed'">
            {{ scope.row.transaction_status }}
          </el-tag>
          <el-tag type="warning" v-if="scope.row.transaction_status === 'pending'">
            {{ scope.row.transaction_status }}
          </el-tag>
          <el-tag type="danger" v-if="scope.row.transaction_status === 'failed'">
            {{ scope.row.transaction_status }}
          </el-tag>
          <el-tag type="primary" v-if="scope.row.transaction_status === 'initiated'">
            {{ scope.row.transaction_status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180" prop="payment_method">
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Payment Method</h2>
            <el-select clearable
                v-model="selectedMethod"
                       :loading="paymentMethodsLoading"
                       @focus="getPaymentMethods" placeholder="Select">
              <el-option
                  v-for="method in paymentMethods"
                  :key="method.value"
                  :label="method.label"
                  :value="method.value"
              />
            </el-select>
          </div>
        </template>
        <template #default="scope">
          <span class="capitalize">{{ scope.row.payment_method?.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180" prop="receiving_account">
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Receiving Account</h2>
            <el-select clearable
                v-model="selectedAccount"
                       :loading="accountsLoading"
                       @focus="getAccounts" placeholder="Select">
              <el-option
                  v-for="method in accountList"
                  :key="method.value"
                  :label="method.label"
                  :value="method.value"
              />
            </el-select>

          </div>
        </template>
        <template #default="scope">
          <div class="flex flex-wrap gap-2 items-center">
            <span class="capitalize pr-2" v-if="scope.row?.receiving_account?.name">
              {{ scope.row?.receiving_account?.name }}
            </span>
            <span class="pl-2 text-light text-blue-400">{{ scope.row?.receiving_account?.account_identifier }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="180" prop="date">
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Date</h2>
            <el-date-picker
                clearable
                v-model="dateRange"
                type="datetimerange"
                placeholder="Select date"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="YYYY/MM/DD ddd"
                time-format="A hh:mm:ss"
            />
          </div>
        </template>
        <template #default="scope">
          {{ formatDate(scope.row?.created_at) }}
        </template>
      </el-table-column>

      <el-table-column align="right" min-width="200">
        <template #header>
          <span class="w-full ring-1">Actions</span>
        </template>
        <template #default="scope">
          <el-button link size="small" type="primary">
            Invoice
            <span class="pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </span>
          </el-button>
          <el-button link size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">
            View
            <span class="pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div
        class="max-w-full pb-4 overflow-x-auto hidden md:block"
    >
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalTransactions"
      />
    </div>

  </div>
</template>

<script lang="ts" setup>
import { watch, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { format, parseISO } from 'date-fns'
import { debounce } from 'lodash';
import TransactionsMobileView from "@/views/transactions/components/TransactionsMobileView.vue";
import TransactionCard from "@/views/transactions/components/TransactionCard.vue";
import {ElDialog} from "element-plus";

// Debounce getTransactions to avoid making too many requests
const debouncedGetTransactions = debounce((page, size, query) => {
  getTransactions(page, size, query);
}, 300); // Adjust the delay as needed


const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    const date = parseISO(dateString)
    return format(date, 'MMM d, yyyy h:mm a')
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString // Return original string if parsing fails
  }
}


const store = useStore()

// const getTransactions = (page = 1, size = 10, url="transaction") => {
//   store
//       .dispatch('fetchList', { url: `${url}\?page=${page}&&page_size=${size}`, page, size })
//       .then((res) => {
//         console.log(res?.data?.results)
//         tableData.value = res?.data?.results
//         totalTransactions.value = res?.data?.total || 0
//       })
// }
const getTransactions = (
    page: number = 1,
    size: number = 5,
    transaction_confirmation_number: string = '',
    transaction_status: string = '',
    amount: number | null = null,
    payment_method: string = '',
    start_date: string = '',
    end_date: string = '',
    receiving_account: string = ''
) => {
  const queryParams = new URLSearchParams()

  if (transaction_confirmation_number) queryParams.append('transaction_confirmation_number', transaction_confirmation_number)
  if (transaction_status) queryParams.append('transaction_status', transaction_status)
  if (amount !== null) queryParams.append('amount', amount.toString())
  if (payment_method) queryParams.append('payment_method', payment_method)
  if (start_date) queryParams.append('start_date', start_date)
  if (end_date) queryParams.append('end_date', end_date)
  if (receiving_account) queryParams.append('receiving_account', receiving_account)

  store
      .dispatch('fetchList', { url: `transaction?page=${page}&page_size=${size}&${queryParams.toString()}` })
      .then((res) => {
        tableData.value = res?.data?.results
        totalTransactions.value = res?.data?.count || 0
      })
}


const payment_status = ref([
  {
    label: 'Processed',
    value: 'processed',
  },
  {
    label: 'Failed',
    value: 'failed',
  },
  {
    label: 'Initiated',
    value: 'initiated',
  },
])

const paymentMethods = ref([])

const paymentMethodsLoading = ref(false)

const getPaymentMethods = ()=>{
  paymentMethodsLoading.value = true

  if (paymentMethods.value?.length > 0){
    paymentMethodsLoading.value = false

    return
  }

  store.dispatch('fetchList', {url:'payment_method'})
      .then((res)=>{
        res?.data?.results?.map((item)=>{
          paymentMethods.value.push({
            label: item.name,
            value: item.name
          })
        })
        paymentMethodsLoading.value = false
      })
      .catch((err)=>{
        paymentMethodsLoading.value = false
      })
}

const accountsLoading = ref(false)
const accountList = ref([])

const getAccounts = ()=>{
  accountsLoading.value = true

  if (accountList.value?.length > 0){
    accountsLoading.value = false
    return
  }
  store.dispatch('fetchList', {url:'account'})
      .then((res)=>{
        res?.data?.results?.map((item)=>{
          accountList.value.push({
            label: `${item?.name} ${item?.account_identifier}`,
            value: item?.id
          })
        })
        accountsLoading.value = false
      })
      .catch((err)=>{
        accountsLoading.value = false
      })
}

const search = ref('')
const selectedStatus = ref('')
const amount = ref(null)
const selectedMethod = ref('')
const selectedAccount = ref('')
const dateRange = ref(null)
const confirmationNumber = ref(null)
const visible = ref(false)
const handleClose = ()=>{
  visible.value = false
}

const applyFilters = debounce(() => {
  const filters = {
    transaction_confirmation_number: confirmationNumber.value || '',
    transaction_status: selectedStatus.value || '',
    amount: amount.value || null,
    payment_method: selectedMethod.value || '',
    start_date: dateRange.value?.[0] || '',
    end_date: dateRange.value?.[1] || '',
    receiving_account: selectedAccount.value || '',
  }

  getTransactions(
      currentPage.value,
      pageSize.value,
      filters.transaction_confirmation_number,
      filters.transaction_status,
      filters.amount,
      filters.payment_method,
      filters.start_date,
      filters.end_date,
      filters.receiving_account,
  )
}, 300)


watch([search, selectedStatus, amount, selectedMethod, dateRange,confirmationNumber, selectedAccount], applyFilters)

const tableData = ref([])
const totalTransactions = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)

const handleSizeChange = (size) => {
  pageSize.value = size;
  debouncedGetTransactions(currentPage.value, pageSize.value);
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  debouncedGetTransactions(currentPage.value, pageSize.value);
};


const handleEdit = (index, row) => {
  // Implement your edit functionality here
  console.log('Editing row:', row)
}

onMounted(() => {
  getTransactions()
})


</script>

<style scoped>
.secondary-header {
  font-weight: bold;
  color: var(--color-secondary);
}

.theme-flex-col {
  display: flex;
  flex-direction: column;
}

.el-table {
  width: 100%;
  border-radius: 5px;
}

.el-table-column {
  padding: 12px;
}

.el-button {
  padding: 0;
}

.size-4 {
  width: 1rem;
  height: 1rem;
}
</style>
