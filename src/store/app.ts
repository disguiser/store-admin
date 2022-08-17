import { darkTheme, GlobalTheme } from 'naive-ui'
import { defineStore } from 'pinia'

interface State {
  theme: GlobalTheme | null
}

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      theme: null
    } as State
  },
  actions: {
    toggleTheme() {
      if (this.theme === null) {
        this.theme = darkTheme
      }  else {
        this.theme = null
      }
    }
  }
})
