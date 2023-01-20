<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.createDate" value-format="yyyy-MM-dd" type="date" placeholder="充值日期" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="Edit" @click="handleCreate(formRef)">
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="充值金额" prop="chargeAmount" align="center" />
      <el-table-column label="赠送金额" prop="giveAmount" align="center" />
      <el-table-column label="充值时间" prop="createTime" align="center">
        <template #default="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:current-page="listQuery.page"
      v-model:page-size="listQuery.limit"
      @current-change="getList"
      @size-change="getList"
    />

    <el-dialog
      :title="dialogStatus"
      v-model="infoDialogVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="formRef" :rules="rules" label-position="right" label-width="100px" :model="temp">
        <el-form-item label="充值金额" prop="chargeAmount">
          <el-input v-if="infoDialogVisible" v-model="temp.chargeAmount" type="number" v-focus />
        </el-form-item>
        <el-form-item label="赠送金额" prop="giveAmount">
          <el-input v-model="temp.giveAmount" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="createData(formRef)">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="ChargeRecordList">
import { create, findByPage } from '@/api/chargeRecord';
import Pagination from '@/components/Pagination/index.vue';
import { ChargeRecord, IChargeRecord } from '@/model/ChargeRecord';
import dayjs from 'dayjs';
import { ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const props = defineProps<{
  vipId: number
}>()

const list = ref<IChargeRecord[]>()
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  vipId: props.vipId,
  createDate: undefined,
  sort: undefined
})
const temp = ref<IChargeRecord>(new ChargeRecord({ vipId: props.vipId }))
const infoDialogVisible = ref(false)
const btnLoading = ref(false)
const dialogStatus = ref('')
const rules: FormRules = {
  chargeAmount: [
    { required: true, message: '必输项', trigger: 'blur' }
  ]
}
const formRef = ref<FormInstance>()
const emits = defineEmits(['refresh'])

getList()

async function getList() {
  listLoading.value = true
  const response = await findByPage(listQuery)
  list.value = response.data.items
  total.value = response.data.total
  listLoading.value = false
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
function handleCreate(formEl: FormInstance) {
  temp.value = new ChargeRecord({ vipId: props.vipId })
  dialogStatus.value = '新建'
  infoDialogVisible.value = true
  formEl?.resetFields()
}
function createData(formEl: FormInstance) {
  formEl.validate(async(valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        const res = await create(temp.value)
        temp.value.id = res.data
        temp.value.createTime = new Date()
        list.value.unshift(temp.value)
        infoDialogVisible.value = false
        btnLoading.value = false
        ElNotification({
          title: '成功',
          message: '新建成功',
          type: 'success',
          duration: 2000
        })
        emits('refresh')
      } catch (error) {
        console.error(error)
        btnLoading.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>

</style>
