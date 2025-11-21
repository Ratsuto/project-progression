<script setup>
import SideBar from "@/components/SideBar.vue";
</script>

<template>
  <div class="flex min-h-screen bg-[#eef3fa] dark:bg-black text-gray-800 dark:text-white">
    <SideBar/>
    <div class="flex-1 w-full max-h-screen overflow-y-auto">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
.bg-main {
  background-image: url("../assets/images/background/bg-main-8.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>