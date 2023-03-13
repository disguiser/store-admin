<template>
  <div v-loading="loading" class="print_container">
    <h1>益谦服饰</h1>
    <span>**************************</span>
    <div class="section3">
      <label>订单编号：{{ order.id }}</label>
      <label>下单时间：</label>
      <span>{{ parseTime(order.createTime) }}</span>
    </div>
    <span>**************************</span>
    <div class="section4">
      <div style="border-bottom: 1px solid #dadada">
        <div style="width: 100%">
          <div class="grid">
            <div>品名</div>
            <div>数量</div>
            <div>金额</div>
          </div>
          <div v-for="(e, i) in list" :key="i">
            <div>{{ e.name }} {{ colorMap.get(e.color) }} {{ sizeMap.get(e.size) }}</div>
            <div class="grid">
              <div></div>
              <div>{{ e.amount }}</div>
              <div>{{ e.amount * e.salePrice }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="total">
        <label class="left">总计</label>
        <label class="right">{{ order.totalMoney }}</label>
        <div class="clearfix"></div>
      </div>
      <span>**************************</span>
    </div>
    <div class="section5">
      <label>操作员：{{ userName }}</label>
      <label>地址：济南泺口服装城商贸中心2楼东区2354</label>
      <label>电话：18553108836</label>
      <!-- <QRCodeVue3
        :width="100"
        :height="100"
        value="Simple QR code"
      /> -->
      <img src="/weixin-qrcode.png" style="width: 100px;height: 100px;">
    </div>
    <span>**************************</span>
  </div>
</template>

<script setup lang="ts">
import { getDetailByOrderId } from '@/api/order'
import { parseTime } from '@/utils/index'
import { useOrderPrint } from '../useOrderPrint'
import { ref } from 'vue';
import { OrderWithDetail } from '@/model/Order';
// import QRCodeVue3 from "qrcode-vue3";

const {
  sizeMap,
  colorMap,
  userName,
  loading,
  order
} = useOrderPrint()
const list = ref<OrderWithDetail[]>()
dealData()
async function dealData() {
  const res = await getDetailByOrderId(order.value.id)
  list.value = res.data.items
  loading.value = false
  // await nextTick()
  setTimeout(() => {
    window.print()
    window.close()
  }, 200)
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: 59% 21% 20%;
}
h1 {
  font-size: 20px;
}
h3 {
  font-size: 16px;
}
.left {
  float: left;
}
.right {
  float: right;
}
.clearfix {
  clear: both;
}
ul {
  list-style: none;
}
.print_container {
  width: 180px;
  font-size: 15px;
}
.section2 label {
  display: block;
}
.section3 label {
  display: block;
}
.section4 .total label {
  display: block;
}
.section4 .other_fee {
  border-bottom: 1px solid #dadada;
}
.section5 label {
  display: block;
  font-size: 13px;
}
</style>
