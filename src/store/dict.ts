import { findAll as findAllDict } from '@/api/dict'
import { findAll as findAllSize } from '@/api/size'
import { findAll as findAllColor } from '@/api/color'
import { IDict, IDictItem, Dict } from '@/model/Dict'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useDictStore = defineStore(Dict.name, () => {
  const dict = ref<IDict[]>([])
  const sizeList = ref<IDictItem[]>([])
  const colorList = ref<IDictItem[]>([])

  const dictMap = computed(() => {
    return dict.value.reduce((a, b) => {
      a.set(b.dictName, b.data)
      return a
    }, new Map<string, IDictItem[]>())
  })
  const sizeMap = computed(() => {
    return sizeList.value.reduce((a, b) => {
      a.set(b.id, b.itemName)
      return a
    }, new Map<number, string>())
  })
  const colorMap = computed(() =>  {
    return colorList.value.reduce((a, b) => {
      a.set(b.id, b.itemName)
      return a
    }, new Map<number, string>())
  })
  const roleList = computed(() => {
    return dictMap.value.get('权限')
  })
  const roleMap = computed(() => {
    return roleList.value.reduce((a, b) => {
      a.set(b.itemCode, b.itemName)
      return a
    }, new Map<string, string>())
  })
  const fabricList = computed(() => {
    return dictMap.value.get('面料')
  })
  const levelList = computed(() => {
    return dictMap.value.get('等级')
  })

  async function fetchDict() {
    const res = await findAllDict({})
    dict.value = res.data
  }
  async function fetchSize() {
    const res = await findAllSize({})
    sizeList.value = res.data
  }
  async function fetchColor() {
    const res = await findAllColor({})
    colorList.value = res.data
  }
  return {
    dict,
    sizeList,
    dictMap,
    sizeMap,
    colorList,
    colorMap,
    roleList,
    roleMap,
    fabricList,
    levelList,
    fetchDict,
    fetchSize,
    fetchColor
  }
}, {
  persist: true
})
