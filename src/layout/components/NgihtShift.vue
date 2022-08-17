<template>
  <n-button quaternary @click="appStore.toggleTheme()">{{ text }}</n-button>
</template>

<script setup lang="ts" name="NightShift">
import { NButton } from 'naive-ui';
import { useAppStore } from '@/store/app'
import { computed } from '@vue/reactivity';
const appStore = useAppStore()
const text = computed(() => {
  if (appStore.theme === null) {
    document.documentElement.setAttribute('data-theme', 'light')
    return '浅色'
  } else {
    document.documentElement.setAttribute('data-theme', 'dark')
    return '深色'
  }
})
</script>
