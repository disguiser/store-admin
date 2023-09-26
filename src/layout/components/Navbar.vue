<template>
  <div class="navbar">
    <!-- <el-button text :icon="appStore.sidebar?'Fold':'Expand'" style="float: left;height: 100%;font-size: large;" @click="appStore.toggleSideBar"></el-button> -->
    <div class="left">
      <el-icon class="collapse-icon" @click="appStore.toggleSideBar">
        <component :is="appStore.sidebar ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <breadcrumb />
    </div>
    <div class="right">
      <ngiht-shift />
      <account-btn />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from './Breadcrumb.vue'
import NgihtShift from './NgihtShift.vue'
import AccountBtn from './AccountBtn.vue'
import { useAppStore } from '@/store/app';
const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.collapse-icon {
  float: left;
  height: 100%;
  font-size: 22px;
  width: 1em;
  cursor: pointer;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--el-border-color-light);

  .left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    float: right;
    width: max-content;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
    align-items: center;
  }
}
html.dark {
  .navbar {
    border-bottom: 1px solid var(--el-border-color-dark);
  }
}
</style>
