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
        <tr v-for="(e, i) in temp.goodsList" :key="i">
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
            <el-input-number v-model="e.salePrice" @change="sumTotal(e)" />
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
      <count-up :start-val="0" :end-val="temp.total" :duration="1000" :decimals="0" separator="," suffix=" 件" :autoplay="true" />
      <count-up :start-val="0" :end-val="temp.totalMoney" :duration="1000" :decimals="0" separator="," prefix="¥ " suffix=" 元" :autoplay="true" />
      <!-- <span>{{ temp.total }} 件</span>
      <span>¥{{ temp.totalMoney }} 元</span> -->
    </div>
    <barcode-scan ref="barcodeScan" @scaned="scaned" />
  </div>
</template>

<script setup lang="ts">
import { findOneBySku } from '@/api/goods'
import { list as listStock } from '@/api/stock'
import RemoteSku from './RemoteSku.vue'
import CountUp from 'vue-countup-v3'
import { IOrder, IOrderGoods, OrderGoods } from '@/model/Order';
import { useDictStore } from '@/store/dict';
import { IStock } from '@/model/Stock';
import { useUserStore } from '@/store/user';
import { ElMessageBox } from 'element-plus';
// import BarcodeScan from '@/components/BarcodeScan.vue'

type _IOrderGoods = IOrderGoods & {
  currentStock: number
  stockId: number
}
type _IOrder = Omit<IOrder, 'goodsList'> & {
  goodsList: _IOrderGoods[]
}

const props = defineProps<{
  temp: IOrder
}>()

const temp = props.temp as _IOrder

const { sizeMap, colorMap } = useDictStore()
const { deptId } = useUserStore()

async function scaned({ sku, color, size }: _IOrderGoods) {
  console.log('scaned')
  let res = await findOneBySku(sku)
  let items = temp.goodsList.filter(e => {
    return e.sku === sku &&
      e.color === color &&
      e.size === size
  })
  let item
  if (items.length > 0) {
    item = items[0]
    item.amount += 1
    amountChange(item)
  } else {
    addGoods()
    item = temp.goodsList[temp.goodsList.length - 1]
    item.preSku = res.data.preSku
    await skuChange({ goodsId: res.data.id, sku }, temp.goodsList.length - 1)
    item.color = color
    colorChange(color, item)
    item.size = size
    sizeChange(size, item)
  }
}
function addGoods() {
  temp.goodsList.push({
    ...new OrderGoods(),
    currentStock: 0,
    stockId: 0
  })
}
function removeGoods(i: number) {
  temp.goodsList.splice(i, 1)
}
function sumTotal(item: _IOrderGoods) {
  let total = 0
  let totalMoney = 0
  if (item.amount > 0 && item.salePrice > 0) {
    item.subtotalMoney = item.salePrice * item.amount
    temp.goodsList.forEach(e => {
      totalMoney += e.subtotalMoney
      total += e.amount
    })
    temp.total = total
    temp.totalMoney = totalMoney
  }
}
async function skuChange($event: any, i: number) {
  const { goodsId, sku } = $event
  temp.goodsList[i].salePrice = 0
  temp.goodsList[i].color = 0
  temp.goodsList[i].size = 0
  temp.goodsList[i].sku = sku
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
  temp.goodsList[i].colorOptions = arr
}
function colorChange(color: number, e: _IOrderGoods) {
  let choosen = e.colorOptions.filter(e => e.color === color)
  e.sizeOptions = choosen[0].sizes
}
function sizeChange(size: number, e: _IOrderGoods) {
  let choosen = e.sizeOptions.filter(e => e.size === size)
  e.currentStock = choosen[0].currentStock
  e.stockId = choosen[0].stockId
  if (e.amount === 0 && e.currentStock > 0) {
    e.amount = 1
    sumTotal(e)
  }
}
function amountChange(e: _IOrderGoods) {
  if (e.amount <= e.currentStock) {
    sumTotal(e)
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
