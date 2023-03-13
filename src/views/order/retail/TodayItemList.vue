<template>
  <table-container>
    <template #filter-container>
      <el-button type="primary" icon="Printer" @click="goPrint()">
        打印
      </el-button>
    </template>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="货号" prop="preSku" sortable />
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
      <el-table-column label="单价" prop="salePrice" sortable />
      <el-table-column label="数量" prop="amount" />
      <el-table-column label="小计" prop="subtotalMoney" />
      <el-table-column label="下单时间" prop="createTime" sortable width="130" align="center">
        <template #default="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </table-container>
</template>

<script setup lang="ts" name="TodayItemList">
import { findToday } from '@/api/orderGoods'
import TableContainer from '@/components/TableContainer.vue'
import { useDictStore } from '@/store/dict'
import dayjs from 'dayjs'
import { ref, reactive } from 'vue'
import { IRetailItem } from '@/model/RetailItem'
const { sizeMap, colorMap } = useDictStore()

const listQuery = reactive({
  sort: undefined
})

const listLoading = ref(false)
const list = ref<IRetailItem[]>()

getList()
function sortChange(data: any) {
  const { prop, order } = data
  if (order === 'ascending') {
    listQuery.sort = prop
  } else if (order === 'descending') {
    listQuery.sort = '-' + prop
  } else {
    listQuery.sort = ''
  }
  getList()
}
async function getList() {
  listLoading.value = true
  const response = await findToday(listQuery)
  list.value = response.data
  listLoading.value = false
}
async function goPrint() {
  localStorage.setItem('retailItemList', JSON.stringify(list.value))
  window.open(`/#/retail/print/daily-item-list`, '_blank')
}
</script>

<style lang="scss" scoped>
</style>
