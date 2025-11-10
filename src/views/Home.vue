<script setup>

import SideBar from "@/components/SideBar.vue";
</script>

<template>
  <div class="flex min-h-screen bg-main text-gray-800">
    <SideBar/>
    <div class="flex-1 w-full max-h-screen overflow-y-auto">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
.bg-main {
  background-image: url("../assets/images/background/bg-main.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>