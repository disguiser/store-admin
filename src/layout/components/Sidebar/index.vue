<template>
  <el-scrollbar>
    <el-menu
      class="sidebar-menu"
      :collapse="!appStore.sidebar"
      router
    >
      <template v-for="route in permissionStore.routes.filter(e => !e.hidden)">
        <el-sub-menu
          v-if="route.children?.length && route.children.filter((e: MyRouteRecordRaw) => !e.hidden).length > 1"
          :index="route.path"
        >
          <template #title>
            <el-icon>
              <Icon :icon="route.meta.icon" />
            </el-icon>
            {{ route.meta.title }}
          </template>
          <el-menu-item
            v-for="child in route.children"
            :index="`${route.path}/${child.path}`"
          >
            {{ child.meta?.title }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="route.path">
          <template #title>
            <el-icon>
              <Icon :icon="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>
<script lang="ts" setup name="Sidebar">
import { usePermissionStore } from '@/store/permission'
import { Icon } from '@iconify/vue';
import { useAppStore } from '@/store/app'
import { MyRouteRecordRaw } from '@/router';
const appStore = useAppStore()

const permissionStore = usePermissionStore()
</script>
<style>
.sidebar-menu {
  width: 200px;
  min-height: 100vh;
}
</style>