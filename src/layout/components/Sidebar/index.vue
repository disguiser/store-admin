<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeIndex"
      class="sidebar-menu"
      :collapse="!appStore.sidebar"
      router
    >
      <template v-for="route in permissionStore.routes.filter(e => !e.hidden)">
        <el-sub-menu
          v-if="route.children?.length && route.children.filter((e: RouteChild) => !e.hidden).length > 1"
          :index="route.path"
        >
        <template #title>
            <el-icon>
              <Icon :icon="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta.title }}</span>
          </template>
          <el-menu-item
            v-for="child in route.children"
            :index="`${route.path}/${child.path}`"
            :data-test="`${route.path}/${child.path}`"
          >
            {{ child.meta?.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="route.path" :data-test="route.path">
          <el-icon>
            <Icon :icon="route.meta.icon" />
          </el-icon>
          <template #title>{{ route.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script lang="ts" setup name="Sidebar">
import { usePermissionStore } from '@/store/permission'
import { Icon } from '@iconify/vue';
import { useAppStore } from '@/store/app'
import { RouteChild } from '@/router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const appStore = useAppStore()

const permissionStore = usePermissionStore()

const route = useRoute()

const activeIndex = ref(route.path)

// activeIndex.value = '/' + route.path.split('/')[1]
</script>
<style>
.sidebar-menu {
  width: 200px;
  min-height: 100vh;
}
</style>