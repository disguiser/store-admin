<template>
  <div>
    <el-divider>添加颜色</el-divider>
    <!-- <el-popover
      trigger="focus"
    >
      <template #reference>
      </template>
      
    </el-popover> -->
    <MySelect
      :chosen="chosenColors"
      :list="dictStore.colorList"
      placeholder="添加颜色"
      @add="pickColor"
    ></MySelect>
    <!-- <el-select
      filterable
      placeholder="添加颜色"
      default-first-option
      @update:model-value="pickColor"
      style="margin-bottom: 20px;width: 100%;"
      @keydown.enter="handleEnter"
    >
      <el-option
        v-for="item in dictStore.colorList"
        :key="item.id"
        :label="item.itemName"
        :value="item.id"
      />
    </el-select> -->
    <el-divider>添加尺码</el-divider>
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox-group
      v-model="chosenSizes"
      @change="handleCheckedSizeChange"
    >
      <el-checkbox
        v-for="size in sizeList"
        :key="size"
        :label="size"
      >
        {{ dictStore.sizeMap.get(size) }}
      </el-checkbox>
    </el-checkbox-group>
    <el-divider>添加库存</el-divider>
    <table class="stock-list">
      <thead>
        <th>颜色</th>
        <th>尺码</th>
        <th>库存</th>
      </thead>
      <tbody>
        <tr v-for="item in stockList" :key="item.color.toString() + item.size">
          <td>{{ dictStore.colorMap.get(item.color) }}</td>
          <td>{{ dictStore.sizeMap.get(item.size) }}</td>
          <td>
            <el-input-number
              v-model="item.currentStock"
              size="small"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="text-align: right;">
      <el-button v-loading="loading" type="primary" :disabled="chosenColors.size === 0 || chosenSizes.length === 0" @click="multiCreateStock()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { create } from '@/api/color';
import { multiCreate } from '@/api/stock';
import { IStock, Stock } from '@/model/Stock';
import { useDictStore } from '@/store/dict';
import { useSizeGroupStore } from '@/store/sizeGroup';
import { CheckboxValueType, ElMessageBox } from 'element-plus';
import { computed, ref } from 'vue';
import MySelect from './MySelect.vue';

const props = defineProps<{
  goodsId: number,
  deptId: number,
  sizeGroup: number
}>()

const checkAll = ref(false)
const loading = ref(false)
const isIndeterminate = ref(false)
const chosenColors = ref<Set<number>>(new Set())
const chosenSizes = ref<number[]>([])
const stockList = computed<IStock[]>(() => {
  const arr = []
  for (const c of chosenColors.value) {
    if (chosenSizes.value.length > 0) {
      chosenSizes.value.forEach((s: number) => {
        arr.push(new Stock({
          color: c,
          size: s,
          goodsId: props.goodsId,
          deptId: props.deptId,
          currentStock: 1
        }))
      })
    } else {
      arr.push(new Stock({
        color: c,
        size: null,
        goodsId: props.goodsId,
        deptId: props.deptId,
        currentStock: 1
      }))
    }
  }
  return arr
})

const dictStore = useDictStore()

function pickColor(val: number | string) {
  console.log('============')
  console.log(val)
  if (typeof val === 'string') {
    ElMessageBox.confirm(`这是一个新颜色, 确认要添加 ${val} 吗?`, 'Warning', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const { data } = await create({ itemName: val })
      dictStore.colorList.push({
        id: data,
        itemName: val
      })
      chosenColors.value.add(data)
    })
  } else {
    chosenColors.value.add(val)
  }
}
const sizeGroupStore = useSizeGroupStore()
const sizeList = sizeGroupStore
  .sizeGroupMap
  .get(props.sizeGroup)
function handleCheckAllChange(val: CheckboxValueType) {
  chosenSizes.value = val ? sizeList : []
  isIndeterminate.value = false
}
function handleCheckedSizeChange(value: CheckboxValueType[]) {
  const checkedCount = value.length
  checkAll.value = checkedCount === sizeList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < sizeList.length
}
const emit = defineEmits(['refresh'])
async function multiCreateStock() {
  try {
    loading.value = true
    await multiCreate(stockList.value)
    chosenColors.value = new Set()
    chosenSizes.value = []
    emit('refresh')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.stock-list {
  width: 100%;
  text-align: center;
}
</style>