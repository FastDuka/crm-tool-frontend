<template>
  <div :class="{ 'dark-mode': !$store.getters.getLightMode }">
    <base-loader v-if="loading"/>
    <div v-else class="flex flex-col w-full h-full bg-white p-2 rounded-lg">
      <el-table
          :data="dataSource.results"
          :style="{ width: '100%' }"
          :row-key="(record) => record?.id"
          :loading="loading"
          :scroll="{ x: 1000 }"
      >
        <template #default="{ row, column, $index }">
          <el-table-column
              v-for="col in columns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :min-width="col.minWidth"
          >
            <template #default="{ row }" v-if="!loading">
              <slot :column="col" :text="row[col.prop]" name="bodyCell"></slot>
            </template>
          </el-table-column>
        </template>
        <template #header>
          <!-- Header content here -->
        </template>
      </el-table>
      <!-- Pagination controls -->
      <div class="flex justify-end mt-4 pb-4 overflow-x-auto">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalRecords"
            layout="total, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script>
import store from "../../store";
import { ElTable, ElPagination } from "element-plus";
import {
  FilterFilled,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import { defineEmits, ref } from "vue";
import BaseLoader from "@/components/base/BaseLoader.vue";

export default {
  name: "BaseTable",
  components: {
    BaseLoader,
    PlusOutlined,
    ReloadOutlined,
    SettingOutlined,
    FilterOutlined,
    FilterFilled,
    ElTable,
    ElPagination
  },
  data() {
    return {
      dataSource: {
        results: [],
        count: 0
      },
      showFilters: false,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    createRouteName: {
      type: String,
      default: undefined,
    },
    fetchUrl: {
      type: String,
      default: "all-users",
    },
    showOtherItems: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: () => [
        {
          title: "Name",
          dataIndex: "firstName",
          sorter: true,
          width: "20%",
        },
        {
          title: "Email",
          dataIndex: "email",
        },
      ],
    },
  },
  methods: {
    emit() {
      return defineEmits(['trailingReload'])
    },
    queryData(url, page = this.currentPage, pageSize = this.pageSize) {
      this.loading = true;

      store
          .dispatch("fetchList", { url: `${url}\?page=${this.currentPage}&page_size=${this.pageSize}` })
          .then((resp) => {
            console.log('Data received:', resp.data);
            this.dataSource = resp.data;
            this.totalRecords = resp.data.count;
            this.loading = false;
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            this.loading = false;
          });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.queryData(this.fetchUrl, this.currentPage, this.pageSize);
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.queryData(this.fetchUrl, this.currentPage, this.pageSize);
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    refresh() {
      this.queryData(this.fetchUrl, this.currentPage, this.pageSize);
      this.trailingReload();
    },
    trailingReload() {
      this.$emit('trailingReload');
    }
  },
  watch: {
    fetchUrl(newVal) {
      this.queryData(newVal, this.currentPage, this.pageSize);
    }
  },
  mounted() {
    this.queryData(this.fetchUrl, this.currentPage, this.pageSize);
  },
};
</script>

<style scoped>
.dark-mode {
  background-color: #212121;
  color: white;
}

.dark-mode .custom-table {
  /* Add styles for the table in dark mode */
  /* Example: */
  background-color: #212121;
  color: white;
}

.dark-mode .custom-table th,
.dark-mode .custom-table td {
  /* Add styles for table headers and cells in dark mode */
  /* Example: */
  border-color: #fff;
}

.dark-mode .custom-table .ant-table-tbody > tr.ant-table-row:hover > td {
  /* Add styles for table row hover effect in dark mode */
  /* Example: */
  background-color: #444;
}
</style>
