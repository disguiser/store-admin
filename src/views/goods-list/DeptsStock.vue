<template>
  <div>
    <el-button type="success" size="small" @click="handleNewDept">添加新门店库存</el-button>
    <el-tabs v-model="editableTabsValue" type="card">
      <el-tab-pane v-for="e in list" :name="e.name" :label="deptFilter(e.deptId)">
        <stock :list="e.list" :goods-id="goodsId" :dept-id="e.deptId" :size-group="sizeGroup" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="deptDialog" :append-to-body="true">
      <dept-list v-if="deptDialog" ref="deptList" single-select @singleChoose="chooseDept" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { list as findStock } from '@/api/stock'
import DeptList from '@/views/dept-list/index.vue'
import { ref } from 'vue';
import Stock from './Stock.vue'
import { useDeptStore } from '@/store/dept';
import { IDept } from '@/model/Dept';
import { IStock } from '@/model/Stock';
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
  return deptStore.deptObj[deptId.toString()]
}
const res = await findStock({ goodsId: props.goodsId })
const _arr: number[] = []
list.value = res.data.reduce((a: IList[], b: IStock) => {
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
</script>

<style lang="scss" scoped>
</style>
