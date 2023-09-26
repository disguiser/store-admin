<template>
  <table-container>
    <template #filter-container>
      <!-- <el-input v-model="listQuery.name" clearable placeholder="" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="Edit" @click="handleCreate">
        添加
      </el-button>
    </template>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;height: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template #default="{row}">
          <!-- <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="详细地址">
              <span>{{ row.addressDetail }}</span>
            </el-form-item>
          </el-form> -->
          <bill :customer-id="row.id" @debt-change="debtChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center" width="100" sortable />
      <el-table-column label="手机号码" prop="mobile" align="center" width="100" />
      <el-table-column label="地址" prop="address" align="center">
        <template #default="{row}">
          <span>{{ addressFilter(row.address) }}{{ row.addressDetail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="欠款" prop="debt" align="center" width="100" />
      <el-table-column label="录入时间" prop="createTime" align="center" width="130" sortable>
        <template #default="{row}">
          <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
      </el-table-column>
  
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template #default="{row, $index}">
          <el-button type="primary" size="small" @click="handleUpdate(row, $index)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleRemove(row, $index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <pagination v-show="total>0" :total="total" v-model:current-page="listQuery.page" v-model:page-size="listQuery.limit" @current-change="getList" @size-change="getList" />
    </template>
  </table-container>
  <el-dialog :title="dialogStatus" v-model="infoDialogVisible" :close-on-click-modal="false" append-to-body>
    <el-form ref="formRef" :rules="rules" label-position="right" label-width="100px" :model="temp">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="temp.name" v-focus />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="temp.mobile" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-cascader
          v-model="temp.address"
          style="width: 100%"
          :options="addressOptions"
          :props="{ checkStrictly: true, expandTrigger: 'hover', label: 'name', value: 'code' }"
        />
      </el-form-item>
      <el-form-item label="地址详情" prop="addressDetail">
        <el-input v-model="temp.addressDetail" />
      </el-form-item>
      <el-form-item v-if="dialogStatus === 'update'" label="欠款" prop="debt">
        <el-input v-model="temp.debt" type="number" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="infoDialogVisible = false">
        取消
      </el-button>
      <template v-if="dialogStatus==='新建'">
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
</template>

<script setup lang="ts">
import TableContainer from '@/components/TableContainer.vue'
import { findByPage, findOne, update, create, remove } from '@/api/customer'
import Pagination from '@/components/Pagination/index.vue'
import { addressOptions } from '@/utils'
import { reactive, ref } from 'vue';
import { addressFilter } from '@/utils/index'
import dayjs from 'dayjs'
import { Customer, ICustomer } from '@/model/Customer'
import { ElMessageBox, ElNotification, FormInstance, FormRules } from 'element-plus';
import Bill from './Bill.vue'

const list = ref<ICustomer[]>(null)
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  sort: undefined
})
const temp = ref(new Customer())
const tempIndex = ref(null)
const infoDialogVisible = ref(false)
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

getList()

function getList() {
  listLoading.value = true
  findByPage(listQuery).then(response => {
    list.value = response.data.items
    total.value = response.data.total
    listLoading.value = false
  })
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
function handleCreate() {
  formRef.value?.resetFields()
  temp.value = new Customer()
  dialogStatus.value = '新建'
  infoDialogVisible.value = true
}
const formRef = ref<FormInstance | null>(null)
function createData(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
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
      } catch (error) {
        console.error(error)
        btnLoading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleUpdate(row: ICustomer, index: number) {
  formRef.value?.resetFields()
  temp.value = new Customer(row)
  tempIndex.value = index
  dialogStatus.value = '编辑'
  infoDialogVisible.value = true
}
function updateData(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      btnLoading.value = true
      try {
        list.value.splice(tempIndex, 1, temp.value)
        infoDialogVisible.value = false
        btnLoading.value = false
        ElNotification({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        await update(temp.value)
      } catch (error) {
        console.error(error)
        btnLoading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
function handleRemove(row: ICustomer, index: number) {
  ElMessageBox.confirm('确定删除?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    btnLoading.value = true
    try {
      await remove(row.id)
      ElNotification({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      list.value.splice(index, 1)
      btnLoading.value = false
    } catch (error) {
      console.error(error)
      btnLoading.value = false
    }
  })
}
async function debtChange(row: ICustomer) {
  const { data } = await findOne(row.id)
  row.debt = data.debt
}
</script>

<style lang="scss" scoped>

</style>
