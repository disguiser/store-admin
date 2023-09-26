<template>
  <div ref="mainRef" v-loading="loading" class="print_container">
    <template v-if="!loading">
      <h3 style="margin: 0;font-weight:normal;margin-bottom: 10px">益谦服饰-出货单</h3>
      <div v-if="order.buyer" class="head" style="margin-bottom: 10px;text-align:left;">
        <span>接收方名称：{{ order.name }}</span>
        <span style="margin-left: 10px">手机号：{{ order.mobile }}</span>
        <span style="margin-left: 10px">地址：{{ addressFilter(order.address) }}{{ order.addressDetail }}</span>
      </div>
      <table>
        <tr>
          <td>款号</td>
          <td>品名</td>
          <td>颜色</td>
          <td v-for="s in sizes" :key="s.id" style="white-space:break-spaces;">{{ sizeFilter(s.itemName) }}</td>
          <td>小计</td>
          <td>单价</td>
          <td>金额合计</td>
        </tr>
        <tr v-for="(e, i) in list" :key="i">
          <td>{{ e.preSku }}</td>
          <td>{{ e.name }}</td>
          <td>{{ colorMap.get(e.color) }}</td>
          <td v-for="s in sizes" :key="s.id">{{ e[s.id] }}</td>
          <td>{{ e.subtotal }}</td>
          <td>{{ e.salePrice }}</td>
          <td>{{ e.subtotal * e.salePrice }}</td>
        </tr>
      </table>
      <div style="margin-top: 10px">
        <div class="head-foot">
          <span>总数:{{ order.total }}</span>
          <span>金额合计:{{ order.totalMoney }}</span>
        </div>
        <div class="head-foot">
          <span>地址:济南泺口服装城商贸中心2楼东区2354</span>
          <span>建设银行卡号: 6214662340297106</span>
        </div>
        <div class="head-foot">
          <span>联系方式: 18553108836</span>
          <span>下单时间:{{ parseTime(order.createTime) }}</span>
        </div>
        <div v-if="debt" class="head-foot">
          <span class="debt">欠款：{{ debt }}</span>
          <!-- <span class="debt-input">欠款：<input v-model="debt"></span> -->
        </div>
      </div>
      <div class="btn" style="float: right;">
        <button type="button" @click="print">打印</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getDetailByOrderId } from '@/api/order'
import { findOne } from '@/api/customer'
import { nextTick, onMounted, ref } from 'vue';
import { useOrderPrint } from '../useOrderPrint';
import { addressFilter } from '@/utils';
import { parseTime } from '@/utils';
const {
  sizeMap,
  colorMap,
  userName,
  loading,
  order
} = useOrderPrint()
const debt = ref(false)

onMounted(async() => {
  if (order.value.buyer) {
    let {
      data
    } = await findOne(order.value.buyer)
    debt.value = data.debt
  }
})

const mainRef = ref()
function print() {
  mainRef.value.classList.add('print')
  nextTick(() => {
    window.print()
    mainRef.value.classList.remove('print')
  })
}

function sizeFilter(val: string) {
  if (val) {
    return val.split('/').join('\n')
  } else {
    return ''
  }
}

const list = ref()
const sizes = ref()
dealData()
async function dealData() {
  loading.value = true
  const { data } = await getDetailByOrderId(order.value.id)
  const preSku: any = {}
  const _sizes: any = []
  for (let e of data) {
    if (!preSku[e.preSku]) {
      preSku[e.preSku] = {}
    }
    if (!preSku[e.preSku][e.color]) {
      preSku[e.preSku][e.color] = {}
      preSku[e.preSku][e.color]['name'] = e.name
      preSku[e.preSku][e.color]['preSku'] = e.preSku
      preSku[e.preSku][e.color]['color'] = e.color
      preSku[e.preSku][e.color]['salePrice'] = e.salePrice
      preSku[e.preSku][e.color]['subtotal'] = 0
    }
    preSku[e.preSku][e.color][e.size] = e.amount
    preSku[e.preSku][e.color]['subtotal'] += e.amount

    if (!_sizes.includes(e.size)) {
      _sizes.push(e.size)
    }
  }
  list.value = Object.values(preSku).flatMap(e => Object.values(e))
  sizes.value = _sizes.map((e: any) => {
    return {
      id: e,
      itemName: sizeMap.get(e)
    }
  }).sort((a: any, b: any) => {
    if (a.itemName > b.itemName) {
      return 1
    } else {
      return -1
    }
  })
  loading.value = false
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  border-spacing: 0;
  td {
    min-width: 50px;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
  }
}
.print_container {
  // display: flex;
  // flex-direction: column;
  // align-content: center;
  padding: 10px;
  font-size: 10pt;
  width: 22cm;
  text-align: center;
}

.head-foot {
  display: flex;
  justify-content: space-between;
}
.print {
  // position: fixed;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // z-index: 1002;
  // background-color: white;
  .btn {
    visibility: hidden;
  }
  // .debt-input {
  //   visibility: hidden;
  // }
  // .debt {
  //   visibility: visible;
  // }
}
// .debt {
//   visibility: hidden;
// }
</style>
