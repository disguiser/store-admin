<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script setup lang="ts">
import Waiter from './waiter/index.vue'
import Admin from './admin/index.vue'
import { ref } from 'vue'
import { useUserStore } from '@/store/user';

const { roles } = useUserStore()
const currentRole = ref()

if (roles.includes('Boss') || roles.includes('Waiter')) {
  currentRole.value = Waiter
} else if (roles.includes('Admin')) {
  currentRole.value = Admin
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
}
</style>