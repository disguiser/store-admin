import { defineStore } from "pinia";
import { ref } from 'vue'

export const useErrorLogStore = defineStore('Error', () => {
  const logs = ref([])
  function addErrorLog(log: any) {
    logs.value.push(log)
  }
  function clearErrorLog() {
    logs.value.splice(0)
  }
  return {
    logs,
    addErrorLog,
    clearErrorLog
  }
}, {
  persist: {
    key: 'Error'
  }
})
