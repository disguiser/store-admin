<template>
  <div class="navbar">
    <!-- <hamburger :is-active="appStore.sidebar" style="float: left;height: 100%;line-height: 46px;cursor: pointer;" @toggleClick="appStore.toggleSideBar" /> -->
    <el-button text :icon="appStore.sidebar?'Fold':'Expand'" style="float: left;height: 100%;font-size: large;" @click="appStore.toggleSideBar"></el-button>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <ngiht-shift />
      <account-btn />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import NgihtShift from './NgihtShift.vue'
import AccountBtn from './AccountBtn.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { useAppStore } from '@/store/app';
const appStore = useAppStore()
</script>

<style lang="scss" scoped>
sup {
  top: 10px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    width: max-content;
    height: 100%;
    margin-right: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
    align-items: center;
  }
}
</style>
