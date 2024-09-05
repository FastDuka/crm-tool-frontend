<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {ElNotification, FormInstance, FormRules} from "element-plus";
import config from "@/utility/configs.json"
import {Lock, User} from "@element-plus/icons-vue";
import store from "@/store/index"
import router from "@/router/index"
import BaseDialog from "@/components/base/BaseDialog.vue";
import {useRoute} from "vue-router";
const loading = ref(false);
const form = reactive({
});

const organizations = ref([]);
const organizationsLoading = ref(false);
const getOrganizations =  () => {
  organizations.value = []
  organizationsLoading.value = true
  store.dispatch('fetchList', {url: 'organization'})
      .then((response)=>{
        response.data?.results?.map((item)=>{
          organizations.value.push({
            label: item.organization_name,
            value: item.id
          })
        })
        organizationsLoading.value = false
      })
      .catch((err)=>{organizationsLoading.value = false})
}

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

const route = useRoute();

const submitForm = async (formEl: FormInstance | undefined) => {
  loginLoading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (route?.name != "customer-edit"){
        store
            .dispatch("postData", {
              url: "customer",
              data: form
            })
            .then((resp) => {
              loginLoading.value = false;

            })
            .catch((err)=>{
              loginLoading.value = false;
            });
      }else {
        delete form.updated_at;
        store
            .dispatch("patchData", {
              id:route?.params?.id,
              url: "customer",
              data: form
            })
            .then((resp) => {
              loginLoading.value = false;

            })
            .catch((err)=>{
              loginLoading.value = false;
            });
      }

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

const fetchOnMount = ()=>{
  if (route?.name == "customer-edit"){
    store.dispatch('fetchSingleItem', {url:'customer', id:route?.params?.id})
        .then((response)=>{
          console.log('response',response);
          Object.assign(form, response?.data);
        })
  }
}

onMounted(()=>{
  fetchOnMount()
})

</script>


<template>
  <BaseDialog>
    <template #content>
      <el-form
          ref="ruleFormRef"
          :model="form"
          :rules="rules"
          class="w-full flex flex-col gap-4"
          label-position="top"
      >
        <div class="flex gap-2 items-center">
          <h1 class="font-bold text-2xl primary-text">Register Customer</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
          <el-form-item label="Name" prop="name"
                        :rules="[
            {
              required: true,
              message: 'Please input name',
              trigger: 'blur',
            },
         ]"
          >
            <el-input
                v-model="form.name"
                :prefix-icon="User"
                placeholder="name"
                size="large"
            />
          </el-form-item>
          <el-form-item label="Email" prop="email"
                        :rules="[
            {
              required: true,
              message: 'Please input a valid email',
              trigger: 'blur',
              type: 'email'
            },
         ]"
          >
            <el-input
                v-model="form.email"
                :prefix-icon="User"
                placeholder="email"
                size="large"
            />
          </el-form-item>
          <el-form-item label="Phone" prop="phone"
                        :rules="[
            {
              required: true,
              message: 'Please input phone',
              trigger: 'blur',
            },
         ]"
          >
            <el-input
                v-model="form.phone"
                :prefix-icon="User"
                placeholder="name"
                size="large"
            />
          </el-form-item>
          <el-form-item label="Location" prop="location"
                        :rules="[
            {
              required: true,
              message: 'Please input location',
              trigger: 'blur',
            },
         ]"
          >
            <el-input
                v-model="form.location"
                :prefix-icon="User"
                placeholder="location"
                size="large"
            />
          </el-form-item>
          <el-form-item label="Account Number" prop="account_number"
                        :rules="[
            {
              required: false,
              message: 'Please input account_number',
              trigger: 'blur',
            },
         ]"
          >
            <el-input
                v-model="form.account_number"
                :prefix-icon="User"
                placeholder="location"
                size="large"
            />
          </el-form-item>
<!--          <el-form-item label="Organization" prop="organization"-->
<!--                        :rules="[-->
<!--            {-->
<!--              required: true,-->
<!--              message: 'Please select an organization',-->
<!--              trigger: 'blur',-->
<!--            },-->
<!--         ]"-->
<!--          >-->
<!--            <el-select @focus="getOrganizations"-->
<!--                       v-model="form.organization" clearable placeholder="Select">-->
<!--              <el-option v-for="item in organizations" :key="item.value" :label="item.label" :value="item.value" />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
        </div>

        <!--            <el-input-->
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

      </el-form>
    </template>
  </BaseDialog>


</template>


<style scoped></style>