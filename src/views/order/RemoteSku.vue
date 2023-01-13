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
      :key="item.sku"
      :label="item.preSku"
      :value="item.sku"
    >
      <span style="float: left">{{ item.preSku }}</span>
      <span style="float: right">{{ item.sku }}</span>
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

function handleInput(sku: string) {
  console.log('handleInput')
  let choosen = skuOptions.value.find(e => e.sku === sku)
  emits('change', { goodsId: choosen.id, salePrice: choosen.salePrice, sku: choosen.sku })
  emits('update:modelValue', choosen.preSku)
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
  console.log('getList')
  loading.value = true
  try {
    const res = await findGoods({
      preSku: query
    })
    skuOptions.value = res.data.items.map((e: IGoods) => {
      return {
        id: e.id,
        sku: e.sku,
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
