<template>
  <el-scrollbar style="height: 100%;">
    <el-menu
      :default-active="activeIndex"
      :collapse="!appStore.sidebar"
      router
      :default-openeds="defaultOpens"
      :collapse-transition="false"
      style="min-height: 100vh;"
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
<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useAppStore } from '@/store/app'
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';

defineOptions({
  name: 'Sidebar'
})

const appStore = useAppStore()
const authStore = useAuthStore()
type MenuType = Menu.MenuOptions & {
  multiChild?: boolean,
  index?: string
}
const menus: MenuType[] = []
let index;
const defaultOpens: string[] = []
for (const route of authStore.authMenuList.filter(e => !e.meta?.isHide)) {
  if (route.children?.length) {
    const childrenLength = route.children.filter((e: Menu.MenuOptions) => !e.meta?.isHide).length
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

</script>
<style lang="scss">
</style>