<template>
  <div v-loading="loading" class="print_container">
    <template v-if="!loading">
      <h1>益谦服饰</h1>
      <span>**************************</span>
      <div class="section3">
        <label>订单编号：{{ order.id }}</label>
        <label>下单时间：</label>
        <span>{{ order.orderTime | timeFilter }}</span>
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
              <div>{{ e.name }} {{ colorObj[e.color] }} {{ sizeObj[e.size] }}</div>
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
      </div>
      <span>**************************</span>
    </template>
  </div>
</template>

<script>
import { getDetailByOrderId } from '@/api/order'
import orderPrint from '../orderPrint'
export default {
  mixins: [orderPrint],
  methods: {
    async dealData() {
      this.loading = true
      let res = await getDetailByOrderId(this.order.id)
      this.list = res.data.items
      this.loading = false
      this.$nextTick(() => {
        window.print()
        window.close()
      })
    }
  }
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
.section1 {
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
