<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      show-trigger
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
    >
      <sidebar />
    </n-layout-sider>
    <n-layout>
      <div :class="{hasTagsView:true}" class="main-container">
        <div>
          <navbar />
          <tags-view />
        </div>
        <app-main />
      </div>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts" name="Layout">
import { AppMain, Navbar, Sidebar, TagsView } from './components'
</script>
