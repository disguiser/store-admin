import { defineStore } from "pinia";

export const useErrorLogStore = defineStore('error', {
  state: () => {
    return {
      logs: new Array()
    }
  },
  actions: {
    addErrorLog(log: any) {
      this.logs.push(log)
    },
    clearErrorLog() {
      this.logs.splice(0)
    }
  }
})