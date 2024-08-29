<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import type { DrawerProps } from 'element-plus'

const drawer = ref(true)
const direction = ref<DrawerProps['direction']>('ttb')
const store = useStore()
const router = useRouter()

// Watch for route changes and close the drawer
watch(
    () => router.currentRoute.value,
    () => {
      store.commit('SET_SHOW_MOBILE_MENU', false) // Make sure to define this mutation in your Vuex store
    }
)
</script>

<template>
  <el-drawer
      v-model="store.state.ShowMobileMenu"
      title="Menu"
      :direction="direction"
      size="90%"
  >
    <slot></slot>
  </el-drawer>
</template>

<style scoped>

</style>
