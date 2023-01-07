<template>
  <el-button text @click="toggleDark()" :icon="isDark ? 'Sunny' : 'Moon'"></el-button>
</template>

<script setup lang="ts" name="NightShift">
import { isDark, toggleDark } from '@/hooks/useMyDark'
</script>
