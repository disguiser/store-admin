<template>
  <el-button text @click="toggleDark()" :icon="isDark ? 'Sunny' : 'Moon'"></el-button>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app';

defineOptions({
  name: 'NightShift'
})

const { isDark, toggleDark } = useAppStore()
</script>
