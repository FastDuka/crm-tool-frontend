<script setup lang="ts">

import {ref} from "vue";
import {Edit, Plus} from "@element-plus/icons-vue";
import {useStore} from "vuex";
import {baseUrl} from "@/utility/constants.js"

const accountObj = ref(
 [{
        name: 'School Name',
        email: 'Mavindini@gmail.com',
        account_identifier: '464478'
 }]
);

const orgarnizationObj = ref({
  organization_name: 'Mavindini Boys',
  email: 'Mavindini@gmail.com',
  phone: '1234567890',
  industry :{
    id:1,
    name:"School",
  }
})
const organizationLoader = ref(false)
const logoUrl = ref('https://api.fastduka.co.ke/api')

const accountLoader = ref(false);

const paymentDetailsObj = ref([
  {
    name: "M-pesa"
  }
]);
const paymentDetailsLoader = ref(false);
const store = useStore();

const getOrganisationDetails = ()=>{
  store.dispatch("fetchList", {url:'get-my-organization'})
      .then((res)=>{
        orgarnizationObj.value = res.data;
      })
}

const getAccountDetails = ()=>{
  store.dispatch("fetchList", {url:'account'})
      .then((res)=>{
        accountObj.value = res.data?.results;
      })
}

getAccountDetails()
getOrganisationDetails()
</script>

<template>
  <div class="theme-flex-col">
    <h2 class="primary-header">Profile</h2>

    <router-view/>

    <div class="w-full border rounded-lg theme-flex-col p-4">
      <div class="flex justify-between w-full">
        <h3 class="secondary-header primary-text">Organization Details</h3>

        <div class="theme-flex">
          <el-button circle size="large"  :icon="Edit"/>
        </div>

      </div>

      <div v-if="!organizationLoader" class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full">
        <div class="theme-flex-col w-full">
          <el-avatar :size="60" :src="logoUrl + orgarnizationObj?.logo">
            <img alt="err"
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            />
          </el-avatar>
        </div>

        <div class="theme-flex-col w-full">
          <label class="font-semibold">
            Name
          </label>
          <div>{{orgarnizationObj?.organization_name}}</div>
        </div>
        <div class="theme-flex-col w-full">
          <label class="font-semibold">
            Phone
          </label>
          <div>{{orgarnizationObj?.phone}}</div>
        </div>
        <div class="theme-flex-col w-full">
          <label class="font-semibold">
            Email
          </label>
          <div>{{orgarnizationObj?.email}}</div>
        </div>
        <div class="theme-flex-col w-full">
          <label class="font-semibold">
            Industry
          </label>
          <div>{{orgarnizationObj?.industry?.name}}</div>
        </div>
      </div>

    </div>

    <div class="w-full border rounded-lg theme-flex-col p-4">
      <div class="flex justify-between w-full">
        <h3 class="secondary-header primary-text">Account Details</h3>

        <div class="theme-flex">
          <el-button circle type="primary" size="large" :icon="Plus"/>

          <el-button circle size="large"  :icon="Edit"/>
        </div>

      </div>

      <div v-for="account in accountObj" :key="account.id"
          class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center w-full">
        <div class="theme-flex-col w-full" v-if="!accountLoader">
          <label class="font-semibold">
            Name
          </label>
          <div>{{account?.name}}</div>
        </div>
        <div class="theme-flex-col w-full" v-if="!accountLoader">
          <label class="font-semibold">
            Account ID
          </label>
          <div>{{account?.account_identifier}}</div>
        </div>
      </div>

    </div>

    <div class="w-full border rounded-lg theme-flex-col p-4">
      <div class="flex justify-between w-full">
        <h3 class="secondary-header primary-text">Payment Details</h3>

        <div class="theme-flex">
          <el-button circle type="primary" size="large" :icon="Plus"/>

          <el-button circle size="large"  :icon="Edit"/>
        </div>

      </div>

      <div v-for="paymentMethod in paymentDetailsObj" :key="paymentMethod.id"
          class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center w-full">
        <div class="theme-flex-col w-full">
          <label class="font-semibold">
            Name
          </label>
          <div>{{paymentMethod?.name}}</div>
        </div>
      </div>

    </div>


  </div>
</template>

<style scoped>

</style>