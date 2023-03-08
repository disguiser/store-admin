import { findAll } from '@/api/sizeGroup'
import { ISizeGroup, SizeGroup } from '@/model/SizeGroup'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSizeGroupStore = defineStore(SizeGroup.name, () => {
  const sizeGroupList = ref<ISizeGroup[]>()
  const sizeGroupMap = computed(() => {
    return sizeGroupList.value.reduce((a: Map<number, number[]>, b: ISizeGroup) => {
      a.set(b.id, b.data)
      return a
    }, new Map())
  })
  async function fetchList() {
    const { data } = await findAll({})
    sizeGroupList.value = data
  }
  return {
    sizeGroupList,
    sizeGroupMap,
    fetchList
  }
}, {
  persist: {
    key: SizeGroup.name
  }
})
