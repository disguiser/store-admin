import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      sidebar: true
    }
  },
  actions: {
    toggleSideBar() {
      this.sidebar = !this.sidebar
    }
  },
  persist: {
    enabled: true,
  }
})
