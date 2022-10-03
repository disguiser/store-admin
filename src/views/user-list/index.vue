<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userName" clearable placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
      <el-select v-model="listQuery.roles" multiple placeholder="角色" clearable class="filter-item">
        <el-option v-for="(item, i) in dictStore.roleArr" :key="i" :label="item.itemName" :value="item.itemCode" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter()">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="Edit" @click="handleCreate()">
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
      <el-table-column label="用户名" prop="userName" align="center" />
      <el-table-column label="登录名称" prop="accountName" align="center" />
      <el-table-column label="角色" prop="role" align="center">
        <template #default="{row}">
          <span>{{ row.roles.map((e: string) => dictStore.roleObj[e]).join(',') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店" align="center">
        <template #default="{row}">
          <span>{{ deptStore.deptObj[row.deptId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="{row}">
          <el-tag :type="statusMap[(row as IUser).status] as any">
            {{ row.status === UserStatus.Enabled ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template #default="{row, $index}">
          <el-button type="primary" size="small" @click="handleUpdate(row, $index)">
            编辑
          </el-button>
          <el-button v-if="row.status!=UserStatus.Enabled" :loading="btnLoading" size="small" type="success" @click="handleModifyStatus(row, UserStatus.Enabled)">
            启用
          </el-button>
          <el-button v-if="row.status!=UserStatus.Disabled" :loading="btnLoading" size="small" type="danger" @click="handleModifyStatus(row, UserStatus.Disabled)">
            禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogStatus" :visible.sync="infoDialogVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" status-icon label-position="left" label-width="150px" :model="temp">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="登录名称" prop="accountName">
          <el-input v-model="temp.accountName" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="temp.roles" multiple placeholder="角色" clearable>
            <el-option v-for="(item, i) in dictStore.roleArr" :key="i" :label="item.itemName" :value="item.itemCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="门店" prop="deptId">
          <el-select v-model="temp.deptId">
            <el-option v-for="(item, i) in deptStore.dept" :key="i" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="UserList">
import { findByPage, update, create, checkUnique } from '@/api/user'
import Pagination from '@/components/Pagination/index.vue'
import { reactive, ref } from 'vue';
import { IUser, User, UserStatus } from '@/model/User'
import { ElMessage, ElNotification, FormInstance, FormRules } from 'element-plus';
import { useDictStore } from '@/store/dict';
import { useDeptStore } from '@/store/dept';
const statusMap = {
  Enabled: 'success',
  Disabled: 'info'
}

const list = ref<IUser[]>()
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  userName: undefined,
  roles: [],
  sort: undefined
})
const temp = ref<IUser>(new User())
const tempIndex = ref<number>()
const infoDialogVisible = ref(false)
const btnLoading = ref(false)
const dialogStatus = ref('')

const dictStore = useDictStore()
const deptStore = useDeptStore()

const validateAccountName = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('未填写'))
    return
  }
  if (dialogStatus.value === '新建') {
    checkUnique(temp.value.accountName).then(res => {
      if (!res.data) {
        callback(new Error('用户名已存在'))
      } else {
        callback()
      }
    })
  } else {
    if (value !== list.value[tempIndex.value].accountName) {
      checkUnique(temp.value.accountName).then(res => {
        if (!res.data) {
          callback(new Error('用户名已存在'))
        } else {
          callback()
        }
      })
    } else {
      callback()
    }
  }
}

const rules: FormRules = {
  userName: [{ required: true, message: '未填写', trigger: 'blur' }],
  accountName: [{ validator: validateAccountName, trigger: 'blur' }],
  roles: [{ required: true, message: '未填写', trigger: 'blur' }]
}

const formRef = ref<FormInstance>(null)

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
async function handleModifyStatus(row: IUser, status: UserStatus) {
  btnLoading.value = true
  const _row = new User(row)
  _row.status = status
  try {
    await update(_row)
    row.status = status
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
  } catch (error) {
    console.error(error)
  } finally {
    btnLoading.value = false
  }
}
function handleCreate() {
  temp.value = new User()
  dialogStatus.value = '新建'
  infoDialogVisible.value = true
  formRef.value.resetFields()
}
function createData() {
  if (!formRef.value) return
  formRef.value.validate(async(valid) => {
    if (valid) {
      btnLoading.value = true
      try {
        const res = await create(temp.value)
        temp.value.id = res.data
        temp.value.status = UserStatus.Enabled
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
        btnLoading.value = false
        throw error
      }
    }
  })
}
function handleUpdate(row: IUser, index: number) {
  temp.value = new User(row)
  tempIndex.value = index
  dialogStatus.value = '编辑'
  infoDialogVisible.value = true
  formRef.value.resetFields()
}
function updateData() {
  formRef.value.validate(async(valid) => {
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
</script>

<style lang="scss" scoped>

</style>
