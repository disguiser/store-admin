<template>
  <div class="left" :style="{ width: appStore.sidebar ? '210px' : '65px' }">
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

<script setup lang="ts">
import { useVersionStore } from '@/store/version';
import { AppMain, Navbar, Sidebar, TagsView } from './components';
import { onBeforeUnmount } from 'vue'
import { useAppStore } from '@/store/app';
import { debounce } from 'lodash-es'

defineOptions({
  name: 'Layout'
})
const appStore = useAppStore()
const listeningWindow = debounce(() => {
  const screenWidth = document.body.clientWidth;
  if (appStore.sidebar && screenWidth < 1200) {
    appStore.toggleSideBar(false)
  }
  if (!appStore.sidebar && screenWidth > 1200) {
    appStore.toggleSideBar(true)
  }
}, 100);
window.addEventListener("resize", listeningWindow, false);
onBeforeUnmount(() => {
  window.removeEventListener("resize", listeningWindow);
});

const versionStore = useVersionStore()
await versionStore.checkVersion()
</script>
<style lang="scss" scoped>
  .left {
    transition: width 0.3s ease;
  }
  .right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>