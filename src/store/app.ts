import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebar = ref(true)
  function toggleSideBar() {
    sidebar.value = !sidebar.value
  }
  return {
    sidebar,
    toggleSideBar
  }
}, {
  persist: true
})
