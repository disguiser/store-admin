import { getVersions } from '@/api/version'
import { defineStore } from 'pinia'
import { useSizeGroupStore } from '@/store/sizeGroup'
import { useDeptStore } from '@/store/dept'
import { useDictStore } from '@/store/dict'
import { ref } from 'vue'

export const useVersionStore = defineStore('Version', () => {
  const versionObj = ref()
  async function checkVersion() {
    const sizeGroupStore = useSizeGroupStore()
    const deptStore = useDeptStore()
    const dictStore = useDictStore()

    let arr = []
    const res = await getVersions()
    const _versionObj = res.data.reduce((a: any, b: any) => {
      a[b.name] = b.v
      return a
    }, {})
    if (versionObj.value) {
      const needUpdate = res.data.map((e: any) => {
        if (versionObj.value[e.name] !== e.v) {
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
      if (needUpdate.includes('color')) {
        arr.push(dictStore.fetchColor())
      }
    } else {
      console.log('本地缓存没有 versionObj')
      arr = [
        sizeGroupStore.fetchList(),
        deptStore.fetchList(),
        dictStore.fetchDict(),
        dictStore.fetchSize(),
        dictStore.fetchColor()
      ]
    }
    versionObj.value = _versionObj
    if (arr.length > 0) {
      await Promise.all(arr)
    }
  }
  function clear() {
    versionObj.value = null
  }
  return {
    versionObj,
    checkVersion,
    clear
  }
}, {
  persist: true
})
