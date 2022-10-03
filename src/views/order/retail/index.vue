<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        style="margin: 0 8px"
      />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-permission="['Admin', 'Waiter']" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">
        下单
      </el-button>
    </div>

    <el-table
      ref="table"
      :key="key"
      v-loading="listLoading"
      :data="list"
      border
      fit
      show-summary
      :summary-method="getSummaries"
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <detail :order-id="row.id" />
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="id" align="center" />
      <el-table-column label="总数量" prop="total" align="center" />
      <el-table-column label="总金额" prop="totalMoney" align="center" />
      <el-table-column label="下单时间" prop="orderTime" align="center">
        <template slot-scope="{row}">
          <span>{{ new Date(row.orderTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="70" class-name="small-padding fixed-width">
        <div slot-scope="{row, $index}" class="btns-clomn">
          <el-button type="primary" size="mini" @click="goPrint(row)">
            打印
          </el-button>
          <el-button size="mini" type="danger" @click="handleRemove(row, $index)">
            删除
          </el-button>
        </div>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="下单" :visible.sync="dialogVisible" :close-on-click-modal="false" width="90%">
      <!-- <fieldset>
        <legend>Vip信息</legend>
        <el-form ref="dataForm" label-position="right" :inline="true" label-width="100px" :model="temp">
          <el-form-item label="姓名" prop="name">
            <el-select
              v-model="temp.name"
              placeholder="客户名称"
              filterable
              remote
              :remote-method="remoteVip"
              :loading="btnLoading"
              @focus="remoteVip"
              @change="vipChange"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            {{ temp.address }}
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            {{ temp.mobile }}
          </el-form-item>
        </el-form>
      </fieldset> -->
      <goods-table :temp="temp" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findByPage as findOrders } from '@/api/order'
import { findByPage as findCustomers } from '@/api/customer'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Detail from '../Detail'
import { mapGetters } from 'vuex'
import GoodsTable from '../GoodsTable'
import mixin from '../mixin'

export default {
  components: {
    Pagination,
    Detail,
    GoodsTable
  },
  mixins: [mixin],
  data() {
    return {
      debounceFlag: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: undefined,
        category: 2
      },
      customerOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'sizeObj',
      'colorObj'
    ])
  },
  methods: {
    resetTemp() {
      this.temp = {
        name: '',
        address: '',
        mobile: '',
        buyer: '',
        stockList: [
        ],
        total: null,
        totalMoney: null,
        category: 2
      }
    },
    remoteVip(query) {
      // TO-DO
      if (this.debounceFlag) {
        this.debounceFlag = false
        setTimeout(() => {
          this.debounceFlag = true
        }, 500)
        if (typeof (query) !== 'string') {
          query = query.target.value
        }
        this.btnLoading = true
        findCustomers({
          searchText: query
        }).then(res => {
          this.btnLoading = false
          this.customerOptions = res.data.items
        }).catch(err => {
          console.error(err)
          this.btnLoading = false
        })
      }
    },
    vipChange(val) {
      // TO-DO
      let option = this.customerOptions.filter(e => e.name === val)
      this.temp.mobile = option[0].mobile
      this.temp.address = option[0].address
      this.temp.buyer = option[0].id
    },
    getList() {
      this.listLoading = true
      let data = {}
      if (this.dateRange) {
        data = {
          startDate: this.dateRange[0].getTime(),
          endDate: this.dateRange[1].getTime(),
        }
      }
      findOrders(this.listQuery, data).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    async goPrint(order) {
      // await this.$store.dispatch('order/setOrder', order)
      // this.$router.push(`/order/print`)
      localStorage.setItem('order', JSON.stringify(order))
      window.open(`/#/retail/print`, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.btns-clomn {
  display: flex;
  flex-direction: column;
  height: 100px;
  justify-content: space-around;
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
