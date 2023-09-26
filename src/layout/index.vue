<template>
  <el-container class="layout">
    <div class="left-sidebar" :style="{ width: appStore.sidebar ? '210px' : '65px' }">
      <sidebar />
    </div>
    <div class="main-area">
      <app-main />
    </div>
  </el-container>
</template>

<script setup lang="ts">
import { useVersionStore } from '@/store/version';
import AppMain from './components/AppMain.vue';
import Sidebar from './components/Sidebar/index.vue';
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
  .left-sidebar {
    transition: width 0.3s ease;
  }
  .main-area {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>