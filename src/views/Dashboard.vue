<script setup>
import {onMounted} from 'vue'
import Chart from 'chart.js/auto'


onMounted(() => {
  const balanceChart = new Chart(document.getElementById('chart-balance'), {
    type: 'line',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [
        {label: 'Income', data: [30, 35, 45, 50, 35], borderColor: '#22c55e', fill: false},
        {label: 'Expenses', data: [25, 20, 22, 30, 28], borderColor: '#3b82f6', fill: false}
      ]
    },
    options: {responsive: true, maintainAspectRatio: false}
  })


  const statsChart = new Chart(document.getElementById('chart-statistics'), {
    type: 'line',
    data: {
      labels: ['April', 'May', 'June', 'July', 'August', 'September', 'October'],
      datasets: [
        {label: 'Revenue', data: [400, 500, 300, 700, 900, 800, 500], borderColor: '#22c55e', fill: false},
        {label: 'Expenses', data: [300, 200, 250, 400, 600, 450, 300], borderColor: '#ef4444', fill: false}
      ]
    },
    options: {responsive: true, maintainAspectRatio: false}
  })
})
</script>

<template>
  <div class="max-h-full pt-19">
    <section class="px-6 py-4 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
      <!-- Card 2 -->
      <div class="bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
        <div class="relative w-32 h-32">
          <svg class="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" r="45%" stroke="#e5e7eb" stroke-width="10" fill="none"/>
            <circle cx="50%" cy="50%" r="45%" stroke="#22c55e" stroke-width="10" fill="none" stroke-dasharray="450" stroke-dashoffset="85"/>
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-xl font-bold text-green-600">100%</span>
        </div>
        <p class="mt-3 font-semibold text-center">Total Complete Project</p>
        <p class="text-gray-500 text-sm text-center">Manage your project automatically with AI.</p>
      </div>

      <!-- Card 1 -->
      <div class="bg-white p-6 rounded-2xl shadow">
        <h3 class="text-sm text-gray-500">Current Balance</h3>
        <p class="text-2xl font-bold mt-1">$24,567.33</p>
        <p class="text-green-600 text-sm">+2.7% than last week</p>
        <div class="mt-4">
          <canvas id="chart-balance"></canvas>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-gradient-to-r from-green-600 to-green-400 p-6 rounded-2xl text-white flex flex-col justify-between">
        <h3 class="text-lg font-semibold">Manage your project in one touch</h3>
        <p class="text-sm opacity-90">Let Workload manage your project automatically with our best AI systems.</p>
        <button class="bg-white text-green-600 rounded-full px-4 py-2 font-semibold w-fit mt-4">Try Free Now</button>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="p-6 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
      <div class="bg-white p-6 h-96 rounded-2xl shadow col-span-2">
        <h3 class="font-semibold mb-2">Project Statistics</h3>
        <canvas id="chart-statistics" class="pb-6"></canvas>
      </div>


      <div class="bg-white p-6 rounded-2xl shadow flex flex-col justify-center text-center">
        <h3 class="font-semibold">Total Projects</h3>
        <p class="text-3xl font-bold mt-2">68</p>
        <p class="text-green-600 text-sm">+0.5%</p>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>