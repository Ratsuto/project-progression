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
      dataOperator.value = res.data.operator;
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
              <Avatar :image="slotProps.data.OPERATOR_IMAGE ? `data:image/jpeg;base64,${slotProps.data.OPERATOR_IMAGE}` : '../src/assets/images/icons/default-image.svg'" shape="circle"/>
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

  <!--  <Dialog v-model:visible="visible" :header="header + ' Progression'" :style="{ width: '65rem'}">
      <section class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-4">
          <h1 class="card-header">Projects Detail</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Project No.</label>
            <InputText v-model="projectNo" class="w-full"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Project Name</label>
            <InputText v-model="projectName" class="w-full"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Category</label>
            <Select v-model="projectCate" :options="cate" optionLabel="name" placeholder="Select a Category" checkmark :highlightOnSelect="false" class="w-full"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Type</label>
            <Select v-model="projectType" :options="type" optionLabel="name" placeholder="Select Project Type" checkmark :highlightOnSelect="false" class="w-full"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Status</label>
            <Select v-model="projectStatus" :options="proStatus" optionLabel="name" placeholder="Select Project Status" checkmark :highlightOnSelect="false" class="w-full"/>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <h1 class="card-header">Projects Plan</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Dev Start</label>
            <DatePicker v-model="startDate" showIcon iconDisplay="input" class="w-full" dateFormat="yy-mm-dd"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Dev End</label>
            <DatePicker v-model="endDate" showIcon iconDisplay="input" class="w-full" dateFormat="yy-mm-dd"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Expect Live</label>
            <DatePicker v-model="liveDate" showIcon iconDisplay="input" class="w-full" dateFormat="yy-mm-dd"/>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <h1 class="card-header">Projects Actual Plan</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Dev Start</label>
            <DatePicker v-model="actStartDate" showIcon iconDisplay="input" class="w-full" dateFormat="yy-mm-dd"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Dev End</label>
            <DatePicker v-model="actEndDate" showIcon iconDisplay="input" class="w-full" dateFormat="yy-mm-dd"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Expect Live</label>
            <DatePicker v-model="actLiveDate" showIcon iconDisplay="input" class="w-full" dateFormat="yy-mm-dd"/>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <h1 class="card-header">Progression</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>
          <div class="grid grid-cols-1 lg:grid-cols-2 items-center w-full gap-6">
            <div class="flex flex-col items-center gap-4">
              <label class="font-semibold">DEV</label>
              <IconField class="mb-2">
                <InputNumber v-model.number="devValue" class="w-full" :min="0" :max="100"/>
                <InputIcon class="pi pi-percentage"/>
              </IconField>
              <Slider v-model="devValue" class="w-full"/>
            </div>

            <div class="flex flex-col items-center gap-4">
              <label class="font-semibold">SIT</label>
              <IconField class="mb-2">
                <InputNumber v-model.number="sitValue" class="w-full" :min="0" :max="100"/>
                <InputIcon class="pi pi-percentage"/>
              </IconField>
              <Slider v-model="sitValue" class="w-full"/>
            </div>

            <div class="flex flex-col items-center gap-4">
              <label class="font-semibold">UAT</label>
              <IconField class="mb-2">
                <InputNumber v-model.number="uatValue" class="w-full" :min="0" :max="100"/>
                <InputIcon class="pi pi-percentage"/>
              </IconField>
              <Slider v-model="uatValue" class="w-full"/>
            </div>

            <div class="flex flex-col items-center gap-4">
              <label class="font-semibold">PILOT</label>
              <IconField class="mb-2">
                <InputNumber v-model.number="pilotValue" class="w-full" :min="0" :max="100"/>
                <InputIcon class="pi pi-percentage"/>
              </IconField>
              <Slider v-model="pilotValue" class="w-full"/>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <h1 class="card-header">Progress</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Last Month</label>
            <IconField class="w-full">
              <InputNumber v-model.number="lastMonthValue" class="w-full" :min="0" :max="100"/>
              <InputIcon class="pi pi-percentage"/>
            </IconField>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">This Month</label>
            <IconField class="w-full">
              <InputNumber v-model.number="thisMonthValue" :model-value="(devValue + sitValue + uatValue + pilotValue)/4" class="w-full" :min="0" :max="100" readonly/>
              <InputIcon class="pi pi-percentage"/>
            </IconField>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Increment</label>
            <IconField class="w-full">
              <InputNumber v-model.number="progressIncrement" :model-value="thisMonthValue - lastMonthValue" class="w-full" :min="0" :max="100" readonly/>
              <InputIcon class="pi pi-percentage"/>
            </IconField>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Status</label>
            <Select v-model="progressStatus" :options="progStatus" optionLabel="name" placeholder="Select Status" checkmark :highlightOnSelect="false" class="w-full"/>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <h1 class="card-header">Note</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>

          <div class="flex items-center h-full w-full gap-2">
            <Textarea v-model="note" rows="9" style="resize: none" class="h-full" fluid/>
          </div>
        </div>
      </section>

      <div class="flex justify-end pt-4 gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="closeModal"></Button>
        <Button type="button" label="Save Change" :hidden="isEditHidden" @click="updateProgress"></Button>
        <Button type="button" label="Submit" :hidden="isAddHidden" @click="submitData"></Button>
      </div>
    </Dialog>-->
</template>

<style scoped>

</style>