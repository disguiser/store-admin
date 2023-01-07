<template>
  <table-container>
    <template #filter-container>
      <el-input v-model="listQuery.dictName" clearable placeholder="字典名称" style="width: 200px;margin-right: 10px;" class="filter-item" @keyup.enter="getList" />
      <el-button class="filter-item" type="primary" icon="Search" @click="getList">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" icon="Edit" @click="handleCreate(formRef)">
        添加
      </el-button>
    </template>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" />
      <el-table-column label="字典名称" prop="dictName" align="center">
        <template #default="scope">
          <el-popover trigger="hover" placement="bottom" width="400">
            <el-tag v-for="(e, i) in scope.row.data" :key="i">{{ e.itemName }}{{ e.itemCode ? `(${e.itemCode})`: '' }}</el-tag>
            <template #reference>
              <el-tag>{{ scope.row.dictName }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="{row, $index}">
          <el-button type="primary" style="margin-right:10px;" @click="handleUpdate(row, $index, formRef)">编辑</el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认删除?"
            @confirm="handleRemove(row, $index)"
          >
            <template #reference>
              <el-button :loading="btnLoading" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </table-container>
  <el-dialog :title="dialogStatus" v-model="infoDialogVisible" width="810px" :close-on-click-modal="false" append-to-body>
    <el-form ref="formRef" :rules="rules" label-position="left" label-width="80px" :model="temp">
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="temp.dictName" />
      </el-form-item>
      <el-form-item label="更多选项" prop="moreOption">
        <el-switch
          v-model="temp.moreOption"
          active-color="#13ce66"
          inactive-color="#cccccc"
        />
      </el-form-item>
      <el-form-item label="字典数据" prop="data">
        <list v-if="temp.moreOption" :data="temp.data" />
        <dynamic-tag v-else :dynamic-tags="temp.data" param-name="itemName" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="infoDialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" :loading="btnLoading" @click="dialogStatus==='新建'?createData(formRef):updateData(formRef)">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup name="DictList">
import TableContainer from '@/components/TableContainer.vue'
import { findAll, update, create, remove } from '@/api/dict'
import DynamicTag from './DynamicTag.vue'
import List from './List.vue'
import { reactive, ref } from 'vue';
import { Dict, IDict } from '@/model/Dict';
import { ElNotification, FormInstance, FormRules } from 'element-plus';

const list = ref<IDict[]>()
const listLoading = ref(false)
const btnLoading = ref(false)
const listQuery = reactive({
  dictName: undefined,
  sort: ''
})
const temp = ref<IDict>(new Dict())
const tempIndex = ref<number>()
const infoDialogVisible = ref(false)
const dialogStatus = ref('')
const rules: FormRules = {
  dictName: [{ required: true, message: 'Dict Name is required', trigger: 'change' }]
}
const formRef = ref<FormInstance>()
getList()
async function getList() {
  listLoading.value = true
  const res = await findAll(listQuery)
  list.value = res.data
  listLoading.value = false
}
function handleCreate(formEl: FormInstance) {
  temp.value = new Dict()
  dialogStatus.value = '新建'
  infoDialogVisible.value = true
  formEl?.resetFields()
}
function createData(formEl: FormInstance) {
  formEl.validate(async(valid) => {
    if (valid) {
      try {
        const res = await create(temp.value)
        temp.value.id = res.data
        list.value.unshift(temp.value)
        ElNotification({
          title: '成功',
          message: '新建成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error(error)
      } finally {
        infoDialogVisible.value = false
      }
    }
  })
}
function handleUpdate(row: IDict, index: number, formEl: FormInstance) {
  temp.value = new Dict(row)
  tempIndex.value = index
  dialogStatus.value = '编辑'
  infoDialogVisible.value = true
  formEl?.resetFields()
}
function updateData(formEl: FormInstance) {
  formEl.validate(async(valid) => {
    if (valid) {
      try {
        await update(temp.value)
        list.value.splice(tempIndex.value, 1, temp.value)
        ElNotification({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error(error)
      } finally {
        infoDialogVisible.value = false
      }
    }
  })
}
async function handleRemove(row: IDict, index: number) {
  try {
    btnLoading.value = true
    await remove(row.id)
    list.value.splice(index, 1)
  } catch (error) {
    console.error(error)
  } finally {
    btnLoading.value = false
  }
}
</script>

<style lang="scss" scoped>

</style>
