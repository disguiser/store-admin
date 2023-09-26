<template>
  <el-button text @click="appStore.toggleDark()" :icon="appStore.isDark ? 'Sunny' : 'Moon'"></el-button>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';

defineOptions({
  name: 'NightShift'
})

const appStore = useAppStore()
</script>
