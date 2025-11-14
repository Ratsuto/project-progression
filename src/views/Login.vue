<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useToast} from "primevue/usetoast";
const axios = getCurrentInstance().appContext.config.globalProperties.$axios;
const apiUrl = import.meta.env.VITE_API_URL;

const toast = useToast();
const router = useRouter();
const username = ref('');
const password = ref('');

const operatorName = ref('');
const operatorID = ref('');
const operatorPass = ref('');
const operatorPassConfirm = ref('');
const operatorEmail = ref('');
const operatorImage = ref(null);
const src = ref(null);
let visible = ref(false);
const isRegClick = ref(false);
const roles = ref([]);
const operatorRole = ref();

const handleLogin = async () => {
  try {
    const resp = await axios.post(`${apiUrl}/auth/login`, {
      username: username.value,
      password: password.value
    });

    if (resp.data.success) {
      toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000});
      localStorage.setItem('token', resp.data.token); // store token
      localStorage.setItem('operatorId', username.value);
      await router.push('/Home');
    } else {
      toast.add({severity: 'error', summary: 'Failed', detail: resp.data.message, life: 3000});
    }
  } catch (e) {
    toast.add({severity: 'error', summary: 'Network error', detail: 'Is backend running?', life: 3000});
  }
}

onMounted(async () => {
  const res = await axios.post(`${apiUrl}/users/get-role-detail`);
  if (res.data.success) {
    roles.value = res.data.operator;
  }
});

function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();
  operatorImage.value = file;

  reader.onload = async (e) => {
    src.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

const registerUser = async () => {
  const formData = new FormData();
  formData.append('operatorId', operatorID.value);
  formData.append('operatorName', operatorName.value);
  formData.append('operatorPass', operatorPass.value);
  formData.append('operatorEmail', operatorEmail.value);
  formData.append('roleId', operatorRole.value);
  formData.append('operatorImage', operatorImage.value);

  if (operatorID.value === '') {
    return toast.add({severity: 'warn', summary: 'Warning', detail: 'Please enter user ID', life: 3000});
  }

  if (operatorPass.value === '' || operatorPassConfirm.value === '') {
    return toast.add({severity: 'warn', summary: 'Warning', detail: 'Please enter the password', life: 3000});
  }

  if (operatorPass.value.toString().length < 12) {
    return toast.add({severity: 'warn', summary: 'Warning', detail: 'Password must be 12 digit or more', life: 3000});
  }

  if (operatorPass.value !== operatorPassConfirm.value) {
    return toast.add({severity: 'warn', summary: 'Warning', detail: 'Confirm password not match', life: 3000});
  }

  isRegClick.value = true;
  try {
    const resp = await axios.post(`${apiUrl}/auth/register`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

    if (resp.data.success) {
      toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000},);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      isRegClick.value = false;
      toast.add({severity: 'error', summary: 'Failed', detail: resp.data.message, life: 3000});
    }
  } catch (e) {
    isRegClick.value = false;
    toast.add({severity: 'error', summary: 'Error', detail: 'Is backend running/Exception?', life: 3000});
  }
}
</script>

<template>
  <Toast position="top-center"/>
  <div class="flex items-center justify-center min-h-screen">
    <img src="../assets/images/background/bg-main-8.png" alt="background" class="object-cover w-full h-screen absolute">

    <div class="bg-white backdrop-blur-[3px] overflow-hidden rounded-3xl shadow-md w-220 h-auto grid grid-cols-2">
      <div class="py-8 px-12 flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl font-bold text-[#10b981] text-center">Task Management</h1>
        </div>

        <div class="flex flex-col gap-6 text-gray-600">
          <InputText v-model="username" type="text" id="username" placeholder="Username" class="rounded-full"/>
          <InputText v-model="password" type="password" id="password" placeholder="Password" class="rounded-full"/>
          <Button @click="handleLogin" label="Sign in" class="w-full p-button"/>
        </div>

        <div class="flex items-center justify-between">
          <div class="w-full border-b border-gray-300"></div>
          <div class="px-6 text-[#10b981]">OR</div>
          <div class="w-full border-b border-gray-300"></div>
        </div>

        <div class="flex items-center justify-between text-gray-400 text-sm">
          <label>Don't have account yet?</label>
          <a class="text-[#10b981] hover:text-yellow-500 cursor-pointer" @click="visible = true">Register here</a>
        </div>
      </div>

      <div class="w-full h-full">
        <img src="@/assets/images/background/img.png" alt="logo" class="object-cover w-full h-full"/>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="visible" header="Register User" :style="{ width: '45rem'}" class="rounded-3xl px-4">
    <span class="text-gray-400 block mb-4">Register your information.</span>

    <div class="flex flex-col items-center justify-center pb-4 gap-4">
      <div class="flex items-center gap-2">
        <label class="font-semibold text-gray-600">Profile Image</label>
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined"/>
      </div>
      <img v-if="src" :src="src" alt="Image" class="object-center rounded-xl w-32 h-32"/>
    </div>

    <div class="grid grid-cols-2 gap-4 text-gray-600">
      <div class="flex flex-col gap-1">
        <label for="operatorID" class="font-semibold">User ID</label>
        <InputText id="operatorID" class="flex-auto" autocomplete="off" :invalid="!operatorID" v-model="operatorID"/>
      </div>

      <div class="flex flex-col gap-1">
        <label for="operatorName" class="font-semibold">Full Name</label>
        <InputText id="operatorName" class="flex-auto" autocomplete="off" v-model="operatorName"/>
      </div>

      <div class="flex flex-col gap-1">
        <label for="operatorPass" class="font-semibold">Password</label>
        <InputText id="operatorPass" class="flex-auto" type="password" :invalid="operatorPass.toString().length < 12" v-model="operatorPass"/>
      </div>

      <div class="flex flex-col gap-1">
        <label for="operatorPassConfirm" class="font-semibold">Confirm Password</label>
        <InputText id="operatorPassConfirm" class="flex-auto" type="password" :invalid="operatorPass !== operatorPassConfirm" autocomplete="off" v-model="operatorPassConfirm"/>
      </div>

      <div class="flex flex-col gap-1">
        <label for="operatorEmail" class="font-semibold">Email</label>
        <InputText id="operatorEmail" type="email" class="flex-auto" autocomplete="off" v-keyfilter="/^[^<>*!]+$/" v-model="operatorEmail"/>
      </div>

      <div class="flex flex-col gap-1">
        <label for="operatorRole" class="font-semibold">Role</label>
        <Select id="operatorRole" v-model="operatorRole" :options="roles" :invalid="!operatorRole"
                optionValue="ROLE_ID" optionLabel="ROLE_NAME" placeholder="Select a Role"
                checkmark :highlightOnSelect="false" class="w-full"
        />
      </div>
    </div>

    <div class="flex justify-end pt-4 gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Register" :disabled="isRegClick" @click="registerUser"></Button>
    </div>
  </Dialog>

</template>

<style scoped>
/*.p-inputtext, .p-select, .p-select-label {
  border: 1px white solid;
  background: none;
  color: white;
}*/

.glass-element {
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.03) 100%
  );
}
</style>
