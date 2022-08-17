import { getVersions } from '@/api/version'
import { defineStore } from 'pinia'
import { useSizeGroupStore } from '@/store/sizeGroup'
import { useDeptStore } from '@/store/dept'
import { useDictStore } from '@/store/dict'

export const useVersionStore = defineStore('version', {
  state: () => {
    return {
      versionObj: null
    }
  },
  actions: {
    async checkVersion() {
      const sizeGroupStore = useSizeGroupStore()
      const deptStore = useDeptStore()
      const dictStore = useDictStore()

      let arr = []
      let res = await getVersions()
      let _versionObj = res.data.reduce((a: any, b: any) => {
        a[b.name] = b.v
        return a
      }, {})
      if (this.versionObj) {
        let needUpdate = res.data.map((e: any) => {
          if (this.versionObj && this.versionObj[e.name] !== e.v) {
            return e.name
          }
        })
        if (needUpdate.includes('sizeGroup')) {
          arr.push(sizeGroupStore.fetchList())
        }
        if (needUpdate.includes('dept')) {
          arr.push(deptStore.fetchList())
        }
        if (needUpdate.includes('dict')) {
          arr.push(dictStore.fetchDict())
        }
        if (needUpdate.includes('size')) {
          arr.push(dictStore.fetchSize())
        }
      } else {
        console.log('本地缓存没有 versionObj')
        arr = [
          sizeGroupStore.fetchList(),
          deptStore.fetchList(),
          dictStore.fetchDict(),
          dictStore.fetchSize()
        ]
      }
      this.versionObj = _versionObj
      if (arr.length > 0) {
        await Promise.all(arr)
      }
    },
    clear() {
      this.versionObj = null
    }
  },
  persist: {
    enabled: true,
  }
})
