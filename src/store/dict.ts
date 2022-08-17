import { findAll as findAllDict } from '@/api/dict'
import { findAll as findAllSize } from '@/api/size'
import { defineStore } from 'pinia'

type DictObj = {}

export const useDictStore = defineStore('dict', {
  state: () => {
    return {
      dict: new Array(),
      size: new Array(),
    }
  },
  actions: {
    async fetchDict() {
      const res = await findAllDict({})
      this.dict = res.data
    },
    async fetchSize() {
      const res = await findAllSize({})
      // res.data.forEach(e => {
      //   e.checked = false
      // })
      this.size = res.data
    }
  },
  getters: {
    dictObj(state) {
      return state.dict.reduce((a, b) => {
        a[b.dictName] = b.data
        return a
      }, {} as Record<string, Record<string, string>[]>)
    },
    sizeObj: (state) => {
      return state.size.reduce((a, b) => {
        a[b.id] = b.itemName
        return a
      })
    },
    colorObj() {
      return (this.dictObj as any)['颜色'].reduce((a: any, b: any) => {
        a[b.id] = b.itemName
        return a
      }, {})
    }
  },
  persist: {
    enabled: true,
  }
})
