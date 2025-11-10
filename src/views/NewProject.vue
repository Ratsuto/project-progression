<script setup xmlns="http://www.w3.org/1999/html">
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Slider from 'primevue/slider';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

const confirm = useConfirm();
const toast = useToast();

import {ref} from "vue";
import axios from "axios";

const date = new Date().getDate() + "/" + String(new Date().getMonth() + 1).padStart(2, "0") + "/" + new Date().getFullYear();

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
const operatorID = localStorage.getItem('operatorId');
const isDisabled = ref(false);

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
          lastProgress: lastMonthValue.value,
          thisProgress: thisMonthValue.value,
          operatorID: operatorID
        });

        if (resp.data.success) {
          isDisabled.value = true;
          toast.add({severity: 'success', summary: 'Success', detail: resp.data.message, life: 3000});
          setTimeout(() => {
            location.reload();
          }, 3000);
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
</script>

<template>
  <div class="flex flex-col gap-1 w-fit px-6 py-2 text-gray-600">
    <h1 class="text-3xl font-semibold"><i class="pi pi-align-right" style="font-size: 1.5rem"></i> New Progress</h1>
    <div class="h-1 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-400"></div>
  </div>

  <div class="max-h-full">
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 px-6 py-4">
      <div class="card group relative">
        <div class="flex flex-col gap-4 p-6">
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

        <div class="border-b-animation absolute bottom-0"></div>
      </div>

      <div class="card group relative">
        <div class="flex flex-col gap-4 p-6">
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

        <div class="border-b-animation absolute bottom-0"></div>
      </div>

      <div class="card group relative">
        <div class="flex flex-col gap-4 p-6">
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

        <div class="border-b-animation absolute bottom-0"></div>
      </div>

      <div class="card group relative">
        <div class="flex flex-col gap-4 p-6">
          <h1 class="card-header">Progression [{{ date }}]</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>
          <div class="grid grid-cols-1 lg:grid-cols-2 items-center w-full gap-6">
            <div class="flex flex-col items-center gap-2">
              <label class="font-semibold">DEV</label>
              <InputNumber v-model.number="devValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
              <Slider v-model="devValue" class="w-full"/>
            </div>

            <div class="flex flex-col items-center gap-2">
              <label class="font-semibold">SIT</label>
              <InputNumber v-model.number="sitValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
              <Slider v-model="sitValue" class="w-full"/>
            </div>

            <div class="flex flex-col items-center gap-2">
              <label class="font-semibold">UAT</label>
              <InputNumber v-model.number="uatValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
              <Slider v-model="uatValue" class="w-full"/>
            </div>

            <div class="flex flex-col items-center gap-2">
              <label class="font-semibold">PILOT</label>
              <InputNumber v-model.number="pilotValue" class="w-full mb-2" :min="0" :max="100" suffix=" %"/>
              <Slider v-model="pilotValue" class="w-full"/>
            </div>
          </div>
        </div>

        <div class="border-b-animation absolute bottom-0"></div>
      </div>

      <div class="card group relative">
        <div class="flex flex-col gap-4 p-6">
          <h1 class="card-header">Progress</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Last Month</label>
            <InputNumber v-model.number="lastMonthValue" class="w-full" :min="0" :max="100" suffix=" %"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">This Month</label>
            <InputNumber v-model.number="thisMonthValue" class="w-full" :min="0" :max="100" suffix=" %"/>
          </div>

          <div class="flex items-center w-full gap-2">
            <label class="w-1/3">Status</label>
            <Select v-model="progressStatus" :options="progStatus" optionLabel="name" placeholder="Select Status" checkmark :highlightOnSelect="false" class="w-full"/>
          </div>
        </div>

        <div class="border-b-animation absolute bottom-0"></div>
      </div>

      <div class="card group relative">
        <div class="flex flex-col gap-4 p-6">
          <h1 class="card-header">Note</h1>
          <div class="w-full border-b border-dashed border-gray-300"></div>

          <div class="flex items-center w-full gap-2">
            <Textarea v-model="note" rows="6" style="resize: none" fluid/>
          </div>

          <Button @click="submitData()" label="Submit" :disabled="isDisabled"></Button>
        </div>

        <div class="border-b-animation absolute bottom-0"></div>
      </div>
    </section>
  </div>

  <Toast/>
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped>

</style>