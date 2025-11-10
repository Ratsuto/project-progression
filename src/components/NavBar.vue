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
</script>

<template>
  <div class="fixed bg-white backdrop-blur-sm w-full h-16 z-10">
    <div class="flex items-center justify-between h-full w-full px-6">
      <div>
        logo
      </div>

      <div>
        TOANCHET PAY TEAM
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
  </div>
</template>

<style scoped>

</style>