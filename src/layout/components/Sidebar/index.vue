<template>
  <el-scrollbar>
    <el-menu
      :default-active="activeIndex"
      class="sidebar-menu"
      :collapse="!appStore.sidebar"
      router
      :default-openeds="defaultOpens"
      :collapse-transition="false"
    >
      <template v-for="route in menus">
        <el-sub-menu
          v-if="route.multiChild"
          :index="route.path"
        >
          <template #title>
            <el-icon>
              <Icon :icon="route.meta?.icon" />
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
        <el-menu-item v-else :index="route.index" :data-test="route.index">
          <el-icon>
            <Icon :icon="route.meta?.icon" />
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
import { ref } from 'vue';
import { RouteRecordRaw, useRoute } from 'vue-router';
const appStore = useAppStore()

const permissionStore = usePermissionStore()

type MenuType = RouteRecordRaw & {
  multiChild?: boolean,
  index?: string
}
const menus: MenuType[] = []
let index;
const defaultOpens: string[] = []
for (const route of permissionStore.addRoutes.filter(e => !e.meta?.hidden)) {
  if (route.children?.length) {
    const childrenLength = route.children.filter((e: RouteRecordRaw) => !e.meta?.hidden).length
    if (childrenLength > 1) {
      menus.push({
        ...route,
        multiChild: true
      })
      defaultOpens.push(route.path)
      continue;
    } else if (childrenLength === 1) {
      if (route.path === '/') {
        index = '/' + route.children[0].path
      } else {
        index = route.path + '/' + route.children[0].path
      }
    }
  }
  index = route.path
  menus.push({
    ...route,
    index
  })
}

const route = useRoute()

const activeIndex = ref(route.path)

// activeIndex.value = '/' + route.path.split('/')[1]

function ifOnlyChild(route: RouteRecordRaw) {
  if (route.children) {
    const children = route.children.filter((e: RouteRecordRaw) => !e.meta?.hidden)
    if (children.length === 1) {
      if (route.path === '/') {
        return '/' + children[0].path
      } else {
        return route.path + '/' + children[0].path
      }
    }
  }
  return route.path
}
</script>
<style scoped>
.sidebar-menu {
  min-height: 100vh;
}
.el-menu {
  --el-menu-bg-color: #191a20;
  --el-menu-text-color: #bdbdc0;
  --el-menu-active-color: #ffffff;
  --el-menu-hover-bg-color: rgb(77, 77, 77);
}
</style>