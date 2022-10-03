import { findAll } from '@/api/sizeGroup'
import { IDictItem } from '@/model/Dict'
import { ISizeGroup } from '@/model/SizeGroup'
import { defineStore } from 'pinia'

export const useSizeGroupStore = defineStore({
  id: 'sizeGroup',
  state: () => {
    return {
      sizeGroup: [] as ISizeGroup[],
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
      return state.sizeGroup.reduce((a: Record<string, IDictItem[]>, b) => {
        a[b.id!.toString()] = b.data
        return a
      }, {})
    }
  },
  persist: {
    enabled: true
  }
})
