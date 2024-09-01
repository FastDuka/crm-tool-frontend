<script setup>

import {DataAnalysis, HomeFilled, Setting, UserFilled} from "@element-plus/icons-vue";

const userType = JSON.parse(localStorage.getItem("authData"))?.user?.user_type;
const user = JSON.parse(localStorage.getItem("authData"))?.user;
// const branch = JSON.parse(localStorage.getItem("authData"))?.user?.branch;
const branch = user?.branch;
const branchUrl = 'branch-view'

</script>

<template>
  <el-menu-item
      index="school">
    <el-icon>
      <data-analysis/>
    </el-icon>
    <template #title>School Details</template>
  </el-menu-item>

  <el-sub-menu index="sub-2">
    <template #title>
      <el-icon>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      </el-icon>
      <span>Staff</span>
    </template>
    <el-menu-item-group title="Staff">
      <el-menu-item index="staff-list">
        <el-icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
        </el-icon>
        <template #title>List Staff</template>
      </el-menu-item>
      <el-menu-item index="create-staff">
        <el-icon>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </el-icon>
        <template #title>Create Staff</template>
      </el-menu-item>
    </el-menu-item-group>

  </el-sub-menu>

</template>

<style scoped>

</style>