<template>
  <div class="theme-flex-col">

    <h2 class="secondary-header secondary-header">
      Transactions
    </h2>

    <el-table

        :scroll="{ x: 1000 }"
        :data="filterTableData" style="width: 100%; border-radius: 5px; ">
      <el-table-column prop="transaction_id" width="180">
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Transaction ID</h2>
            <el-input v-model="search" class="max-w-56"
                      clearable
                      placeholder="Type to search" />
          </div>

        </template>
      </el-table-column>

      <el-table-column width="180" prop="confirmation_number" >
        <template #header>
          <div class="theme-flex-col w-full">
            <h2>Confirmation Number</h2>
            <el-input v-model="search" class="max-w-56"
                      clearable
                      placeholder="Type to search" />
          </div>

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
      </el-table-column>

      <el-table-column width="180"   prop="date" >
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
import { computed, ref } from 'vue'
import {View} from "@element-plus/icons-vue";

interface User {
  date: string
  name: string
  address: string
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
    tableData.filter(
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

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>