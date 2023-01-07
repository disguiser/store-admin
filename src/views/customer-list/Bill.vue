<template>
  <el-table
    v-loading="loading"
    :data="list"
  >
    <el-table-column label="金额(元)" prop="amount">
      <template #default="{row}">
        <template v-if="row.edit">
          -
          <el-input-number
            v-model="temp.amount"
            size="small"
            :step="100"
            :min="0"
          />
        </template>
        <span v-else>{{ row.amount }}</span>
      </template>
    </el-table-column>
    <el-table-column label="支付方式" prop="paymentChannel">
      <template #default="{row}">
        <el-select
          v-if="row.edit"
          v-model="temp.paymentChannel"
          size="small"
        >
          <el-option v-for="e of PaymentChannelList" :value="e.value" :label="e.key"></el-option>
        </el-select>
        <span v-else>{{ PaymentChannelMap.get(row.paymentChannel) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="时间" prop="paymentChannel">
      <template #default="{row}">
        <el-date-picker
          v-if="row.edit"
          v-model="temp.date"
          type="date"
        />
        <span v-else>{{ dayjs(row.date).format('YYYY-MM-DD') }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center">
      <template #header>
        <el-button
          type="success"
          size="small"
          @click="handleCreate()"
        >
          新增
        </el-button>
      </template>
      <template #default="{row, $index}">
        <template v-if="row.edit">
          <el-button
            type="warning"
            size="small"
            @click="handleConfirm(row)"
          >
            确认
          </el-button>
          <el-button
            type="info"
            size="small"
            @click="handleCancel(row)"
          >
            取消
          </el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleRemove(row, $index)"
          >
            删除
          </el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { IBill, Bill, PaymentChannelList, PaymentChannelMap } from '@/model/Bill';
import dayjs from 'dayjs';
import { ref } from 'vue';
import { findAll, remove, create, update } from '@/api/bill'
import { ElMessageBox } from 'element-plus';

const { customerId } = defineProps<{
  customerId: number
}>()

const emits = defineEmits(['debtChange'])

type BillType = IBill & {
  edit: boolean
}

const list = ref<BillType[]>([])
const loading = ref(false)
const temp = ref<IBill>(new Bill({ customerId }))

getList()
async function getList() {
  loading.value = true
  const { data } = await findAll({ customerId })
  list.value = data
  loading.value = false
}
async function handleRemove(row: BillType, $index: number) {
  loading.value = true
  await remove(row.id)
  list.value.splice($index, 1)
  loading.value = false
  emits('debtChange')
}
function handleCreate() {
  temp.value = new Bill({ customerId })
  list.value.push({
    ...temp.value,
    edit: true
  })
}
function handleUpdate(row: BillType) {
  temp.value = new Bill({
    ...row,
    amount: -row.amount
  })
  row.edit = true
}
async function handleConfirm(row: BillType) {
  if (!temp.value.amount) {
    ElMessageBox.alert('你还没有填写金额')
    return
  } else {
    let res
    if (row.id) {
      res = await update({
        ...temp.value,
        amount: -temp.value.amount
      })
    } else {
      res = await create({
        ...temp.value,
        amount: -temp.value.amount
      })
      row.id = res.data
    }
    row.amount = -temp.value.amount
    row.paymentChannel = temp.value.paymentChannel
    row.date = temp.value.date
    row.edit = false
    emits('debtChange')
  }
}
async function handleCancel(row: BillType) {
  row.edit = false
  if (!row.id) {
    list.value.pop()
  }
}
</script>

<style scoped>

</style>