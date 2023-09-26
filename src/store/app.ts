import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useAppStore = defineStore('App', () => {
  const maximize = ref(false)
  const sidebar = ref(true)
  const isDark = ref(false)
  const refreshing = ref(false)
  function toggleSideBar(val?: boolean) {
    if (typeof val === 'boolean') {
      sidebar.value = val
    } else {
      sidebar.value = !sidebar.value
    }
  }
  function toggleDark() {
    isDark.value = !isDark.value
  }
  watchEffect(() => {
    const body = document.documentElement as HTMLElement;
    if (isDark.value) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
  })
  return {
    sidebar,
    toggleSideBar,
    isDark,
    toggleDark,
    maximize,
    refreshing
  }
}, {
  persist: true
})
