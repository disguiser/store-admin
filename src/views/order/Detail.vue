<template>
  <el-table
    :data="list"
    style="width: 100%"
  >
    <el-table-column label="货号" prop="preSku" />
    <el-table-column label="颜色" prop="color">
      <template #default="{row}">
        <span>{{ colorObj[row.color] }}</span>
      </template>
    </el-table-column>
    <el-table-column label="尺码" prop="size">
      <template #default="{row}">
        <span>{{ sizeObj[row.size] }}</span>
      </template>
    </el-table-column>
    <el-table-column label="单价" prop="salePrice" />
    <el-table-column label="数量" prop="amount" />
  </el-table>
</template>

<script setup lang="ts">
import { getDetailByOrderId } from '@/api/order'
import { IOrderGoods } from '@/model/Order';
import { useDictStore } from '@/store/dict';

const { orderId } = defineProps<{
  orderId: number
}>()
const { sizeObj, colorObj } = useDictStore()

const res = await getDetailByOrderId(orderId)
const list: IOrderGoods[] = res.data.items
</script>
