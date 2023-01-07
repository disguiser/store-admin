<template>
  <table-container>
    <template #filter-container>
      <el-input v-model="barcode" clearable placeholder="手动输入编码" style="width: 200px;" class="filter-item" @keyup.enter.native="manualAdd" />
    </template>
    <el-table
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="款号" prop="barcode" align="center" />
      <el-table-column label="品名" prop="name" align="center" />
      <el-table-column label="颜色" prop="color" align="center" />
      <el-table-column label="尺码" prop="size" align="center" />
      <el-table-column label="售价" prop="salePrice" align="center">
        <template #default="{row}">
          <el-input-number v-model="row.salePrice" :min="0" :step="10" />
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template #default="{row}">
          <el-input-number v-model="row.amount" :min="1" :step="1" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template #default="{$index}">
          <el-popconfirm
            title="确认删除该商品?"
            @confirm="handleRemove($index)"
          >
            <el-button slot="reference" size="small" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </table-container>
</template>

<script lang="ts" setup>
import { findOneBySku } from '@/api/goods'
import { useBarcodeScan } from '@/hooks/useBarcodeScan'
import { IGoods } from '@/model/Goods';
import { IStock } from '@/model/Stock';
import { ref } from 'vue';
import TableContainer from '@/components/TableContainer.vue';

type GoodsStock = Pick<IGoods, 'sku' | 'name' | 'salePrice'> & 
  Pick<IStock, 'color' | 'size'> &
  {
    amount: number
  }
const list = ref<GoodsStock[]>([])
const barcode = ref('')

const barcodeScan = ref()

function handleRemove(index: number) {
  list.value.splice(index, 1)
}
function manualAdd() {
  barcodeScan.value.add(barcode.value)
}

useBarcodeScan(scaned)
async function scaned(sku: string, color: number, size: number) {
  let res = await findOneBySku(sku)
  let item = list.value.filter(e => e.sku === barcode.value)
  if (item.length > 0) {
    item[0].amount += 1
  } else {
    list.value.push({
      sku,
      color,
      size,
      name: res.data.name,
      salePrice: res.data.salePrice,
      amount: 1
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
