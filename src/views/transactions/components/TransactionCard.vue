<script setup>
  import {formatDate} from "../../../utility/functions.js";

  const props = defineProps({
    transactionObj: {
      type: Object,
      required: true,
      default: {}
    }
  })
</script>

<template>
  <div class="w-full flex flex-col gap-4 p-4 rounded-md bg-white hover:bg-gray-200 cursor-pointer">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div v-if="transactionObj?.transaction_confirmation_number"
             class="">{{transactionObj?.transaction_confirmation_number}}</div>
        <div v-else>Null</div>

        <div class="font-light text-gray-500 text-sm">
          {{formatDate(transactionObj?.created_at)}}
        </div>
      </div>


      <div class="font-bold">{{transactionObj?.amount}}</div>

    </div>

    <div class="flex items-center justify-between gap-4">

      <div class="flex items-center gap-4">
        <div>
        <span class="text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </span>
        </div>

        <div class="flex items-center gap-4">
          <div>
            Act :
          </div>
          <div class="font-bold">{{transactionObj?.receiving_account?.account_identifier}}</div>
        </div>
      </div>


      <div>{{transactionObj?.receiving_account?.account_type_name}}</div>

    </div>

  </div>
</template>

<style scoped>

</style>