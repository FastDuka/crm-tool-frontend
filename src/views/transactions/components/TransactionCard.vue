<script setup>
  import {formatDate} from "../../../utility/functions.js";

  const props = defineProps({
    transactionObj: {
      type: Object,
      required: true,
      default: {}
    }
  })

  const copyText = ()=> {
    // Create a temporary text area to hold the text
    const textArea = document.createElement("textarea");
    textArea.value = props?.transactionObj?.transaction_confirmation_number;
    document.body.appendChild(textArea);

    // Select the text
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text to the clipboard
    document.execCommand("copy");

    // Remove the temporary text area
    document.body.removeChild(textArea);

  }
</script>

<template>
  <div class="w-full flex flex-col gap-2 p-4 rounded-md bg-white hover:bg-gray-200 cursor-pointer">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="flex gap-2 items-center" v-if="transactionObj?.transaction_confirmation_number"
             >{{transactionObj?.transaction_confirmation_number}}
          <el-tooltip
              class="box-item"
              trigger="click"
              effect="dark"
              content="Text Copied"
              placement="top-start"
          >
            <span @click="copyText"
                class="bg-gray-200 rounded cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
              </svg>
            </span>
          </el-tooltip>
        </div>
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
            {{transactionObj?.receiving_account?.account_type_name}} :
          </div>
          <div class="font-bold">{{transactionObj?.receiving_account?.account_identifier}}</div>
        </div>
      </div>



    </div>

  </div>
</template>

<style scoped>

</style>