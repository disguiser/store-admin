<template>
  <el-select
    :modelValue="props.modelValue"
    filterable
    remote
    default-first-option
    :remote-method="debounced"
    :loading="loading"
    placeholder="货号"
    @update:modelValue="handleInput"
  >
    <el-option
      v-for="item in skuOptions"
      :key="item.id"
      :label="item.preSku"
      :value="item.id"
    >
      <span style="float: left">{{ item.preSku }}</span>
      <span style="float: right">{{ item.id }}</span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { findByPage as findGoods } from '@/api/goods'
import { IGoods } from '@/model/Goods';
import { ref } from 'vue'
import { debounce } from 'lodash-es';

const loading = ref(false)
const skuOptions = ref<IGoods[]>([])

const props = defineProps<{
  modelValue: string
}>()

const emits = defineEmits(['change', 'update:modelValue'])

function handleInput(id: number) {
  console.log('handleInput')
  const { preSku } = skuOptions.value.find(e => e.id === id)
  emits('change', id)
  emits('update:modelValue', preSku)
}
function debounced(query: string) {
  if (query !== '') {
    // console.log(query)
    debounce(function() {
      remoteSku(query)
    }, 1000)()
  }
}
async function remoteSku(query: string) {
  loading.value = true
  try {
    const res = await findGoods({
      preSku: query
    })
    skuOptions.value = res.data.items.map((e: IGoods) => {
      return {
        id: e.id,
        preSku: e.preSku,
        salePrice: e.salePrice
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>

</style>
