<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import {ref, onMounted} from 'vue';
import axios from "axios";
import {FilterMatchMode} from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Toast from 'primevue/toast';
import {useToast} from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import Slider from "primevue/slider";
import ConfirmDialog from "primevue/confirmdialog";
import {useConfirm} from "primevue/useconfirm";

const progressData = ref([]);
const operatorID = localStorage.getItem('operatorId');
const filters = ref();
const toast = useToast();
const confirm = useConfirm();
const visible = ref(false);
const isAddHidden = ref(false);
const isEditHidden = ref(false);
const header = ref('');
const ID = ref(0);

const startDate = ref();
const endDate = ref();
const liveDate = ref();

const actStartDate = ref();
const actEndDate = ref();
const actLiveDate = ref();

const projectNo = ref('');
const projectName = ref('');

const projectCate = ref();
const cate = ref([
  {name: 'PMO', code: 'PMO'},
  {name: 'Internal', code: 'Internal'}
]);

const projectType = ref();
const type = ref([
  {name: 'Project', code: 'Project'},
  {name: 'None Project', code: 'None Project'}
]);

const projectStatus = ref();
const proStatus = ref([
  {name: 'Open', code: 'Open'},
  {name: 'Hold', code: 'Hold'},
  {name: 'Live', code: 'Live'}
]);

const devValue = ref(0);
const sitValue = ref(0);
const uatValue = ref(0);
const pilotValue = ref(0);
const lastMonthValue = ref(0);
const thisMonthValue = ref(0);
const progressIncrement = ref(0);

const progressStatus = ref();
const progStatus = ref([
  {name: 'Developing', code: 'Developing'},
  {name: 'SIT', code: 'SIT'},
  {name: 'UAT', code: 'UAT'},
  {name: 'Pilot', code: 'Pilot'},
  {name: 'Lived', code: 'Lived'},
  {name: 'Study', code: 'Study'},
  {name: 'Pending', code: 'Pending'},
  {name: 'Hold', code: 'Hold'},
  {name: 'Moved', code: 'Moved'},
  {name: 'Dropped', code: 'Dropped'},
]);

const note = ref('');

const loadProgressData = async () => {
  try {
    const res = await axios.post('http://localhost:3000/server-side/api/progress/list-progress', {operatorID: operatorID})
    if (res.data.success) {
      progressData.value = res.data.progress
    }
  } catch (error) {
    console.log(error);
  }

};

onMounted(() => {
  loadProgressData();
});

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS},
  };
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const formatLocalDateIso = (dateStr) => {
  if (dateStr === null || dateStr === undefined) {
    return '';
  } else {
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

const selectRow = (data) => {
  visible.value = true;
  header.value = 'Update';
  isAddHidden.value = true;

  if (isEditHidden.value === true) {
    isEditHidden.value = false;
  }

  ID.value = data.ID;
  projectNo.value = data.PROJECT_CODE;
  projectName.value = data.PROJECT_NAME;
  projectCate.value = cate.value.find(c => c.code === data.PROJECT_CATEGORY);
  projectType.value = type.value.find(t => t.code === data.PROJECT_TYPE);
  projectStatus.value = proStatus.value.find(s => s.code === data.PROJECT_STATUS);
  startDate.value = formatLocalDateIso(data.PLAN_DEV_START);
  endDate.value = formatLocalDateIso(data.PLAN_DEV_END);
  liveDate.value = formatLocalDateIso(data.PLAN_LIVE);
  actStartDate.value = formatLocalDateIso(data.ACTUAL_DEV_START);
  actEndDate.value = formatLocalDateIso(data.ACTUAL_DEV_END);
  actLiveDate.value = formatLocalDateIso(data.ACTUAL_LIVE);
  devValue.value = data.PROGRESS_DEV;
  sitValue.value = data.PROGRESS_SIT;
  uatValue.value = data.PROGRESS_UAT;
  pilotValue.value = data.PROGRESS_PILOT;
  progressStatus.value = progStatus.value.find(s => s.code === data.PROGRESS_STATUS);
  progressIncrement.value = data.PROGRESS_INCREASE;
  lastMonthValue.value = data.LAST_PROGRESS;
  thisMonthValue.value = data.THIS_PROGRESS;
  note.value = data.PROJECT_NOTE;
};

const submitData = () => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Submit'
    },
    accept: async () => {
      try {
        const resp = await axios.post('http://localhost:3000/server-side/api/progress/add-progress', {
          projectCode: projectNo.value,
          projectName: projectName.value,
          projectCate: projectCate.value.code,
          projectType: projectType.value.code,
          projectStatus: projectStatus.value.code,
          projectNote: note.value,
          planDevStart: startDate.value,
          planDevEnd: endDate.value,
          planLive: liveDate.value,
          actualDevStart: actStartDate.value,
          actualDevEnd: actEndDate.value,
          actualLive: actLiveDate.value,
          progressDEV: devValue.value,
          progressSIT: sitValue.value,
          progressUAT: uatValue.value,
          progressPILOT: pilotValue.value,
          progressStatus: progressStatus.value.code,
          increase: progressIncrement.value,
          lastProgress: lastMonthValue.value,
          thisProgress: thisMonthValue.value,
          operatorID: operatorID
        });

        if (resp.data.success) {
          visible.value = false;
          toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000});
          await loadProgressData();
        } else {
          toast.add({severity: 'error', summary: 'Failed', detail: resp.data.message, life: 3000});
        }
      } catch (e) {
        toast.add({severity: 'error', summary: 'Error Exception', detail: e.message, life: 3000});
      }
    },
    reject: () => {
      toast.add({severity: 'info', summary: 'Canceled', detail: 'You have canceled', life: 3000});
    }
  });
};

