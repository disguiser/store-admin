import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebar = ref(true)
  const isDark = ref(false)
  function toggleSideBar() {
    sidebar.value = !sidebar.value
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
    toggleDark
  }
}, {
  persist: true
})
