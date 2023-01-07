<template>
  <div v-loading="loading">
    <stock
      :list="list"
      :goods-id="goodsId"
      :dept-id="deptId"
      :size-group="sizeGroup"
      @refresh="refresh"
      @stockUpdated="stockUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { list as findStock } from '@/api/stock'
import { IStock } from '@/model/Stock';
// import VueBarcode from '@chenfengyuan/vue-barcode'
import Stock from '@/views/goods-list/Stock.vue'
import { ref } from 'vue';
const { goodsId, deptId } = defineProps<{
  goodsId: number,
  deptId: number,
  sizeGroup: number
}>()
const list = ref<IStock[]>()
const loading = ref(false)
async function getList() {
  loading.value = true
  const { data } = await findStock({ goodsId, deptId })
  list.value = data
  loading.value = false
}
getList()
const emit = defineEmits(['stockUpdated'])
async function refresh() {
  await getList()
  emit('stockUpdated', list.value)
}
function stockUpdated() {
  emit('stockUpdated', list.value)
}
</script>

<style lang="scss" scoped>
</style>
