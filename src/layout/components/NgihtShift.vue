<template>
  <el-button text @click="toggleDark()" :icon="isDark ? 'Sunny' : 'Moon'"></el-button>
</template>

<script setup lang="ts" name="NightShift">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
