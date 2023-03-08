import { findAll } from '@/api/dept'
import { IDept } from '@/model/Dept'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useDeptStore = defineStore('Dept', () => {
  const dept = ref<IDept[]>([])
  const deptMap = computed(() => {
    return dept.value.reduce((a, b) => {
      a.set(b.id, b.name)
      return a
    }, new Map<number, string>())
  })
  async function fetchList() {
    const res = await findAll({})
    dept.value = res.data
  }

  return { dept, deptMap, fetchList }
}, {
  persist: true
})