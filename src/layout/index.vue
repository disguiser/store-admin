<template>
  <div class="left">
    <sidebar />
  </div>
  <div class="right">
    <div class="header">
      <navbar />
      <tags-view />
    </div>
    <app-main style="flex:1" />
  </div>
</template>

<script setup lang="ts" name="Layout">
import { useVersionStore } from '@/store/version';
import { AppMain, Navbar, Sidebar, TagsView } from './components';

const versionStore = useVersionStore()
await versionStore.checkVersion()
</script>
<style lang="scss" scoped>
  .right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>