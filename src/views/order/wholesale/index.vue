<template>
  <div class="page-container">
    <div class="filter-container">
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
        :shortcuts="pickerOptions"
        style="margin: 0 10px;vertical-align: bottom;"
      />
      <el-button type="primary" icon="Search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="useCheckPermission(['Admin', 'Waiter'])" style="margin-left: 10px;" type="primary" icon="Plus" @click="handleCreate">
        下单
      </el-button>
    </div>

    <el-table
      ref="table"
      :key="key"
      v-loading="listLoading"
      :data="list"
      border
      fit
      show-summary
      :summary-method="getSummaries"
      style="width: 100%;"
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
      <el-table-column label="订单编号" prop="id" align="center" />
      <el-table-column label="客户姓名" prop="name" align="center" />
      <el-table-column label="地址" prop="address" align="center">
        <template #default="{row}">
          {{ addressFilter(row.address) }}{{ row.addressDetail }}
        </template>
      </el-table-column>
      <el-table-column label="总数量" prop="total" align="center" />
      <el-table-column label="总金额" prop="totalMoney" align="center" />
      <el-table-column label="收款状态" width="80" align="center">
        <template #default="{row}">
          <el-button
            :loading="row.loading"
            :type="row.paymentStatus ? 'success' : 'danger'"
            size="small"
            @click="changePaymentStatus(row)"
          >
            {{ row.paymentStatus ? '结清' : '欠款' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center">
        <template #default="{row}">
          <span>{{ parseTime(new Date(row.orderTime), '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="70" class-name="small-padding fixed-width">
        <template #default="{row, $index}">
          <div class="btns-clomn">
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
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="下单" :visible.sync="dialogVisible" :close-on-click-modal="false" width="90%">
      <fieldset>
        <legend>客户信息</legend>
        <el-form ref="dataForm" label-position="right" :inline="true" label-width="100px" :model="temp">
          <el-form-item label="姓名" prop="name">
            <el-select
              :value="temp.name"
              placeholder="客户名称"
              filterable
              remote
              :remote-method="remoteCustomer"
              :loading="btnLoading"
              @focus="remoteCustomer"
              @input="customerChange"
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
              :value="temp.mobile"
              filterable
              remote
              :remote-method="remoteCustomer"
              :loading="btnLoading"
              @focus="remoteCustomer"
              @input="customerChange"
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
  </div>
</template>

<script setup lang="ts">
import { findByPage as findOrders, update, create, remove } from '@/api/order'
import { findByPage as findCustomers } from '@/api/customer'
import Pagination from '@/components/Pagination/index.vue' // secondary package based on el-pagination
import Detail from '../Detail.vue'
import GoodsTable from '../GoodsTable.vue'
import { reactive, ref } from 'vue'
import { ICustomer } from '@/model/Customer'
import { IOrder, CategoryEnum, Order } from '@/model/Order'
import { ElNotification } from 'element-plus'
import { addressFilter, parseTime } from '@/utils/index'
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import { MessageBox } from '@element-plus/icons-vue'
import { useCheckPermission } from '@/hooks/useCheckPermission'

const debounceFlag = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  sort: '',
  category: 1,
  address: '',
  customerName: ''
})
type ListItem = IOrder & {
  loading?: boolean
}
const list = ref<ListItem[]>([])
const dateRange = ref<Date[]>([])
const customerOptions = ref<ICustomer[]>([])
const listLoading = ref(true)
const total = ref(0)
const key = ref(0)
const temp = ref<IOrder>(new Order(CategoryEnum.wholesale))
const dialogVisible = ref(false)
const btnLoading = ref(false)
const pickerOptions = [{
  text: '最近一周',
  value: () => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    return [start, end]
  }
}, {
  text: '最近一个月',
  value: () => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return [start, end]
  }
}, {
  text: '最近三个月',
  value: () => {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    return [start, end]
  }
}]

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
  if (dateRange.value && dateRange.value.length === 2) {
    data = {
      startDate: dateRange.value[0].getTime(),
      endDate: dateRange.value[1].getTime()
    }
  }
  const response = await findOrders(listQuery, data)
  list.value = response.data.items
  total.value = response.data.total
  listLoading.value = false
}
interface SummaryMethodProps<T = IOrder> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
function getSummaries(param: SummaryMethodProps) {
  const { columns, data } = param
  const sums: string[] = []
  if (!listLoading.value) {
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = ''
        return
      } else if (index === 1) {
        sums[index] = '合计'
        return
      }
      if (column.property === 'total') {
        sums[index] = data.reduce((a, b) => {
          a += b.total
          return a
        }, 0) + '件'
      } else if (column.property === 'totalMoney') {
        sums[index] = data.reduce((a, b) => {
          a += b.totalMoney
          return a
        }, 0) + '元'
      }
    })
  }
  return sums
}
async function changePaymentStatus(row: ListItem) {
  try {
    row.loading = true
    await update({
      id: row.id,
      totalMoney: row.totalMoney,
      buyer: row.buyer,
      paymentStatus: row.paymentStatus === 1 ? 0 : 1
    })
    row.paymentStatus = row.paymentStatus === 1 ? 0 : 1
  } catch (error) {
    console.error(error)
  } finally {
    row.loading = false
  }
}
function remoteCustomer(query: string) {
  if (query) {
    if (debounceFlag.value) {
      debounceFlag.value = false
      setTimeout(() => {
        debounceFlag.value = true
      }, 500)
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
async function createData() {
  const arr: string[] = []
  for (let e of temp.value.goodsList) {
    // 必填
    if (!e.preSku || !e.color || !e.size || !e.subtotalMoney || !e.amount) {
      MessageBox.alert('内容不能为空!')
      return
    }
    // 选项防重复
    let a = e.sku + e.color + e.size
    if (!arr.includes(a)) {
      arr.push(a)
    } else {
      MessageBox.alert('货号颜色尺码不能重复!')
      return
    }
  }
  btnLoading.value = true
  try {
    const res = await create(temp.value)
    temp.value.orderTime = new Date()
    temp.value.id = res.data
    list.value.unshift(temp.value)
    dialogVisible.value = false
    ElNotification({
      title: '成功',
      message: '下单成功',
      type: 'success',
      duration: 2000
    })
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    btnLoading.value = false
  }
}
async function handleRemove(row: IOrder, $index: number) {
  btnLoading.value = true
  try {
    await remove(row.id!)
    list.value.splice($index, 1)
    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success',
      duration: 2000
    })
  } catch (error) {
    console.error(error)
  } finally {
    btnLoading.value = false
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
.btns-clomn {
  display: flex;
  flex-direction: column;
  height: 100px;
  justify-content: space-around;
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
