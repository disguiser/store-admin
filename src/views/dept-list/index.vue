<template>
  <table-container>
    <template #filter-container>
      <el-button v-if="!singleSelect" class="filter-item" type="primary" icon="Edit" @click="handleCreate">
        添加
      </el-button>
    </template>
    <el-table
      :data="list"
      v-loading="listLoading"
      border
      :highlight-current-row="props.singleSelect"
      @current-change="handleSingleSelect"
    >
      <el-table-column prop="name" label="门店" align="center" />
      <el-table-column v-if="!props.singleSelect" align="center" label="操作" width="200">
        <template #default="{row, $index}">
          <div>
            <template v-if="row.edit">
              <el-link type="success" @click="confirmEdit(row)">确认</el-link>
              <el-divider direction="vertical" />
              <el-link type="danger" @click="cancelEdit(row)">取消</el-link>
            </template>
            <template v-else>
              <el-link type="primary" @click="showDetail(row)">明细</el-link>
              <el-divider direction="vertical" />
              <el-link type="warning" @click="handleEdit(row)">编辑</el-link>
              <el-divider direction="vertical" />
              <el-link type="danger" @click="handleRemove(row, $index)">删除</el-link>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </table-container>
</template>

<script setup lang="ts">
import TableContainer from '@/components/TableContainer.vue'
import { findAll, create, update, remove } from '@/api/dept'
import { useUserStore } from '@/store/user';
import { ElMessage, ElNotification } from 'element-plus'
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { IDept } from '@/model/Dept';
// const { props: selectableProps, handleSingleSelect } = useSelectable(defineEmits)
// console.log(selectableProps)
const props = defineProps({
  singleSelect: {
    type: Boolean,
    default: false
  },
  multiSelect: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['rowSelection', 'singleChoose', 'multiChoose', 'chooseAll'])
function handleSingleSelect(row: IDept) {
  emit('singleChoose', row)
}

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const listLoading = ref(false)
const list = ref(Array<any>())
async function getList() {
  listLoading.value = true
  try {
    let res = await findAll({})
    list.value = res.data
  } catch (error) {
    ElMessage.error(JSON.stringify(error))
  } finally {
    listLoading.value = false
  }
}
if (userStore.roles.includes('Waiter') && route.path === '/stock/dept') {
  router.replace(`/stock/goods/${userStore.deptId}`)
} else {
  getList()
}

const temp = ref<IDept>({
  name: ''
})
function handleCreate() {
  const row = {
    name: '',
    edit: true
  }
  temp.value = Object.assign({}, row)
  list.value.unshift(row)
}
function cancelEdit(row: IDept) {
  if (row.name === '') {
    list.value.shift()
  } else {
    row.edit = false
  }
}
function handleEdit(row: IDept) {
  row.edit = true
  temp.value.name = row.name
}
async function confirmEdit(row: IDept) {
  if (temp.value.name) {
    listLoading.value = true
    let func, message
    if (row.id) {
      func = update(temp.value)
      message = 'Update success'
    } else {
      func = new Promise((resolve, reject) => {
        create(temp.value).then(res => {
          row.id = res.data
          resolve(null)
        }).catch(err => {
          reject(err)
        })
      })
      message = 'Create success'
    }
    try {
      await func
      row.name = temp.value.name
      row.edit = false
      ElNotification({
        title: 'Success',
        message: message,
        type: 'success',
      })
    } catch (error) {
      console.error(error)
    } finally {
      listLoading.value = false
    }
  }
}
async function handleRemove(row: IDept, index: number) {
  listLoading.value = true
  try {
    await remove(row.id!)
    list.value.splice(index, 1)
    ElNotification({
      title: 'Success',
      message: 'Delete success',
      type: 'success',
    })
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}
function showDetail(row: IDept) {
  router.push(`/stock/goods/${row.id}`)
}
</script>

<style lang="scss" scoped>
</style>