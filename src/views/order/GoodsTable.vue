<template>
  <div>
    <table style="width: 100%">
      <thead>
        <th>货号</th>
        <th>颜色</th>
        <th>尺码</th>
        <th>单价</th>
        <th>数量</th>
        <th>当前库存</th>
        <th>金额小计</th>
        <th>
          <el-button @click="addGoods">添加</el-button>
        </th>
      </thead>
      <tbody>
        <tr v-for="(e, i) in temp.itemList" :key="i">
          <td>
            <remote-sku v-model="e.preSku" @change="skuChange($event, i)" />
          </td>
          <td>
            <el-select v-model="e.color" placeholder="颜色" :disabled="e.colorOptions.length == 0" @change="colorChange($event, e)">
              <el-option
                v-for="item in e.colorOptions"
                :key="item.color"
                :label="colorMap.get(item.color)"
                :value="item.color"
              />
            </el-select>
          </td>
          <td>
            <el-select v-model="e.size" placeholder="尺码" :disabled="e.sizeOptions.length == 0" @change="sizeChange($event, e)">
              <el-option
                v-for="item in e.sizeOptions"
                :key="item.size"
                :label="sizeMap.get(item.size)"
                :value="item.size"
              />
            </el-select>
          </td>
          <td>
            <el-input-number v-model="e.salePrice" :min="0" @change="sumSubtotal(e)" />
          </td>
          <td>
            <el-input-number v-model="e.amount" :min="0" :disabled="!e.currentStock" @change="amountChange(e)" />
          </td>
          <td>{{ e.currentStock }}</td>
          <td>¥ {{ e.subtotalMoney }}</td>
          <td>
            <el-button type="danger" @click="removeGoods(i)">删除</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="count-div">
      <count-up :end-val="temp.total">
        <template #suffix> 件</template>
      </count-up>
      <count-up :end-val="temp.totalMoney" :duration="1">
        <template #prefix>¥ </template>
        <template #suffix> 元</template>
      </count-up>
    </div>
    <barcode-scan ref="barcodeScan" @scaned="scaned" />
  </div>
</template>

<script setup lang="ts">
import { findOneBySku } from '@/api/goods'
import { list as listStock } from '@/api/stock'
import RemoteSku from './RemoteSku.vue'
import CountUp from 'vue-countup-v3'
import { IOrder, IOrderGoodsStock, OrderGoodsStock } from '@/model/Order';
import { useDictStore } from '@/store/dict';
import { IStock } from '@/model/Stock';
import { useUserStore } from '@/store/user';
import { ElMessageBox } from 'element-plus';
import { watchEffect, ref } from 'vue';
import { useBarcodeScan } from '@/hooks/useBarcodeScan'

const props = defineProps<{
  temp: IOrder
}>()

const temp = ref<IOrder>()
watchEffect(() => {
  temp.value = props.temp
})

const { sizeMap, colorMap } = useDictStore()
const { deptId } = useUserStore()

useBarcodeScan(scaned)

async function scaned(sku: string, color: number, size: number) {
  console.log('scaned', sku, color, size)
  let res = await findOneBySku(sku)
  let item = temp.value.itemList.find((e: IOrderGoodsStock) => {
    return e.sku === sku &&
      e.color === color &&
      e.size === size
  })
  if (item) {
    item.amount += 1
    amountChange(item)
  } else {
    addGoods()
    item = temp.value.itemList[temp.value.itemList.length - 1]
    item.preSku = res.data.preSku
    await skuChange({ goodsId: res.data.id, sku }, temp.value.itemList.length - 1)
    item.color = color
    colorChange(color, item)
    item.size = size
    sizeChange(size, item)
  }
}
function addGoods() {
  temp.value.itemList.push(new OrderGoodsStock())
}
function removeGoods(i: number) {
  temp.value.itemList.splice(i, 1)
  sumTotal()
}
function sumSubtotal(item: IOrderGoodsStock) {
  if (item.amount > 0 && item.salePrice >= 0) {
    item.subtotalMoney = item.salePrice * item.amount
    sumTotal()
  }
}
function sumTotal() {
  let total = 0
  let totalMoney = 0
  temp.value.itemList.forEach((e: IOrderGoodsStock) => {
    totalMoney += e.subtotalMoney
    total += e.amount
  })
  temp.value.total = total
  temp.value.totalMoney = totalMoney
}
async function skuChange($event: any, i: number) {
  const { goodsId, sku } = $event
  temp.value.itemList[i].salePrice = null
  temp.value.itemList[i].color = null
  temp.value.itemList[i].size = null
  temp.value.itemList[i].sku = sku
  const res = await listStock({
    goodsId,
    deptId
  })
  let arr: any[] = []
  let color: any[] = []
  // 由结果集中重组颜色尺码映射
  res.data.forEach((e: IStock) => {
    let index = color.indexOf(e.color)
    if (index >= 0) {
      arr[index].sizes.push({
        size: e.size,
        currentStock: e.currentStock,
        stockId: e.id
      })
    } else {
      color.push(e.color)
      arr.push({
        color: e.color,
        sizes: [{
          size: e.size,
          currentStock: e.currentStock,
          stockId: e.id
        }]
      })
    }
  })
  temp.value.itemList[i].colorOptions = arr
}
function colorChange(color: number, e: IOrderGoodsStock) {
  let choosen = e.colorOptions.filter(e => e.color === color)
  e.sizeOptions = choosen[0].sizes
}
function sizeChange(size: number, e: IOrderGoodsStock) {
  let choosen = e.sizeOptions.filter(e => e.size === size)
  e.currentStock = choosen[0].currentStock
  e.stockId = choosen[0].stockId
  if (e.amount === 0 && e.currentStock > 0) {
    e.amount = 1
    sumSubtotal(e)
  }
}
function amountChange(e: IOrderGoodsStock) {
  if (e.amount <= e.currentStock) {
    sumSubtotal(e)
  } else {
    setTimeout(() => {
      e.amount = e.currentStock
    }, 100)
    ElMessageBox.alert('数量不能大于库存!')
  }
}
</script>

<style lang="scss" scoped>
td {
  text-align: center;
}
.count-div {
  color: #f6416c;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  font-size: 30px;
}
</style>
