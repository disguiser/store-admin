<template>
  <table-container>
    <template #filter-container>
      <el-button class="filter-item" type="primary" icon="Edit" @click="handleCreate">
        添加
      </el-button>
    </template>
    <el-table
      :data="list"
      border
      fit
      style="width: 100%;"
    >
      <el-table-column label="品类" prop="name" sortable="custom" align="center" width="200" />
      <el-table-column label="尺码组" prop="data" align="center">
        <template #default="{row}">
          <el-tag v-for="(e, i) in row.data" :key="i" style="margin-top: 5px">{{ dictStore.sizeMap.get(e) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
        <template #default="{row, $index}">
          <el-button type="primary" size="small" style="margin-right:10px;" @click="handleUpdate(row)">编辑</el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确认删除?"
            @confirm="handleRemove(row, $index)"
          >
            <template #reference>
              <el-button :loading="btnLoading" size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </table-container>
  <el-dialog :title="dialogStatus" v-model="infoDialogVisible" :close-on-click-modal="false" width="800px">
    <el-form ref="formRef" label-position="left" label-width="100px" :model="temp">
      <el-form-item label="品类" prop="name">
        <el-input v-model="temp.name" />
      </el-form-item>
      <el-form-item label="字典数据" prop="data">
        <el-transfer v-model="temp.data" :data="_sizes"></el-transfer>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="infoDialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" :loading="btnLoading" @click="dialogStatus==='create'?createData(formRef):updateData(formRef)">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
  import TableContainer from '@/components/TableContainer.vue'
  import { findAll, update, create, remove } from '@/api/sizeGroup'
  import { ISizeGroup } from '@/model/SizeGroup';
  import { useDictStore } from '@/store/dict';
  import { computed } from '@vue/reactivity';
  import { ElNotification, FormInstance } from 'element-plus';
  import { reactive, ref } from 'vue';

  defineOptions({
    name: 'SizeGroupList'
  })

  const list = ref([])
  const listLoading = ref(false)
  const btnLoading = ref(false)
  const infoDialogVisible = ref(false)
  const dialogStatus = ref('')
  const listQuery = reactive({
    sort: ''
  })
  const temp = ref<
    Omit<ISizeGroup, 'data'> & { data: number[] }
  >({
    name: '',
    data: []
  })

  const dictStore = useDictStore()

  const formRef = ref<FormInstance | null>(null)

  const _sizes = computed(() => {
    return dictStore.sizeList.map(e => {
      return {
        key: e.id,
        label: e.itemName
      }
    })
  })
  getList()
  async function getList() {
    listLoading.value = true
    const response = await findAll(listQuery)
    list.value = response.data
    listLoading.value = false
  }
  function handleCreate() {
    temp.value = {
      name: '',
      data: []
    }
    dialogStatus.value = 'create'
    infoDialogVisible.value = true
  }
  function handleUpdate(row: ISizeGroup) {
    temp.value = {
      ...row
    }
    dialogStatus.value = '更新'
    infoDialogVisible.value = true
  }
  async function handleRemove(row: ISizeGroup, index: number) {
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
  function createData(formEl: FormInstance) {
    if (!formEl) return
    formEl.validate(async (valid, field) => {
      if (valid) {
        await create(temp.value)
        getList()
        infoDialogVisible.value = false
        ElNotification({
          title: '成功',
          message: '新建成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }
  function updateData(formEl: FormInstance) {
    if (!formEl) return
    formEl.validate(async (valid, field) => {
      if (valid) {
        await update(temp.value)
        infoDialogVisible.value = false
        getList()
        ElNotification({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }
</script>

<style lang="scss" scoped>

</style>
