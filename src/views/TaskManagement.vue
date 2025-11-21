<script setup>
import {ref} from 'vue';

const items = ref([
  {route: '/assign-task', label: 'Task', icon: 'pi pi-clipboard'},
  {route: '/report', label: 'Report', icon: 'pi pi-chart-line'},
]);

</script>

<template>
  <div class="max-h-full pt-16 px-32">
    <Tabs value="/assign-task">
      <TabList class="bg-transparent!">
        <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
              <i :class="tab.icon"/>
              <span>{{ tab.label }}</span>
            </a>
          </router-link>
        </Tab>
      </TabList>
      <router-view/>
    </Tabs>
  </div>
</template>

<style scoped>

</style>