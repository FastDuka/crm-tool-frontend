<template>
  <div class="theme-flex-col">

    <h2 class="secondary-header secondary-header">
      Transactions
    </h2>

    <el-table

        :scroll="{ x: 1000 }"
        :data="filterTableData" style="width: 100%; border-radius: 5px; ">
<!--      <el-table-column prop="transaction_id" width="180">-->
<!--        <template #header>-->
<!--          <div class="theme-flex-col w-full">-->
<!--            <h2>Transaction ID</h2>-->
<!--            <el-input v-model="search" class="max-w-56"-->
<!--                      clearable-->
<!--                      placeholder="Type to search" />-->
<!--          </div>-->

<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column width="200" prop="confirmation_number" >
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Confirmation Number</h2>
            <el-input v-model="search" class="max-w-56"
                      clearable
                      placeholder="Type to search" />
          </div>

        </template>
        <template #default="scope">
          <span v-if="scope.row.transaction_confirmation_number">
            {{scope.row.transaction_confirmation_number}}
            {{scope.row.transaction_status}}
          </span>
          <span v-else>Null</span>
        </template>
      </el-table-column>

      <el-table-column width="180" prop="amount" >
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Amount</h2>
            <el-input v-model="search" class="max-w-56"
                      clearable
                      placeholder="Type to search" />
          </div>

        </template>
      </el-table-column>

      <el-table-column width="180" prop="status" >
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Status</h2>
            <el-select v-model="value" placeholder="Select">
              <el-option
                  v-for="item in payment_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>

        </template>
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.transaction_status === 'processed'">
            {{scope.row.transaction_status}}
          </el-tag>
          <el-tag type="warning" v-if="scope.row.transaction_status === 'pending'">
            {{scope.row.transaction_status}}
          </el-tag>
          <el-tag type="danger" v-if="scope.row.transaction_status === 'failed'">
            {{scope.row.transaction_status}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180" prop="payment_method" >
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Payment Method</h2>
            <el-select v-model="value" placeholder="Select">
              <el-option
                  v-for="item in payment_status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </div>

        </template>
        <template #default="scope">
          <span class="capitalize">
            {{scope.row.payment_method?.name}}
          </span>

        </template>
      </el-table-column>

      <el-table-column min-width="180"   prop="date" >
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Date</h2>
            <el-date-picker
                v-model="value2"
                type="datetimerange"
                placeholder="Select date"
                style="width: 100%"
                class="w-fit"
                format="YYYY-MM-DD HH:mm:ss"
                date-format="YYYY/MM/DD ddd"
                time-format="A hh:mm:ss"
            />
          </div>

        </template>
        <template #default="scope">
          {{formatDate(scope.row?.created_at)}}
        </template>
      </el-table-column>

      <el-table-column align="right" width="100" fixed="right">
        <template #header>
          Actions
          <div class="theme-space-large"></div>
        </template>
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">
            View
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {View} from "@element-plus/icons-vue";
import {useStore} from "vuex";
import { format, parseISO } from 'date-fns'

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

interface User {
  date: string
  name: string
  address: string
}

const store = useStore()

const getTransactions = ()=>{
  store.dispatch('fetchList', {url: "transaction"})
      .then(res=>{
        console.log(res?.data?.results)
        tableData.value = res?.data?.results
      })
}

const payment_status = ref([
    {
      label: 'Processed',
      value: 'processed'
    },
  {
      label: 'Failed',
      value: 'failed'
    },

])

const search = ref('')
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const tableData = ref([])

onMounted(()=>{
  getTransactions()
})
</script>