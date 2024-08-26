<script setup>

import DisplayCard from "@/components/cards/DisplayCard.vue";
import {Money} from "@element-plus/icons-vue";
import TransactionList from "@/views/transactions/TransactionList.vue";
</script>

<template>
  <div class="h-fit theme-flex-wrap">
    <display-card card-color="blue" v-for="item in 4" :key="item.id" class="hidden">
      <template #icon>
        <money/>
      </template>
      <template #title>
        Balance
      </template>
      <template #text>
        4000
      </template>
    </display-card>
  </div>

  <TransactionList/>
</template>

<style scoped>

</style>