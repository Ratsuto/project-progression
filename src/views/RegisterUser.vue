<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Toast from "primevue/toast";
import Select from "primevue/select";

const name = ref('');
const userID = ref('');
const password = ref('');
const password_confirmation = ref('');
const email = ref('');
const image = ref();
const roles = ref({});
const roleID = ref();

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/server-side/api/users/get-role-detail');
  if (res.data.success) {
    roles.value = res.data.data
  }
});

console.log(roles);

</script>

<template>
  <Toast/>
  <div class="flex items-center justify-center min-h-screen">
    <img src="../assets/images/background/bg-main-2.png" alt="background" class="object-cover w-full h-screen absolute blur-[2px]">
    <div class="bg-zinc-100/50 backdrop-blur-[5px] overflow-hidden rounded-2xl shadow-md w-[60rem] h-[30rem] grid grid-cols-2">

      <div class="py-8 px-18 flex flex-col gap-8">
        <div class="flex">
          <h1 class="text-2xl font-bold text-[#10b981]">Sign in</h1>
        </div>

        <div class="flex flex-col items-center w-full gap-2">
          <label>Role</label>
          <Select v-model="roleID" :options="roles.data.ROLE_ID" optionLabel="" placeholder="Select a Role" checkmark :highlightOnSelect="false" class="w-full"/>
        </div>

        <div class="flex flex-col gap-4 text-gray-600">
          <div class="flex flex-col gap-2">
            <label for="username">Username</label>
            <InputText v-model="userID" type="text" id="username"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="password">Password</label>
            <InputText v-model="password" type="password" id="password"/>
          </div>
          <Button @click="" label="Sign in" class="w-full"/>
        </div>

        <div class="flex items-center justify-between">
          <div class="w-full border-b border-gray-300"></div>
          <div class="px-6 text-[#10b981]">OR</div>
          <div class="w-full border-b border-gray-300"></div>
        </div>

        <div class="flex items-center justify-between text-gray-500">
          <label>Don't have account yet?</label>
          <a class="text-[#10b981] hover:text-yellow-500 cursor-pointer">Register here</a>
        </div>
      </div>

      <div class="w-full h-full">
        <img src="@/assets/images/background/img.png" alt="logo" class="object-cover w-full h-full"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>