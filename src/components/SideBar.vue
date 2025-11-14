<script setup>
import IconDashboard from "@/components/icons/IconDashboard.vue";
import IconProjectTable from "@/components/icons/IconProjectTable.vue";

import {ref, onMounted, getCurrentInstance} from "vue";
import {useConfirm} from "primevue/useconfirm";
import {useRouter} from 'vue-router';

const axios = getCurrentInstance().appContext.config.globalProperties.$axios;
const apiUrl = import.meta.env.VITE_API_URL;

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
  const res = await axios.post(`${apiUrl}/users/get-user-detail`, {username: operatorID})
  if (res.data.success) {
    users.value = res.data.data
  }
});

localStorage.setItem('userRole', users.ROLE_NAME);
localStorage.setItem('userRoleType', users.ROLE_TYPE);

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: 'home',
  },
  {
    label: 'Update Progress',
    icon: 'pi pi-inbox',
    route: 'update-progress',
  },
  {
    label: 'Management',
    icon: 'pi pi-home',
    items:[
      {
        label: 'Operators',
        route: 'operator',
        icon: 'pi pi-user',
      },
      {
        label: 'Roles',
        route: 'operator-role',
        icon: 'pi pi-user',
      }
    ],
  }
]);

</script>

<template>
  <div class="fixed bg-transparent w-full z-10">
    <Menubar :model="items" class="rounded-none! border-none!">
      <template #item="{ item, props, hasSubmenu }" #start>
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon"/>
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon"/>
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down"/>
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-3 text-gray-500">
          <div class="text-sm">
            {{
              new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })
            }}
          </div>
          <i class="pi pi-cog cursor-pointer"></i>
          <Avatar class="cursor-pointer" :image="users.OPERATOR_IMAGE ? `data:image/jpeg;base64,${users.OPERATOR_IMAGE}` : '../src/assets/images/icons/default-image.svg'" shape="circle" @click="requireConfirmation($event)"/>
        </div>
      </template>
    </Menubar>
  </div>

  <ConfirmPopup group="headless">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="rounded p-4">
        <div class="pb-2">
          <h1 class="text-lg">{{ users.OPERATOR_ID }}</h1>
          <p class="text-[0.65rem] text-[#10b981] uppercase">{{ users.OPERATOR_NAME }}</p>
        </div>
        <div class="border-b border-dashed border-gray-200 mb-4"></div>
        <span>{{ message.message }}</span>
        <div class="flex items-center justify-between gap-2 mt-4">
          <Button label="Logout" @click="acceptCallback" size="small" severity="danger"></Button>
          <Button label="Cancel" variant="outlined" @click="rejectCallback" severity="secondary" size="small" text></Button>
        </div>
      </div>
    </template>
  </ConfirmPopup>


  <!--    <nav class="fixed bg-white/80 backdrop-blur-sm w-full h-18 z-10">
        <div class="flex items-center justify-between h-full w-full px-6">
          <div class="flex items-center justify-center gap-2">
            <Avatar :image="'../src/assets/images/icons/logo-2.webp'" size="large"/>
          </div>

          <div class="flex items-center justify-end gap-2 w-full">
            <div @click="requireConfirmation($event)" class="cursor-pointer text-right">
              <h1 class="font-bold text-md text-gray-500">{{ users.OPERATOR_ID }}</h1>
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
      </nav>-->

  <!--Sidebar-->
  <!--  <aside class="w-64 max-h-screen flex flex-col">
      <div class="h-18 bg-transparent"></div>

      <nav class="flex flex-col max-h-full overflow-y-scroll pr-2 py-4 gap-1 h-full bg-transparent backdrop-blur-md">
        &lt;!&ndash; Dashboard &ndash;&gt;
        <router-link :to="{ name: 'Dashboard' }" v-slot="{ isActive, isExactActive}">
          <div :class="['flex items-center px-4 gap-4 h-11 w-0 rounded-r-full transition-all duration-300 font-semibold',
          isExactActive ? 'bg-gradient-to-r w-full from-[#10b981] to-[#10b9819f] text-white' : 'bg-none text-gray-600']">
            <div>
              <IconDashboard :fill="isExactActive ? 'white' : '#4A5565FF'" class="h-7"/>
            </div>
            Dashboard
          </div>
        </router-link>

        &lt;!&ndash; Update Project &ndash;&gt;
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
    </aside>-->
</template>

<style scoped>

</style>