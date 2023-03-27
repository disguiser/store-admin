<template>
  <el-table
    :data="props.list"
    style="width: 100%"
  >
    <el-table-column label="颜色" prop="color" sortable>
      <template #default="{row}">
        <!-- <el-autocomplete
          v-model.trim="temp.color"
          size="small"
          :fetch-suggestions="(queryString, callback) => { querySearch(queryString, callback, e.list) }"
          placeholder="请输入颜色"
        /> -->
        <el-select
          v-if="row.edit"
          v-model="temp.color"
          size="small"
          data-test="color"
          placeholder="颜色"
        >
          <el-option
            v-for="e in dictStore.dictMap.get('颜色')"
            :key="e.id"
            :value="e.id"
            :label="e.itemName"
            data-test="colorOptions"
          />
        </el-select>
        <span v-else>
          {{ dictStore.colorMap.get(row.color) }}
          <el-button v-if="useCheckPermission(['Admin'])" type="warning" size="small" :disabled="btnDisabled" icon="CopyDocument" @click="handleCreate(row.color)" />
        </span>
      </template>
    </el-table-column>
    <el-table-column label="尺码" prop="size" sortable>
      <template #default="{row}">
        <el-select
          v-if="row.edit"
          v-model="temp.size"
          size="small"
          placeholder="尺码"
          data-test="size"
        >
          <el-option
            v-for="item in sizeGroupStore.sizeGroupMap.get(props.sizeGroup)"
            :key="item"
            :value="item"
            :label="dictStore.sizeMap.get(item)"
            data-test="sizeOptions"
          />
        </el-select>
        <span v-else>{{ dictStore.sizeMap.get(row.size) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="库存数量" prop="currentStock" sortable>
      <template #default="{row}">
        <el-input-number
          v-if="row.edit"
          v-model="temp.currentStock"
          size="small"
          :min="0"
          :step="1"
          data-test="currentStock"
        ></el-input-number>
        <span v-else>{{ row.currentStock }}</span>
      </template>
    </el-table-column>

    <el-table-column v-if="useCheckPermission(['Admin', 'Boss'])" label="操作" align="center" class-name="small-padding fixed-width">
      <template #header>
        <el-button
          v-loading="btnLoading"
          :disabled="btnDisabled"
          type="success"
          size="small"
          icon="CirclePlusFilled"
          @click="multiCreateDialog = true"
        >
          批量新增
        </el-button>
        <el-button
          data-test="newStock-btn"
          v-loading="btnLoading"
          :disabled="btnDisabled"
          size="small"
          icon="Plus"
          @click="handleCreate(null)"
        >
          新增
        </el-button>
      </template>
      <template #default="{row, $index}">
        <div v-show="!row.edit">
          <el-button
            data-test="editStock-btn"
            v-loading="btnLoading"
            type="primary"
            size="small"
            :disabled="btnDisabled"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <!-- <el-button v-loading="btnLoading" size="small" @click="handlePrint(row)">
            打印
          </el-button> -->
          <el-button
            data-test="delStock-btn"
            v-loading="btnLoading"
            type="danger"
            size="small"
            :disabled="btnDisabled"
            @click="handleRemove(row.id, $index)"
          >
            删除
          </el-button>
        </div>
        <div v-show="row.edit">
          <el-button
            data-test="confirm-btn"
            v-loading="btnLoading"
            type="primary"
            size="small"
            @click="createOrUpdate(row, $index)"
          >
            确认
          </el-button>
          <el-button
            data-test="cancel-btn"
            v-loading="btnLoading"
            type="warning"
            size="small"
            @click="handleCancel(row)"
          >
            取消
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="multiCreateDialog"
    append-to-body
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <MultiCreateStock
      :goods-id="props.goodsId"
      :dept-id="props.deptId"
      :size-group="props.sizeGroup"
      @refresh="refresh"
    />
  </el-dialog>
</template>

<script setup lang="ts" name="Stock">
import { create, remove, update } from '@/api/stock';
import { useCheckPermission } from '@/hooks/useCheckPermission';
import { IStock, Stock } from '@/model/Stock';
import { useDictStore } from '@/store/dict';
import { useSizeGroupStore } from '@/store/sizeGroup';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { ref } from 'vue';
import MultiCreateStock from './MultiCreateStock.vue';

const props = defineProps<{
  list: IStock[],
  goodsId: number,
  deptId: number,
  sizeGroup: number
}>()
const temp = ref<IStock>()
const btnLoading = ref(false)
const btnDisabled = ref(false)
const emit = defineEmits(['stockUpdated', 'refresh'])
function handleCreate(color: number) {
  resetTemp(color)
  btnDisabled.value = true
  props.list.unshift({
    color: null,
    size: null,
    currentStock: 1,
    goodsId: props.goodsId,
    deptId: props.deptId,
    edit: true
  })
}
async function createOrUpdate(row: IStock, index: number) {
  if (!temp.value.color || !temp.value.size) {
    ElMessage({
      message: '请填写完整',
      type: 'error'
    })
    return
  }
  if (props.list.some(e => row.id !== e.id && e.color === temp.value.color && e.size === temp.value.size)) {
    ElMessage({
      message: '同颜色下尺码重复',
      type: 'error'
    })
    return
  }
  btnLoading.value = true
  try {
    if (row.id) {
      await update(temp.value)
    } else {
      let res = await create(temp.value)
      row.id = res.data
    }
    row.color = temp.value.color
    row.size = temp.value.size
    row.currentStock = temp.value.currentStock
    row.edit = false
    btnDisabled.value = false
    emit('stockUpdated')
    // key.value++
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    btnLoading.value = false
  }
}
function handleRemove(id: number, index: number) {
  ElMessageBox.confirm('确定删除?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    await remove([id])
    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success'
    })
    props.list.splice(index, 1)
    emit('stockUpdated')
  })
}
function handleUpdate(row: IStock) {
  row.edit = !row.edit
  btnDisabled.value = true
  temp.value = new Stock(row)
}
function handleCancel(row: IStock) {
  if (!row.id) {
    props.list.shift()
  } else {
    row.edit = false
  }
  btnDisabled.value = false
}
// querySearch(queryString, cb, list) {
//   let set = new Set()
//   let results = list.reduce((a, b) => {
//     if (b.color && !set.has(b.color)) {
//       set.add(b.color)
//       a.push({
//         value: b.color
//       })
//     }
//     return a
//   }, [])
//   cb(results)
// },
function resetTemp(color: number) {
  temp.value = new Stock({
    color,
    goodsId: props.goodsId,
    deptId: props.deptId,
    currentStock: 1
  })
}
const dictStore = useDictStore()
const sizeGroupStore = useSizeGroupStore()
const multiCreateDialog = ref(false)

function refresh() {
  emit('refresh')
  multiCreateDialog.value = false
}
</script>

<style>

</style>
