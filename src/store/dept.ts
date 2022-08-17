import { findAll } from '@/api/dept'
import { defineStore } from 'pinia'

export const useDeptStore = defineStore({
  id: 'dept',
  state: () => {
    return {
      dept: new Array(),
    }
  },
  actions: {
    async fetchList() {
      const res = await findAll({})
      this.dept = res.data
    }
  },
  getters: {
    deptObj: (state) => {
      return state.dept.reduce((a, b) => {
        a[b.id] = b.name
        return a
      }, {})
    }
  }
})