const updateProgress = async () => {
  try {
    const resp = await axios.post('http://localhost:3000/server-side/api/progress/update-progress', {
      Id: ID.value,
      projectCode: projectNo.value,
      projectName: projectName.value,
      projectCate: projectCate.value.code,
      projectType: projectType.value.code,
      projectStatus: projectStatus.value.code,
      projectNote: note.value,
      planDevStart: startDate.value,
      planDevEnd: endDate.value,
      planLive: liveDate.value,
      actualDevStart: actStartDate.value,
      actualDevEnd: actEndDate.value,
      actualLive: actLiveDate.value,
      progressDEV: devValue.value,
      progressSIT: sitValue.value,
      progressUAT: uatValue.value,
      progressPILOT: pilotValue.value,
      progressStatus: progressStatus.value.code,
      increase: progressIncrement.value,
      lastProgress: lastMonthValue.value,
      thisProgress: thisMonthValue.value,
      operatorID: operatorID
    });

    if (resp.data.success) {
      visible.value = false;
      await loadProgressData();
      toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000});
    } else {
      toast.add({severity: 'error', summary: 'Failed', detail: resp.data.message, life: 3000});
    }
  } catch (e) {
    toast.add({severity: 'error', summary: 'Error Exception', detail: e.message, life: 3000});
  }
}

const removeProgress = (data) => {
  ID.value = data.ID;

  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: false
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      try {
        const resp = await axios.post('http://localhost:3000/server-side/api/progress/remove-progress', {
          Id: ID.value,
          operatorID: operatorID
        });

        if (resp.data.success) {
          await loadProgressData();
          toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000});
        } else {
          toast.add({severity: 'error', summary: 'Failed', detail: resp.data.message, life: 3000});
        }
      } catch (e) {
        toast.add({severity: 'error', summary: 'Error Exception', detail: e.message, life: 3000});
      }
    },
    reject() {
      toast.add({severity: 'info', summary: 'Cancel', detail: "Request has been canceled", life: 3000});
    }
  });
}

const clearData = () => {
  ID.value = 0;
  projectNo.value = '';
  projectName.value = '';
  projectCate.value = '';
  projectType.value = '';
  projectStatus.value = '';
  startDate.value = '';
  endDate.value = '';
  liveDate.value = '';
  actStartDate.value = '';
  actEndDate.value = '';
  actLiveDate.value = '';
  devValue.value = 0;
  sitValue.value = 0;
  uatValue.value = 0;
  pilotValue.value = 0;
  progressStatus.value = '';
  lastMonthValue.value = 0;
  thisMonthValue.value = 0;
  note.value = '';
}

const openAddModal = () => {
  visible.value = true;
  header.value = 'New';
  isEditHidden.value = true;

  if (isAddHidden.value === true) {
    isAddHidden.value = false;
  }
  clearData();
}

const closeModal = () => {
  visible.value = false;
  isEditHidden.value = false;
  isAddHidden.value = false;
  clearData();
}

const downloadExcel = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/server-side/api/export/excel?operatorID=${operatorID}&date=${formatLocalDateIso(new Date())}`);
    if (res.data.status === 400) {
      toast.add({severity: 'info', summary: 'Information', detail: res.data.message, life: 3000});
    } else {
      window.location.href = `http://localhost:3000/server-side/api/export/excel?operatorID=${operatorID}&date=${formatLocalDateIso(new Date())}`;
    }
  } catch (err) {
    toast.add({severity: 'info', summary: 'Information', detail: "You don't have data update for today", life: 3000});
  }
};
</script>

