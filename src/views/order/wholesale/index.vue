<template>
  <table-container>
    <template #filter-container>
      <el-input v-model="listQuery.customerName" clearable placeholder="客户姓名" style="width: 200px;" @keyup.enter="handleFilter" />
      <!-- <el-input v-model="listQuery.address" clearable placeholder="地址" style="width: 200px;" @keyup.enter="handleFilter" /> -->
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
        style="margin: 0 10px;vertical-align: bottom;"
      />
      <el-button type="primary" icon="Search" @click="handleFilter">
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
          <suspense>
            <detail :order-id="row.id" />
            <template #fallback>
              Loading...
            </template>
          </suspense>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="id" align="center" width="80" />
      <el-table-column label="客户姓名" prop="name" align="center" width="90" />
      <el-table-column label="地址" prop="address" align="center">
        <template #default="{row}">
          {{ addressFilter(row.address) }}{{ row.addressDetail }}
        </template>
      </el-table-column>
      <el-table-column label="总数量" prop="total" align="center" width="70" />
      <el-table-column label="总金额" prop="totalMoney" align="center" width="80" />
      <el-table-column label="下单时间" width="130" align="center">
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
            title="确定删除?"
            @confirm="handleRemove(row, $index)"
          >
            <template #reference>
              <el-button :loading="btnLoading" size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <pagination v-show="total>0" :total="total" v-model:current-page="listQuery.page" v-model:page-size="listQuery.limit" @current-change="getList" @size-change="getList" />
    </template>
  </table-container>
  <el-dialog title="下单" v-model="dialogVisible" :close-on-click-modal="false" width="90%" append-to-body>
    <fieldset>
      <legend>客户信息</legend>
      <el-form label-position="right" :inline="true" label-width="100px" :model="temp">
        <el-form-item label="姓名" prop="name">
          <el-select
            :modelValue="temp.name"
            placeholder="客户名称"
            filterable
            remote
            :remote-method="remoteCustomer"
            :loading="btnLoading"
            @focus="remoteCustomer"
            @update:modelValue="customerChange"
          >
            <el-option
              v-for="item in customerOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-select
            :modelValue="temp.mobile"
            filterable
            remote
            :remote-method="remoteCustomer"
            :loading="btnLoading"
            @focus="remoteCustomer"
            @update:modelValue="customerChange"
          >
            <el-option
              v-for="item in customerOptions"
              :key="item.mobile"
              :label="item.mobile"
              :value="item.mobile"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          {{ addressFilter(temp.address) }}
        </el-form-item>
      </el-form>
    </fieldset>
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

<script setup lang="ts" name="Order">
import TableContainer from '@/components/TableContainer.vue'
import { findByPage as findCustomers } from '@/api/customer'
import { findByPage as findOrders } from '@/api/order'
import Pagination from '@/components/Pagination/index.vue'; // secondary package based on el-pagination
import { useCheckPermission } from '@/hooks/useCheckPermission'
import { ICustomer } from '@/model/Customer'
import { CategoryEnum, IOrder, Order } from '@/model/Order'
import { addressFilter } from '@/utils/index'
import dayjs from 'dayjs'
import { reactive, ref } from 'vue'
import Detail from '../Detail.vue'
import GoodsTable from '../GoodsTable.vue'

import { ListItem, useHook } from '../hook'
console.log('wholesale')
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

temp.value = new Order(CategoryEnum.wholesale)
const debounceFlag = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  sort: '',
  category: 1,
  address: '',
  customerName: ''
})
const customerOptions = ref<ICustomer[]>([])

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
      endDate: dateRange.value[1].getTime()
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
function remoteCustomer(query: string) {
  if (query) {
    if (debounceFlag.value) {
      debounceFlag.value = false
      setTimeout(() => {
        debounceFlag.value = true
      }, 1000)
      btnLoading.value = true
      findCustomers({
        searchText: query
      }).then(res => {
        btnLoading.value = false
        customerOptions.value = res.data.items
      }).catch(err => {
        console.error(err)
        btnLoading.value = false
      })
    }
  } else {
    customerOptions.value = []
  }
}
function handleCreate() {
  if (!dialogVisible.value) {
    temp.value = new Order(CategoryEnum.wholesale)
    dialogVisible.value = true
  }
}
function customerChange(val: string) {
  let option = customerOptions.value.filter((e: ICustomer) => e.name === val || e.mobile === val)
  temp.value.name = option[0].name
  temp.value.mobile = option[0].mobile
  temp.value.address = option[0].address
  temp.value.buyer = option[0].id!
}
async function goPrint(order: IOrder) {
  // await this.$store.dispatch('order/setOrder', order)
  // this.$router.push(`/wholesale/print`)
  localStorage.setItem('order', JSON.stringify(order))
  window.open(`/#/wholesale/print`, '_blank')
}
</script>

<style lang="scss" scoped>
</style>
