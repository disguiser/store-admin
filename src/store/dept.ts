import { findAll } from '@/api/dept'
import { defineStore } from 'pinia'
import { Dept, IDept } from '@/model/Dept'
import { computed, ref } from 'vue'

export const useDeptStore = defineStore(Dept.name, () => {
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
  persist: {
    key: Dept.name
  }
})