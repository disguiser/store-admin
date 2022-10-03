<template>
  <div ref="main" v-loading="loading" class="app-container">
    <template v-if="!loading">
      <h3 style="margin: 0;font-weight:normal;margin-bottom: 10px">益谦服饰-出货单</h3>
      <div class="head" style="margin-bottom: 10px;text-align:left;">
        <span>接收方名称：{{ order.name }}</span>
        <span style="margin-left: 10px">手机号：{{ order.mobile }}</span>
        <span style="margin-left: 10px">地址：{{ order.address | addressFilter }}{{ order.addressDetail }}</span>
      </div>
      <table>
        <tr>
          <td>款号</td>
          <td>品名</td>
          <td>颜色</td>
          <td v-for="s in sizes" :key="s.itemCode" style="white-space:break-spaces;">{{ s.itemName | sizeFilter }}</td>
          <td>小计</td>
          <td>单价</td>
          <td>金额合计</td>
        </tr>
        <tr v-for="(e, i) in list" :key="i">
          <td>{{ e.preSku }}</td>
          <td>{{ e.name }}</td>
          <td>{{ colorObj[e.color] }}</td>
          <td v-for="s in sizes" :key="s.itemCode">{{ e[s.itemCode] }}</td>
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
          <span>下单时间:{{ order.orderTime | timeFilter }}</span>
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

<script>
import orderPrint from '../orderPrint'
import { getDetailByOrderId } from '@/api/order'
import { findOne } from '@/api/customer'
export default {
  filters: {
    sizeFilter(val) {
      if (val) {
        // console.log(val)
        return val.split('/').join('\n')
      } else {
        return ''
      }
    }
  },
  mixins: [orderPrint],
  data() {
    return {
      sizes: [],
      debt: null
    }
  },
  async mounted() {
    let {
      data: { debt }
    } = await findOne(this.order.buyer)
    this.debt = debt
  },
  methods: {
    async dealData() {
      this.loading = true
      let res = await getDetailByOrderId(this.order.id)
      let list = res.data.items
      let preSku = {}
      let sizes = []
      for (let e of list) {
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

        if (!sizes.includes(e.size)) {
          sizes.push(e.size)
        }
      }
      this.list = Object.values(preSku).flatMap(e => Object.values(e))
      this.sizes = sizes.map(e => {
        return {
          itemCode: e,
          itemName: this.sizeObj[e]
        }
      }).sort((a, b) => {
        if (a.itemName > b.itemName) {
          return 1
        } else {
          return -1
        }
      })
      this.loading = false
    }
  }
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
.app-container {
  // display: flex;
  // flex-direction: column;
  // align-content: center;
  font-size: 10pt;
  width: 20cm;
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
