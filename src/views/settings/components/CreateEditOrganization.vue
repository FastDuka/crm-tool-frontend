<script lang="ts" setup>
import { reactive, ref } from "vue";
import {ElNotification, FormInstance, FormRules} from "element-plus";
import config from "@/utility/configs.json"
import {Lock, User} from "@element-plus/icons-vue";
import store from "@/store/index"
import router from "@/router/index"
import BaseDialog from "@/components/base/BaseDialog.vue";
const loading = ref(false);
const form = reactive({
});


// const store = useStore();
const loginLoading = ref(false);

const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  username:{
    required: true,
    trigger: "blur",
    message: "Please enter username",
  },
  password: {
    required: true,
    trigger: "blur",
    message: "Please enter password",
  }
});

const submitForm = async (formEl: FormInstance | undefined) => {
  loginLoading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      store
          .dispatch("postData", {
            url: "token",
            data: form
          })
          .then((resp) => {
            localStorage.setItem("authData", JSON.stringify(resp.data));
            // console.log(resp.data)
            loginLoading.value = false;

            /**
             * Redirect based on user type
             *
             */
            router.push({name: 'transaction'});

          })
          .catch((err)=>{
            loginLoading.value = false;
          })
      ;
    } else {
      loginLoading.value = false;
      ElNotification({
        title: 'Error',
        type: "error",
        position: "top-right",
        message: "Fill required fields"
      })
    }
    loading.value = false;
  });
};

</script>


<template>
  <base-dialog>
    <template #content>
      <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="rules"
          class="w-full flex flex-col gap-4"
          label-position="top"
      >
        <div class="flex gap-2 items-center">
          <h1 class="font-bold text-2xl primary-text">Register Organization</h1>
        </div>

        <el-form-item label="Name" prop="organization_name"
                      :rules="[
                {
                  required: true,
                  message: 'Please input organization name',
                  trigger: 'blur',
                },
             ]"
        >
          <el-input
              v-model="form.organization_name"
              :prefix-icon="User"
              placeholder="organization name"
              size="large"
          />
        </el-form-item>
        <el-form-item label="Phone" prop="phone"
                      :rules="[
                {
                  required: true,
                  message: 'Please input phone number',
                  trigger: 'blur',
                },
             ]"
        >
          <el-input
              v-model="form.phone"
              :prefix-icon="User"
              placeholder="phone number"
              size="large"
          />
        </el-form-item>
        <el-form-item label="Email" prop="email"
                      :rules="[
                {
                  required: true,
                  message: 'Please input email',
                  trigger: 'blur',
                },
             ]"
        >
          <el-input
              v-model="form.email"
              type="email"
              :prefix-icon="User"
              placeholder="email"
              size="large"
          />
        </el-form-item>

        <div class="flex w-full ">
          <el-button
              :loading="loginLoading"
              class="w-fit "
              size="large"
              style="border-radius: 4px"
              type="primary"
              @click="submitForm(ruleFormRef)"
          >
            <!--                @click="submitForm(loginFormRef)"-->

            Submit
          </el-button>
        </div>
        <div class="text-sm hidden">
          <span class="text-gray-400"> Don't have an Account ? </span>
          <router-link :to="{name:'register'}" class="text-blue-400 hover:text-blue-500 hover:font-bold"> Register </router-link>
        </div>

      </el-form>
    </template>
  </base-dialog>/
</template>


<style scoped></style>