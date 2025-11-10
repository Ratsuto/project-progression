<script setup>
import IconDashboard from "@/components/icons/IconDashboard.vue";
import IconProjectTable from "@/components/icons/IconProjectTable.vue";
import Button from 'primevue/button';
import axios from 'axios'
import Avatar from 'primevue/avatar';
import ConfirmPopup from 'primevue/confirmpopup';

import {ref, onMounted} from "vue";
import {useConfirm} from "primevue/useconfirm";
import {useRouter} from 'vue-router';

const confirm = useConfirm();
const router = useRouter();
const operatorID = localStorage.getItem('operatorId');
const users = ref({});

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
}

const requireConfirmation = (event) => {
  confirm.require({
    target: event.currentTarget,
    group: 'headless',
    message: 'Do you want to logout?',
    accept: () => {
      logout();
    },
    reject: () => {

    }
  });
}

onMounted(async () => {
  const res = await axios.post('http://localhost:3000/server-side/api/users/get-user-detail', {username: operatorID})
  if (res.data.success) {
    users.value = res.data.data
  }
});

const sysDate = new Date();
</script>

<template>
  <nav class="fixed bg-white backdrop-blur-sm w-full h-18 z-10">
    <div class="flex items-center justify-between h-full w-full px-6">
      <div class="flex items-center justify-between gap-2">
        <Avatar :image="'../src/assets/images/icons/logo-1.png'" size="large"/>
        <div class="flex flex-col items-center justify-center">
          <p class="uppercase font-bold text-[#10b981]">Toanchet Pay</p>
          <p class="uppercase font-bold text-[#10b981]">Team</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div @click="requireConfirmation($event)" class="cursor-pointer text-right">
          <h1 class="font-bold text-md text-blue-400">{{ users.OPERATOR_ID }}</h1>
          <p class="text-[0.65rem] text-[#10b981] uppercase">{{ users.OPERATOR_NAME }}</p>
        </div>
        <Avatar :image="users.OPERATOR_IMAGE ? `data:image/jpeg;base64,${users.OPERATOR_IMAGE}` : '../src/assets/images/icons/default-image.svg'" class="" size="large" shape="circle"/>
        <ConfirmPopup group="headless">
          <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="rounded p-4">
              <span>{{ message.message }}</span>
              <div class="flex items-center justify-between gap-2 mt-4">
                <Button label="Logout" @click="acceptCallback" size="small" severity="danger"></Button>
                <Button label="Cancel" variant="outlined" @click="rejectCallback" severity="secondary" size="small" text></Button>
              </div>
            </div>
          </template>
        </ConfirmPopup>
      </div>
    </div>
  </nav>

  <!--Sidebar-->
  <aside class="w-64 max-h-screen shadow-md flex flex-col">
    <div class="h-18 bg-transparent"></div>

    <nav class="flex flex-col max-h-full overflow-y-scroll pr-2 py-4 gap-1 h-full bg-white backdrop-blur-md">
      <!-- Dashboard -->
      <router-link :to="{ name: 'Dashboard' }" v-slot="{ isActive, isExactActive}">
        <div :class="['flex items-center px-4 gap-4 h-11 w-0 rounded-r-full transition-all duration-300 font-semibold',
        isExactActive ? 'bg-gradient-to-r w-full from-[#10b981] to-[#10b9819f] text-white' : 'bg-none text-gray-600']">
          <div>
            <IconDashboard :fill="isExactActive ? 'white' : '#4A5565FF'" class="h-7"/>
          </div>
          Dashboard
        </div>
      </router-link>

      <!-- Update Project -->
      <router-link :to="{ name: 'UpdateProject' }" v-slot="{ isActive }">
        <div :class="['flex items-center px-4 h-11 gap-4 w-0 rounded-r-full transition-all duration-300 text-nowrap font-semibold',
        isActive ? 'bg-gradient-to-r w-full from-[#10b981] to-[#10b9819f] text-white' : 'bg-none text-gray-600']">
          <div>
            <IconProjectTable :fill="isActive ? 'white' : '#4A5565FF'" class="h-7"/>
          </div>
          <div class="w-fit">Update Progress</div>
        </div>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>

</style>