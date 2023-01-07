<template>
  <el-table
    :data="list"
    style="width: 100%"
  >
    <el-table-column label="货号" prop="preSku" />
    <el-table-column label="颜色" prop="color">
      <template #default="{row}">
        <span>{{ colorMap.get(row.color) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="尺码" prop="size">
      <template #default="{row}">
        <span>{{ sizeMap.get(row.size) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="单价" prop="salePrice" />
    <el-table-column label="数量" prop="amount" />
    <el-table-column v-if="route.path === '/retail/list'" label="操作" align="center" width="60">
      <template #default="{row, $index}">
        <el-button size="small" type="warning" @click="handleReturn(row, $index)">
          退换
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { getDetailByOrderId } from '@/api/order'
import { IOrderGoods } from '@/model/Order';
import { useDictStore } from '@/store/dict';
import { useRoute } from 'vue-router';

const { orderId } = defineProps<{
  orderId: number
}>()
const { sizeMap, colorMap } = useDictStore()

const route = useRoute()

const res = await getDetailByOrderId(orderId)
const list: IOrderGoods[] = res.data.items
function handleReturn(row: IOrderGoods, $index: number) {

}
</script>
