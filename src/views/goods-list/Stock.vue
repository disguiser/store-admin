<template>
  <el-table
    :key="key"
    :data="list"
    style="width: 100%"
  >
    <el-table-column label="颜色" prop="color" sortable>
      <template #default="{row}">
        <template v-if="row.edit">
          <!-- <el-autocomplete
            v-model.trim="temp.color"
            size="small"
            :fetch-suggestions="(queryString, callback) => { querySearch(queryString, callback, e.list) }"
            placeholder="请输入颜色"
          /> -->
          <el-select
            v-model="temp.color"
            size="small"
          >
            <el-option
              v-for="e in dictStore.dictObj['颜色']"
              :key="e.id"
              :value="e.id"
              :label="e.itemName"
            />
          </el-select>
        </template>
        <span v-else>
          {{ dictStore.colorObj[row.color] }}
          <el-button type="warning" size="small" :disabled="btnDisabled" icon="CopyDocument" @click="handleCreate({ color: row.color })" />
        </span>
      </template>
    </el-table-column>
    <el-table-column label="尺码" prop="size" sortable>
      <template #default="{row}">
        <template v-if="row.edit">
          <el-select v-model="temp.size" size="small" placeholder="尺码">
            <el-option
              v-for="item in sizeGroupStore.sizeGroupObj[sizeGroup.toString()]"
              :key="item.id"
              :value="item.id"
              :label="item.itemName"
            />
          </el-select>
        </template>
        <span v-else>{{ dictStore.sizeObj[row.size] }}</span>
      </template>
    </el-table-column>
    <el-table-column label="库存数量" prop="currentStock" sortable>
      <template #default="{row}">
        <template v-if="row.edit">
          <el-input-number v-model="temp.currentStock" size="small" :min="0" :step="1" />
        </template>
        <span v-else>{{ row.currentStock }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template #header>
        <el-button v-loading="btnLoading" :disabled="btnDisabled" type="success" size="small" icon="el-icon-plus" @click="handleCreate({})">
          新增
        </el-button>
      </template>
      <template #default="{row, $index}">
        <div v-show="!row.edit">
          <el-button v-loading="btnLoading" type="primary" size="small" :disabled="btnDisabled" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button v-loading="btnLoading" size="small" @click="handlePrint(row)">
            打印
          </el-button> -->
          <el-button v-loading="btnLoading" type="danger" size="small" :disabled="btnDisabled" @click="handleRemove(row.id, $index)">
            删除
          </el-button>
        </div>
        <div v-show="row.edit">
          <el-button v-loading="btnLoading" type="primary" size="small" @click="createOrUpdate(row)">
            确认
          </el-button>
          <el-button v-loading="btnLoading" type="warning" size="small" @click="handleCancel(row)">
            取消
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { create, remove, update } from '@/api/stock'
import { IStock, Stock } from '@/model/Stock';
import { useDictStore } from '@/store/dict';
import { useSizeGroupStore } from '@/store/sizeGroup';
import { MessageBox } from '@element-plus/icons-vue';
import { ElMessage, ElNotification } from 'element-plus';
import { ref } from 'vue';

const props = defineProps<{
  list: IStock[],
  goodsId: number,
  deptId: number,
  sizeGroup: number
}>()
const key = ref(0)
const temp = ref<IStock>(new Stock())
const btnLoading = ref(false)
const btnDisabled = ref(false)
function handleCreate({ color = '' }) {
  resetTemp(color)
  btnDisabled.value = true
  key.value++
  props.list.unshift({
    color: '',
    size: '',
    currentStock: 0,
    goodsId: props.goodsId,
    deptId: props.deptId,
    edit: true
  })
}
async function createOrUpdate(row: IStock) {
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
      // this.$nextTick(() => {
      //   this.$emit('stockUpdated', this.list)
      // })
    } else {
      let res = await create(temp.value)
      row.id = res.data
    }
    row.color = temp.value.color
    row.size = temp.value.size
    row.currentStock = temp.value.currentStock
    row.edit = false
    btnDisabled.value = false
    key.value++
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    btnLoading.value = false
  }
}
function handleRemove(id: number, index: number) {
  MessageBox.confirm('确定删除?', 'Warning', {
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
  })
}
function handleUpdate(row: IStock) {
  row.edit = !row.edit
  btnDisabled.value = true
  key.value++
  temp.value = Object.assign({}, row)
}
function handleCancel(row: IStock) {
  if (!row.id) {
    props.list.shift()
  } else {
    row.edit = false
  }
  btnDisabled.value = false
  key.value++
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
function resetTemp(color: string) {
  temp.value = new Stock({
    color,
    size: '',
    goodsId: props.goodsId,
    deptId: props.deptId,
    currentStock: 0
  })
}
const dictStore = useDictStore()
const sizeGroupStore = useSizeGroupStore()
</script>

<style>

</style>
