<template>
  <el-button text @click="toggleDark()" :icon="isDark ? 'Sunny' : 'Moon'"></el-button>
</template>

<script setup lang="ts" name="NightShift">
import { useAppStore } from '@/store/app';

const { isDark, toggleDark } = useAppStore()
</script>
