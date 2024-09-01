<script lang="ts" setup>
import { computed } from 'vue'
import {useStore} from "vuex";
import TheMobileMenu from "@/components/TheMobileMenu.vue";
import SettingsLinks from "@/views/settings/components/SettingsLinks.vue";
import {useRouter} from "vue-router";

const store = useStore()
const router = useRouter()

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}

const authData = JSON.parse(localStorage.getItem("authData"));

const navigateToSelectedPage = (index)=>{
  let selectedParams;

  try {
    /**
     * Where data has been json parsed , then there a parameter is required
     */
    selectedParams = JSON.parse(index);
    router.push({name: selectedParams.name, params: {id: selectedParams.id}});
  } catch {
    router.push({name: index})
  }
}

const themeStyle = computed(() => {
  const lightMode = store.getters.getLightMode;
  return lightMode
      ? {
        '--background-color': '#545c64',
        '--text-color': '#fff',
        '--hover-background-color': '#666',
        '--active-background-color': '#666',
        '--active-text-color': '#ffd04b'
      }
      : {
        '--background-color': 'white',
        '--text-color': 'black',
        '--hover-background-color': '#f5f5f5',
        '--active-background-color': '#862727',
        '--active-text-color': '#ffd04b'
      };
});


</script>

<template>

  <div class="hidden md:flex flex-col gap-4 w-fit h-full border-r" >

    <!--
            v-if="authData?.user?.user_type === 'admin'"
    -->
    <el-menu
        default-active="1"
        :class="{'light-mode': store.getters.getLightMode, 'dark-mode': !store.getters.getLightMode}"
        class="el-menu-vertical-demo"
        style="border: none;"
        :active-text-color="store.getters.getLightMode ? 'blue' : '#ffd04b'"
        :active-background-color="store.getters.getLightMode ? 'red' : 'gray'"
        :text-color="store.getters.getLightMode ? 'black' : 'black'"
        :style="themeStyle"
        :collapse="store.state.sideNavCollapse"
        @open="handleOpen"
        @close="handleClose"
        @select="navigateToSelectedPage"
    >
      <SettingsLinks/>
    </el-menu>

  </div>

  <!--    MOBILE NAV -->
  <div class="sm:flex md:hidden">
    <TheMobileMenu :class="{'light-mode': store.getters.getLightMode, 'dark-mode': !store.getters.getLightMode}">
      <el-menu
          default-active="1"
          class="el-menu-vertical-demo "
          style="border: none; width: 100%"
          :collapse="!store.state.ShowSettingsMobileMenu"
          @open="handleOpen"
          @close="handleClose"
          @select="navigateToSelectedPage"
      >
        <SettingsLinks/>
      </el-menu>

    </TheMobileMenu>

  </div>
</template>

<style scoped>
.--el-menu-bg-color {
  background-color: #545c64;
}
.el-menu-vertical-demo .el-menu-item.is-active,
.el-menu-vertical-demo .el-submenu__title.is-active {
  background-color: var(--active-background-color);
}

/* Drop-down menu item active styles */
.el-menu-vertical-demo .el-submenu .el-menu-item.is-active {
  background-color: var(--active-background-color);
}

.el-menu-vertical-demo:not(.el-menu--collapse) .el-submenu .el-menu-item.is-active {
  background-color: var(--active-background-color);
}
</style>