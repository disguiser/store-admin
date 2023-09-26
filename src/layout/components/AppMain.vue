<template>
  <navbar />
  <tabs />
  <maximize v-if="appStore.maximize" />
  <div class="app-main">
    <router-view v-slot="{ Component, route }">
      <KeepAlive :include="keepAliveStore.keepAliveName">
        <component :is="Component" :key="route.path" v-if="!appStore.refreshing" />
      </KeepAlive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useKeepAliveStore } from '@/store/keepAlive';
import { watch } from 'vue';
import { useAppStore } from '@/store/app';
import Navbar from './Navbar.vue';
import Tabs from './Tabs/index.vue'
import Maximize from './Maximize.vue';

const keepAliveStore = useKeepAliveStore()

const appStore = useAppStore()
// 监听当前页是否最大化，动态添加 class
watch(
	() => appStore.maximize,
	() => {
		const app = document.getElementById("app") as HTMLElement;
		if (appStore.maximize) app.classList.add("main-maximize");
		else app.classList.remove("main-maximize");
	},
	{ immediate: true }
);
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  padding: 10px;
  background-color: #f0f2f5;
  overflow: auto;
  flex: 1;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
