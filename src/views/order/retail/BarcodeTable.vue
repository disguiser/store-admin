<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="barcode" clearable placeholder="手动输入编码" style="width: 200px;" class="filter-item" @keyup.enter.native="manualAdd" />
    </div>

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
        <template slot-scope="{row}">
          <el-input-number v-model="row.salePrice" :min="0" :step="10" />
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="{row}">
          <el-input-number v-model="row.amount" :min="1" :step="1" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{$index}">
          <el-popconfirm
            title="确认删除该商品?"
            @confirm="handleRemove($index)"
          >
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <barcode-scan ref="barcodeScan" @scaned="scaned" />
  </div>
</template>

<script lang="ts" setup>
import { findOneBySku } from '@/api/goods'
import BarcodeScan from '@/components/BarcodeScan.vue'
import { IGoods } from '@/model/Goods';
import { ref } from 'vue';

const list = ref<IGoods[]>([])
const barcode = ref('')

function handleRemove(index: number) {
  list.value.splice(index, 1)
}
function manualAdd() {
  this.$refs.barcodeScan.add(this.barcode)
}
async function scaned({ sku, color, size }) {
  let res = await findOneBySku(sku)
  let item = this.list.filter(e => e.sku === this.barcode)
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
