<template>
  <n-menu :options="menuOptions" />
</template>
<script>
export default {
  name: "Sidebar"
}
</script>
<script setup>
import { h } from 'vue'
import { NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { usePermissionStore } from '@/store/permission'

function renderIcon (icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const permissionStore = usePermissionStore()
const menuOptions = permissionStore.routes.filter(e => !e.hidden).map(e => {
  if (e.children && e.children.length > 1) {
    return {
      label: e.meta.title,
      key: e.path,
      icon: renderIcon(e.meta.icon),
      children: e.children.filter(child => !child.hidden).map(child => {
        return {
          label: () => h(
            RouterLink,
            {
              to: {
                path: `${e.path}${child.path}`
              }
            },
            { default: () => child.meta.title }
          ),
          key: `${e.path}${child.path}`,
          icon: renderIcon(child.meta.icon),
        }
      })
    }
  } else {
    return {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              path: e.path
            }
          },
          { default: () => e.meta.title }
        ),
      key: e.path,
      icon: renderIcon(e.meta.icon)
    }
  }
})
</script>
