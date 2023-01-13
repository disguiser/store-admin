<template>
  <div>
    <el-button data-test="newDeptStock-btn" type="success" size="small" @click="handleNewDept">添加新门店库存</el-button>
    <el-tabs v-loading="loading" v-model="editableTabsValue" type="border-card">
      <el-tab-pane v-for="e in list" :name="e.name" :label="deptFilter(e.deptId)">
        <stock
          :list="e.list"
          :goods-id="props.goodsId"
          :dept-id="e.deptId"
          :size-group="props.sizeGroup"
          @refresh="getStocks(e.deptId)"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="deptDialog" :append-to-body="true">
      <dept-list ref="deptList" single-select @singleChoose="chooseDept" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { list as findStock } from '@/api/stock';
import { IDept } from '@/model/Dept';
import { IStock } from '@/model/Stock';
import { useDeptStore } from '@/store/dept';
import DeptList from '@/views/dept-list/index.vue';
import { ref } from 'vue';
import Stock from './Stock.vue';
const deptStore = useDeptStore()
const props = defineProps<{
  goodsId: number,
  sizeGroup: number
}>()
interface IList {
  name: string,
  deptId: number,
  list: IStock[]
}
const list = ref<IList[]>([])
const loading = ref(false)
const editableTabsValue = ref('')
const deptDialog = ref(false)

function handleNewDept() {
  deptDialog.value = true
}
function chooseDept(row: IDept) {
  if (!list.value.some(e => e.deptId === row.id)) {
    list.value.push({
      deptId: row.id!,
      name: row.id!.toString(),
      list: []
    })
    deptDialog.value = false
  }
  editableTabsValue.value = row.id!.toString()
}
function deptFilter(deptId: number) {
  return deptStore.deptMap.get(deptId)
}
async function getDeptWithStocks() {
  loading.value = true
  const { data } = await findStock({ goodsId: props.goodsId })
  const _arr: number[] = []
  list.value = data.reduce((a: IList[], b: IStock) => {
    if (!_arr.includes(b.deptId)) {
      _arr.push(b.deptId)
      a.push({
        name: b.deptId.toString(),
        deptId: b.deptId,
        list: [b]
      })
    } else {
      a[_arr.indexOf(b.deptId)].list.push(b)
    }
    return a
  }, [])
  if (list.value.length > 0) {
    editableTabsValue.value = list.value[0].name
  }
  loading.value = false
}
getDeptWithStocks()
async function getStocks(deptId: number) {
  loading.value = true
  const { data } = await findStock({
    goodsId: props.goodsId,
    deptId
  })
  list.value.find(e => e.deptId = deptId).list = data
  loading.value = false
}
</script>

<style lang="scss" scoped>
</style>
