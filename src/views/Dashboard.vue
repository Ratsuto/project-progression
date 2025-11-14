<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue'

const axios = getCurrentInstance().appContext.config.globalProperties.$axios;
const apiUrl = import.meta.env.VITE_API_URL;

const operatorID = localStorage.getItem('operatorId');
const TotalProgress = ref(0);
const FinishProgress = ref(0);
const UnfinishProgress = ref(0);

const chartData = ref();
const chartOptions = ref(null);

const getAllProgress = async () => {
  try {
    const res = await axios.post(`${apiUrl}/progress/count-all`, {operatorID: operatorID})
    if (res.data.success) {
      TotalProgress.value = res.data.count
    }
  } catch (error) {
    console.log(error);
  }
};

const getFinishedProgress = async () => {
  try {
    const res = await axios.post(`${apiUrl}/progress/count-finished`, {operatorID: operatorID})
    if (res.data.success) {
      FinishProgress.value = res.data.count
    }
  } catch (error) {
    console.log(error);
  }
};

const getUnfinishedProgress = async () => {
  try {
    const res = await axios.post(`${apiUrl}/progress/count-unfinished`, {operatorID: operatorID})
    if (res.data.success) {
      UnfinishProgress.value = res.data.count
    }
  } catch (error) {
    console.log(error);
  }
};

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ['Lived', 'Pending'],
    datasets: [
      {
        data: [FinishProgress, UnfinishProgress],
        backgroundColor: [documentStyle.getPropertyValue('--p-cyan-500'), documentStyle.getPropertyValue('--p-orange-500'), documentStyle.getPropertyValue('--p-gray-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--p-cyan-400'), documentStyle.getPropertyValue('--p-orange-400'), documentStyle.getPropertyValue('--p-gray-400')]
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor
        }
      }
    }
  };
};

onMounted(() => {
  getAllProgress();
  getFinishedProgress();
  getUnfinishedProgress();

  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

</script>

<template>
  <div class="max-h-full pt-16 text-gray-600">
    <section class="px-6 py-4 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">

      <div class="card p-4 flex flex-col items-center justify-center">
        <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-82"/>
        <p class="mt-3 font-semibold text-center">Overall Progress</p>
      </div>

      <div class="card p-4 flex flex-col justify-center text-center">
        <h3 class="font-semibold">Total Projects</h3>
        <p class="text-3xl font-bold mt-2">{{ TotalProgress }}</p>
        <p class="text-green-600 text-sm">+0.5%</p>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>