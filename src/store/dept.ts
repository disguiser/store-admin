import { findAll } from '@/api/dept'
import { defineStore } from 'pinia'
import { Dept } from '@/model/Dept'
import { computed, ref } from 'vue'
// export const useDeptStore = defineStore({
//   id: 'dept',
//   state: () => {
//     return {
//       dept: new Array(),
//     }
//   },
//   actions: {
//     async fetchList() {
//       const res = await findAll({})
//       this.dept = res.data
//     }
//   },
//   getters: {
//     deptObj: (state) => {
//       return state.dept.reduce((a, b) => {
//         a[b.id] = b.name
//         return a
//       }, {})
//     }
//   },
//   persist: true
// })

export const useDeptStore = defineStore(Dept.name, () => {
  const dept = ref([])
  const deptObj = computed(() => {
    return dept.value.reduce((a, b) => {
      a[b.id] = b.name
      return a
    }, {})
  })
  async function fetchList() {
    const res = await findAll({})
    dept.value = res.data
  }

  const persist = true
  return { dept, deptObj, fetchList, persist }
}, {
  persist: true,
})