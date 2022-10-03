import { findAll as findAllDict } from '@/api/dict'
import { findAll as findAllSize } from '@/api/size'
import { IDict, IDictItem } from '@/model/Dict'
import { defineStore } from 'pinia'

type DictObj = {}

type Size = {
  id: number,
  itemName: string
}
export const useDictStore = defineStore('dict', {
  state: () => {
    return {
      dict: [],
      sizes: [],
    } as {
      dict: IDict[],
      sizes: Size[]
    }
  },
  actions: {
    async fetchDict() {
      const res = await findAllDict({})
      this.dict = res.data
    },
    async fetchSize() {
      const res = await findAllSize({})
      this.sizes = res.data
    }
  },
  getters: {
    dictObj(state) {
      return state.dict.reduce((a, b) => {
        a[b.dictName] = b.data
        return a
      }, {} as Record<string, IDictItem[]>)
    },
    sizeObj: (state) => {
      return state.sizes.reduce((a, b) => {
        a[b.id] = b.itemName
        return a
      }, {} as Record<string, string>)
    },
    colorArr(): IDictItem[] {
      return (this.dictObj as Record<string, IDictItem[]>)['颜色']
    },
    colorObj():  {
      return this.colorArr.reduce((a: any, b: any) => {
        a[b.id] = b.itemName
        return a
      }, {})
    },
    roleArr() {
      return (this.dictObj as any)['权限']
    },
    roleObj() {
      return this.roleArr.reduce((a: any, b: any) => {
        a[b.itemCode] = b.itemName
        return a
      }, {})
    }
  },
  persist: {
    enabled: true,
  }
})
