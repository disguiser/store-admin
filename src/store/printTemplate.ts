import { update as updateApi } from '@/api/printTemplate'
import { IPrintTemplate, PrintTemplate } from '@/model/PrintTemplate'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePrintTemplateStore = defineStore(PrintTemplate.name, () => {
  const currentTemplate = ref()
  function open(template: IPrintTemplate) {
    currentTemplate.value = template
  }
  async function update(template: IPrintTemplate) {
    await updateApi(template)
    currentTemplate.value = template
  }
  return {
    currentTemplate,
    open,
    update
  }
}, {
  persist: {
    key: PrintTemplate.name
  }
})
