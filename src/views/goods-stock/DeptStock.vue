<template>
  <div>
    
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
const res = await findStock({ goodsId, deptId })
const list = ref<IStock>(res.data)
const emits = defineEmits(['stockUpdated'])
function stockUpdated(list) {
  emit('stockUpdated', list)
}
</script>

<style lang="scss" scoped>
</style>
