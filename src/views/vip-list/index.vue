<template>
  <table-container>
    <template #filter-container>
      <el-input v-model="listQuery.name" clearable placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-input v-model="listQuery.phone" clearable placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="Edit" @click="handleCreate(formRef)">
        添加
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
      <el-table-column label="姓名" prop="name" align="center" />
      <el-table-column label="手机号码" prop="phone" align="center" width="115" />
      <el-table-column label="生日" prop="birthday" align="center" width="100" />
      <el-table-column label="当前余额" prop="balance" align="center" />
      <el-table-column label="生日折扣(%)" prop="birthDiscount" align="center" width="80" />
      <el-table-column label="终身折扣(%)" prop="vipDiscount" align="center" width="80" />
      <el-table-column label="注册时间" prop="createTime" align="center" width="140">
        <template #default="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
  
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template #default="{row, $index}">
          <el-button type="primary" size="small" @click="handleUpdate(row, $index, formRef)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleRemove(row, $index)">
            删除
          </el-button>
          <el-button size="small" @click="handleShowCharge(row)">
            充值
          </el-button>
          <el-button size="small" @click="handleShowConsume(row)">
            消费
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <pagination v-show="total>0" :total="total" v-model:current-page="listQuery.page" v-model:page-size="listQuery.limit" @current-change="getList" @size-change="getList" />
    </template>
  </table-container>
  <el-dialog
    :title="dialogStatus"
    v-model="infoDialogVisible"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="formRef" :rules="rules" label-position="right" label-width="100px" :model="temp">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="temp.name" v-focus />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="temp.phone" />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker v-model="temp.birthday" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
      </el-form-item>
      <el-form-item label="生日折扣(%)" prop="birthDiscount">
        <el-slider v-model="temp.birthDiscount" :step="5" show-stops show-input />
      </el-form-item>
      <el-form-item label="终身折扣(%)" prop="vipDiscount">
        <el-slider v-model="temp.vipDiscount" :step="5" show-stops show-input />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="infoDialogVisible = false">
        取消
      </el-button>
      <template v-if="dialogStatus==='create'">
        <el-button type="primary" :loading="btnLoading" @click="createData(formRef)">
          确认
        </el-button>
      </template>
      <template v-else>
        <el-button type="primary" :loading="btnLoading" @click="updateData(formRef)">
          确认
        </el-button>
      </template>
    </div>
  </el-dialog>

  <el-dialog title="充值详情" v-model="chargeDialogVisible" :close-on-click-modal="false" append-to-body>
    <charge-record-list v-if="chargeDialogVisible" :vip-id="currentVipId" @refresh="getList" />
  </el-dialog>

  <el-dialog title="消费详情" v-model="consumeDialogVisible" :close-on-click-modal="false" append-to-body>
    <consume-record-list v-if="consumeDialogVisible" :vip-id="currentVipId" @refresh="getList" />
  </el-dialog>
</template>

<script setup lang="ts">
import TableContainer from '@/components/TableContainer.vue'
import { create, findByPage, remove, update } from '@/api/vip';
import Pagination from '@/components/Pagination/index.vue'; // secondary package based on el-pagination
import { IVip, Vip } from '@/model/Vip';
import dayjs from 'dayjs';
import ChargeRecordList from '@/views/charge-record-list/index.vue';
import ConsumeRecordList from '@/views/consume-record-list/index.vue';
import { ElMessageBox, ElNotification, FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

defineOptions({
  name: 'VipList'
})

const list = ref<IVip[]>([])
const total = ref<number>(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  name: undefined,
  phone: undefined,
  sort: undefined
})
const temp = ref<IVip>(new Vip())
const tempIndex = ref<number>()
const infoDialogVisible = ref(false)
const chargeDialogVisible = ref(false)
const consumeDialogVisible = ref(false)
const currentVipId = ref()
const btnLoading = ref(false)
const dialogStatus = ref('')
const rules: FormRules = {
  name: [{ required: true, message: '必输项', trigger: 'blur' }],
  phone: [
    { required: true, message: '必输项', trigger: 'blur' },
    { type: 'string', pattern: /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[1,3,5,8,9])\d{8}$/, message: '格式错误', trigger: 'blur' }
  ],
  birthday: [{ required: true, message: '必输项', trigger: 'blur' }],
  birthDiscount: [{ required: true, message: '必输项', trigger: 'blur' }],
  vipDiscount: [{ required: true, message: '必输项', trigger: 'blur' }]
}
const formRef = ref<FormInstance>()
// const { proxy } = getCurrentInstance();
// const getNewData =  () => {
//   proxy.$refs['uploadRef'].clearImg();
// }
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
  // console.log('handleCreate')
  temp.value = new Vip()
  dialogStatus.value = '新建'
  infoDialogVisible.value = true
  // console.log(formRef)
  formEl?.resetFields()
}
function createData(formEl: FormInstance) {
  formEl.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        const res = await create(temp.value)
        temp.value.id = res.data
        temp.value.balance = 0
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
      } catch (error) {
        console.error(error)
        btnLoading.value = false
      }
    }
  })
}
function handleUpdate(row: IVip, index: number, formEl: FormInstance) {
  temp.value = new Vip(row)
  tempIndex.value = index
  dialogStatus.value = '更新'
  infoDialogVisible.value = true
  formEl?.resetFields()
}
function updateData(formEl: FormInstance) {
  formEl.validate(async(valid) => {
    if (valid) {
      btnLoading.value = true
      await update(temp.value)
      list.value.splice(tempIndex.value, 1, temp.value)
      infoDialogVisible.value = false
      btnLoading.value = false
      ElNotification({
        title: '成功',
        message: '更新成功',
        type: 'success',
        duration: 2000
      })
    }
  })
}
function handleRemove(row: IVip, index: number) {
  ElMessageBox.confirm('确定删除?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    await remove([row.id])
    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success',
      duration: 2000
    })
    list.value.splice(index, 1)
  })
}
function handleShowCharge(vip: IVip) {
  currentVipId.value = vip.id
  chargeDialogVisible.value = true
}
function handleShowConsume(vip: IVip) {
  currentVipId.value = vip.id
  consumeDialogVisible.value = true
}
</script>
