<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue'
import {FilterMatchMode} from '@primevue/core/api';
import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";

const axios = getCurrentInstance().appContext.config.globalProperties.$axios;
const apiUrl = import.meta.env.VITE_API_URL;
const filters = ref();
const visible = ref(false);

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const dataOperator = ref([]);
onMounted(async () => {
  try {
    const res = await axios.post(`${apiUrl}/users/get-operator`);
    if (res.data.success) {
      dataOperator.value = res.data.result;
    }
  } catch (error) {
    console.log(error);
  }
});

</script>

<template>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
  <div class="max-h-full pt-16">
    <section class="px-6 py-4 flex flex-col gap-6">
      <div class="card p-8 flex flex-col gap-8">
        <DataTable v-model:filters="filters" :value="dataOperator" paginator :rows="10" dataKey="id" filterDisplay="menu" stripedRows removableSort
                   :globalFilterFields="['OPERATOR_ID', 'OPERATOR_NAME', 'OPERATOR_EMAIL', 'OPERATOR_STATUS', 'ATTEMPT','ROLE_NAME']">
          <template #header>
            <div class="flex items-center justify-between">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" class="h-10" variant="outlined" @click="clearFilter()"/>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search"/>
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" class="rounded-xl"/>
              </IconField>
            </div>
          </template>
          <template #empty> No data found.</template>
          <Column field="OPERATOR_ID" header="ID" sortable></Column>
          <Column field="OPERATOR_IMAGE" header="PROFILE">
            <template #body="slotProps">
              <Avatar :image="slotProps.data.OPERATOR_IMAGE ? `data:image/webp;base64,${slotProps.data.OPERATOR_IMAGE}` : '../src/assets/images/icons/default-image.svg'" shape="circle"/>
            </template>
          </Column>
          <Column field="OPERATOR_NAME" header="OPERATOR NAME" sortable></Column>
          <Column field="OPERATOR_EMAIL" header="EMAIL" class="max-w-96 overflow-ellipsis" sortable></Column>
          <Column field="OPERATOR_STATUS" header="STATUS" sortable>
            <template #body="slotProps">
              <div :class="slotProps.data.OPERATOR_STATUS === 1 ? 'text-green-600' : 'text-red-600'">
                {{ slotProps.data.OPERATOR_STATUS === 1 ? 'Active' : 'Disable' }}
              </div>
            </template>
          </Column>
          <Column field="ATTEMPT" header="ATTEMPT" sortable></Column>
          <Column field="ROLE_NAME" header="ROLE" sortable></Column>
          <Column field="" header="ACTION">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Button label="Update" icon="pi pi-pen-to-square" class="h-9" @click="selectRow(data)"/>
                <Button icon="pi pi-trash" severity="danger" class="h-9 w-9" @click="removeProgress(data)"/>
              </div>
            </template>
          </Column>
        </DataTable>

        <div class="flex items-center gap-2">
          <Button label="New Operator" icon="pi pi-plus" class="w-42" @click=""/>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>