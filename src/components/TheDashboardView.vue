<script setup>

import {ref} from "vue"
import TheSideNav from "@/components/TheSideNav.vue";
import {Expand, Fold, Umbrella, UserFilled} from "@element-plus/icons-vue";
import {useStore} from "vuex";
import {deleteLocalStorageInformation} from "@/utility/functions.js";
import {useRouter, useRoute} from "vue-router";
import config from "@/utility/configs.json"
const store = useStore()
const router = useRouter()
import {watch, computed} from "vue"

const breadcrumbStyle = computed(() => {
  return {
    'separator-color': store.getters.getLightMode ? '#ffd04b' : '#ffd04b'
    // Add any other breadcrumb styles here if needed
  };
});

const routerViewStyle = computed(() => {
  return {
    color: store.getters.getLightMode ? 'gray' : 'white',
    backgroundColor: store.getters.getLightMode ? 'gray-50' : 'gray',
  };
});

const logout = ()=>{
  deleteLocalStorageInformation()
  router.replace({name:'login'})
}
const authData = JSON.parse(localStorage.getItem("authData"));

const route = useRoute();
const breadcrumbs = ref([]);

const updateBreadcrumbs = () => {
  breadcrumbs.value = route.matched.map(route => ({
    path: route.path,
    label: route.meta.slug || route.name
  }));
};

watch(route, updateBreadcrumbs, { immediate: true });

</script>

<template>
  <div class="h-screen min-w-screen max-w-screen-md" style="max-width: 100vw">

    <div class=" flex flex-col h-full min-w-full items-center">
  <!--    h-[70px]-->
        <div class=" border-b w-full flex items-center justify-between gap-4 px-4">
          <div class="h-fit w-fit theme-flex">
            <div class=" h-[70px]  theme-flex secondary-header primary-text">
              {{config.appName}}
            </div>

            <div class="h-[70px] w-fit md:flex items-center  hidden">
              <el-button class="w-[40px] bg-amber-600"
                         @click="store.state.sideNavCollapse = !store.state.sideNavCollapse">
  <!--              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">-->
  <!--                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />-->
  <!--              </svg>-->
                <expand class="h-6" v-if="store.state.sideNavCollapse" />
                <fold class="h-6" v-else />
              </el-button>
            </div>
          </div>



          <div class=" theme-flex justify-end md:justify-between h-fit p-0">
            <el-breadcrumb :style="breadcrumbStyle" separator="/" class="hidden md:block">
              <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <span v-if="breadcrumb?.label === 'Dashboard' || breadcrumb?.label === 'dashboard'">Dashboard </span>
                <router-link v-else :to="breadcrumb.path">{{ breadcrumb.label }}</router-link>
              </el-breadcrumb-item>
            </el-breadcrumb>


            <el-popover
                placement="bottom"
                title="Profile"
                :width="200"
                trigger="click"
                content="this is content, this is content, this is content"
            >
              <template #reference>
                <!--            <div size="default" class="cursor-pointer font-extrabold flex gap-2 h-12 px-2  w-fit rounded text-white items-center justify-center"  >-->
                <!--              <span>{{authData?.user?.first_name[0]}}</span> <span>{{authData?.user?.last_name[0]}}</span>-->
                <!--            </div>-->
                <div class=" font-bold primary-bg rounded-full h-[3rem] w-[3rem] p-2 flex items-center justify-center cursor-pointer text-[#fc7c04]">
                  <div class="flex p-0 items-center w-full h-fit mt-2  text-center  text-white justify-center ">
                    {{authData?.user?.first_name[0]}} {{authData?.user?.last_name[0]}}
                  </div>

                </div>
              </template>

              <template #default>
                <div class="w-full border-t flex flex-col gap-2 py-2">
                  <div class="flex flex-col p-2 primary-bg capitalize items-center justify-center hover:primary-bg-hover cursor-pointer rounded-md">
                    <p class="w-full">
                      {{authData?.user?.first_name}} {{authData?.user?.last_name}}

                    </p>
                    <p class="w-full" >
                      {{authData?.user?.phone_country_code}}
                      {{authData?.user?.phone_local_number}}
                    </p>
                  </div>
                  <button
                      @click="logout"
                      class="w-full p-3 h-10 rounded-md flex items-center justify-center gap-2 hover:text-lg bg-red-500 text-white">
                    logout

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                  </button>
                </div>
              </template>
            </el-popover>
          </div>


          <div class="sm:flex items-center border-b md:hidden ">
            <el-button class="w-[40px] bg-amber-600" size="large"
                       @click="store.state.ShowMobileMenu = !store.state.ShowMobileMenu">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
              </svg>
            </el-button>
          </div>

        </div>
  <!--    end top nav-->

        <div class="flex flex-1 h-full w-full">
          <div class="hidden md:block z-50 overflow-y-scroll">
            <TheSideNav/>
          </div>

          <div class=" w-full  p-4 md:p-0 primary-bg overflow-x-hidden h-full ">
            <el-breadcrumb separator="/"
                           :style="breadcrumbStyle"
                           class="md:hidden" >
              <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <span v-if="breadcrumb?.label === 'Dashboard' || breadcrumb?.label === 'dashboard'">Dashboard </span>
                <router-link v-else :to="breadcrumb.path">{{ breadcrumb.label }}</router-link>
              </el-breadcrumb-item>
            </el-breadcrumb>

            <div class="pt-2 md:p-2 flex-grow flex-1 h-full w-full">
              <router-view :style="routerViewStyle"/>
            </div>

          </div>

        </div>
      </div>
    <TheSideNav v-if="store.state.ShowMobileMenu"/>

  </div>
</template>

<style scoped>

</style>