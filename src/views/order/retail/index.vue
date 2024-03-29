<template>
  <table-container>
    <template #filter-container>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :clearable="false"
        :shortcuts="pickerOptions"
        style="margin: 0 8px"
      />
      <el-button type="primary" icon="Search" @click="handleFilter()">
        搜索
      </el-button>
      <el-button v-if="useCheckPermission(['Admin', 'Waiter'])" style="margin-left: 10px;" type="primary" icon="Plus" @click="handleCreate">
        下单
      </el-button>
    </template>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="list"
      border
      fit
      show-summary
      :summary-method="getSummaries"
      style="width: 100%;height: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template #default="{row}">
          <detail :order-id="row.id" />
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="id" align="center" />
      <el-table-column label="总数量" prop="total" align="center" />
      <el-table-column label="总金额" prop="totalMoney" align="center" />
      <el-table-column label="下单时间" prop="createTime" width="130" align="center">
        <template #default="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
  
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template #default="{row, $index}">
          <el-button type="primary" size="small" @click="goPrint(row)">
            打印
          </el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认删除?"
            @confirm="handleRemove(row, $index)"
          >
            <template #reference>
              <el-button size="small" type="danger">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <pagination v-show="total>0" :total="total" v-model:current-page="listQuery.page" v-model:page-size="listQuery.limit" @current-change="getList" @size-change="getList" />
    </template>
  </table-container>
  <el-dialog title="下单" v-model="dialogVisible" width="90%" :close-on-click-modal="false" append-to-body>
    <goods-table :temp="temp" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" :loading="btnLoading" @click="createData()">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import TableContainer from '@/components/TableContainer.vue'
import { findByPage as findOrders } from '@/api/order'
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import { CategoryEnum, Order } from '@/model/Order'
import { reactive } from 'vue'
import Detail from '../Detail.vue'
import GoodsTable from '../GoodsTable.vue'
import dayjs from 'dayjs'
import { useHook } from '../hook'
import { useCheckPermission } from '@/hooks/useCheckPermission'

defineOptions({
  name: 'Retail'
})

const {
  list,
  total,
  listLoading,
  temp,
  dateRange,
  pickerOptions,
  btnLoading,
  dialogVisible,
  getSummaries,
  createData,
  handleRemove
} = useHook()

temp.value = new Order(CategoryEnum.retail)
const listQuery = reactive({
  page: 1,
  limit: 20,
  sort: undefined,
  category: 2
})
getList()
function handleCreate() {
  if (!dialogVisible.value) {
    temp.value = new Order(CategoryEnum.retail)
    dialogVisible.value = true
  }
}
function sortChange(data: any) {
  const { prop, order } = data
  if (order === 'ascending') {
    listQuery.sort = prop
  } else if (order === 'descending') {
    listQuery.sort = '-' + prop
  } else {
    listQuery.sort = ''
  }
  handleFilter()
}
function handleFilter() {
  listQuery.page = 1
  getList()
}
async function getList() {
  listLoading.value = true
  let data = {}
  if (dateRange.value && dateRange.value[0] && dateRange.value[1]) {
    data = {
      startDate: dateRange.value[0].getTime(),
      endDate: dateRange.value[1].getTime(),
    }
  }
  const response = await findOrders({
    ...listQuery,
    ...data
  })
  list.value = response.data.items
  total.value = response.data.total
  listLoading.value = false
}
async function goPrint(order: any) {
  localStorage.setItem('order', JSON.stringify(order))
  window.open(`/#/retail/print`, '_blank')
}
</script>

<style lang="scss" scoped>
</style>
