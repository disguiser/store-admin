<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="appStore.theme">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
  import { NConfigProvider, NMessageProvider } from 'naive-ui'
  import { zhCN, dateZhCN } from 'naive-ui'
  import { useAppStore } from './store/app';
  const appStore = useAppStore()
</script>