<template>
  <Toast/>
  <ConfirmDialog></ConfirmDialog>
  <div class="max-h-full pt-19">
    <section class="px-6 py-4 flex flex-col gap-6">
      <div class="card p-6 flex flex-col gap-6">
        <DataTable v-model:filters="filters" :value="progressData" paginator :rows="10" dataKey="id" filterDisplay="menu" stripedRows removableSort
                   :globalFilterFields="['PROJECT_CODE', 'OPERATOR_ID', 'PROJECT_NAME', 'PROJECT_CATEGORY', 'PROJECT_TYPE','PROJECT_STATUS','PROGRESS_STATUS']">
          <template #header>
            <div class="flex items-center justify-between">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" class="h-10" variant="outlined" @click="clearFilter()"/>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search"/>
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search"/>
              </IconField>
            </div>
          </template>
          <template #empty> No data found.</template>
          <Column field="ID" header="No." sortable></Column>
          <Column field="PROJECT_CODE" header="PROJECT CODE" sortable></Column>
          <Column field="PROJECT_NAME" header="PROJECT NAME" sortable></Column>
          <Column field="PROJECT_CATEGORY" header="CATEGORY" sortable></Column>
          <Column field="PROJECT_TYPE" header="TYPE" sortable></Column>
          <Column field="PROJECT_STATUS" header="STATUS" sortable></Column>
          <Column field="PROGRESS_STATUS" header="PROGRESS" sortable></Column>
          <Column field="OPERATOR_ID" header="DEVELOPER" sortable></Column>
          <Column header="ACTION" class="flex justify-center">
            <template #body="{ data }">
              <div class="flex items-center justify-center gap-2">
                <Button label="Update" icon="pi pi-pen-to-square" @click="selectRow(data)"/>
                <Button icon="pi pi-trash" severity="danger" @click="removeProgress(data)"/>
              </div>
            </template>
          </Column>
        </DataTable>
        <div class="flex items-center gap-2">
          <Button label="New Progress" icon="pi pi-plus" class="w-42" @click="openAddModal"/>
          <Button type="button" icon="pi pi-file-excel" label="Export" class="p-button-success" @click="downloadExcel"/>
        </div>
      </div>
    </section>
  </div>

  <Dialog v-model:visible="visible" :header="header + ' Progression'" :style="{ width: '65rem'}">
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
            <InputNumber v-model.number="devValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
            <Slider v-model="devValue" class="w-full"/>
          </div>

          <div class="flex flex-col items-center gap-4">
            <label class="font-semibold">SIT</label>
            <InputNumber v-model.number="sitValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
            <Slider v-model="sitValue" class="w-full"/>
          </div>

          <div class="flex flex-col items-center gap-4">
            <label class="font-semibold">UAT</label>
            <InputNumber v-model.number="uatValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
            <Slider v-model="uatValue" class="w-full"/>
          </div>

          <div class="flex flex-col items-center gap-4">
            <label class="font-semibold">PILOT</label>
            <InputNumber v-model.number="pilotValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
            <Slider v-model="pilotValue" class="w-full"/>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h1 class="card-header">Progress</h1>
        <div class="w-full border-b border-dashed border-gray-300"></div>

        <div class="flex items-center w-full gap-2">
          <label class="w-1/3">Last Month</label>
          <InputNumber v-model.number="lastMonthValue" class="w-full" :min="0" :max="100" suffix=" %"/>
        </div>

        <div class="flex items-center w-full gap-2">
          <label class="w-1/3">This Month</label>
          <InputNumber v-model.number="thisMonthValue" :model-value="(devValue + sitValue + uatValue + pilotValue)/4" class="w-full" :min="0" :max="100" suffix=" %" readonly/>
        </div>

        <div class="flex items-center w-full gap-2">
          <label class="w-1/3">Increment</label>
          <InputNumber v-model.number="progressIncrement" :model-value="thisMonthValue - lastMonthValue" class="w-full" :min="0" :max="100" suffix=" %" readonly/>
        </div>

        <div class="flex items-center w-full gap-2">
          <label class="w-1/3">Status</label>
          <Select v-model="progressStatus" :options="progStatus" optionLabel="name" placeholder="Select Status" checkmark :highlightOnSelect="false" class="w-full"/>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h1 class="card-header">Note</h1>
        <div class="w-full border-b border-dashed border-gray-300"></div>

        <div class="flex items-center w-full gap-2">
          <Textarea v-model="note" rows="7" style="resize: none" fluid/>
        </div>
      </div>
    </section>

    <div class="flex justify-end pt-4 gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="closeModal"></Button>
      <Button type="button" label="Save Change" :hidden="isEditHidden" @click="updateProgress"></Button>
      <Button type="button" label="Submit" :hidden="isAddHidden" @click="submitData"></Button>
    </div>
  </Dialog>
</template>