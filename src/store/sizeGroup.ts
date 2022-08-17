import { findAll } from '@/api/sizeGroup'
import { defineStore } from 'pinia'

export const useSizeGroupStore = defineStore({
  id: 'sizeGroup',
  state: () => {
    return {
      sizeGroup: new Array(),
    }
  },
  actions: {
    async fetchList() {
      const res = await findAll({})
      this.sizeGroup = res.data
    }
  },
  getters: {
    sizeGroupObj: (state) => {
      return state.sizeGroup.reduce((a, b) => {
        a[b.id] = b.data
        return a
      }, {})
    }
  }
})
