<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker v-model="listQuery.createDate" value-format="yyyy-MM-dd" type="date" placeholder="充值日期" @keyup.enter="handleFilter" />
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
      <el-table-column label="消费金额" prop="consumeAmount" align="center" />
      <el-table-column label="消费时间" prop="createTime" align="center">
        <template #default="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD hh:mm') }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogStatus" v-model="infoDialogVisible" :close-on-click-modal="false" append-to-body>
      <el-form ref="formRef" :rules="rules" label-position="right" label-width="100px" :model="temp">
        <el-form-item label="消费金额" prop="consumeAmount">
          <el-input v-if="infoDialogVisible" v-model="temp.consumeAmount" type="number" v-focus />
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

<script lang="ts" setup name="ConsumeRecordList">
import { create, findByPage } from '@/api/consumeRecord'
import Pagination from '@/components/Pagination/index.vue'; // secondary package based on el-pagination
import { ConsumerRecord, IConsumerRecord } from '@/model/ConsumerRecord'
import dayjs from 'dayjs'
import { ElNotification, FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const props = defineProps<{
  vipId: number
}>()
const emits = defineEmits(['refresh'])

const list = ref<IConsumerRecord[]>()
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  vipId: props.vipId,
  createDate: undefined,
  sort: undefined
})
const temp = ref(null)
const infoDialogVisible = ref(false)
const btnLoading = ref(false)
const dialogStatus = ref('')
const rules: FormRules = {
  consumeAmount: [
    { required: true, message: '必输项', trigger: 'blur' }
  ]
}
const formRef = ref<FormInstance>()
getList()

async function getList() {
  listLoading.value = true
  const response = await findByPage(listQuery)
  list.value = response.data.items
  total.value = response.data.total
  listLoading.value = false
}
function handleFilter() {
  listQuery.page = 1
  getList()
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

function handleCreate(formEl: FormInstance) {
  temp.value = new ConsumerRecord({ vipId: props.vipId })
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
