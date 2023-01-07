<template>
  <div class="left">
    <sidebar />
  </div>
  <div class="right" :style="{ 'margin-left': marginLeft + 'px' }">
    <div class="header">
      <navbar />
      <tags-view />
    </div>
    <app-main style="flex:1" />
  </div>
</template>

<script setup lang="ts" name="Layout">
import { useAppStore } from '@/store/app';
import { ref, watchEffect } from 'vue';
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import { useVersionStore } from '@/store/version';
const appStore = useAppStore()
const marginLeft = ref(0)
watchEffect(() => {
  if (appStore.sidebar) {
    marginLeft.value = 200
  } else {
    marginLeft.value = 65
  }
})

const versionStore = useVersionStore()
await versionStore.checkVersion()
</script>
<style lang="scss" scoped>
  .left {
    position: fixed;
  }
  .right {
    height: 100%;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
  }
</style>