import { create, remove } from '@/api/order'
export default {
  data() {
    return {
      list: null,
      total: 0,
      key: 0,
      listLoading: true,
      btnLoading: false,
      temp: {},
      dialogVisible: false,
      dateRange: null,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
  },
  created() {
    this.getList()
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      if (!this.listLoading) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = ''
            return
          } else if (index === 1) {
            sums[index] = '合计'
            return
          }
          if (column.property === 'total') {
            sums[index] = data.reduce((a, b) => {
              a += b.total
              return a
            }, 0)
            sums[index] += '件'
          } else if (column.property === 'totalMoney') {
            sums[index] = data.reduce((a, b) => {
              a += b.totalMoney
              return a
            }, 0)
            sums[index] += '元'
          }
        })
      }
      return sums
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = prop
      } else if (order === 'descending') {
        this.listQuery.sort = '-' + prop
      } else {
        this.listQuery.sort = ''
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      if (!this.dialogVisible) {
        this.resetTemp()
        this.dialogVisible = true
      }
    },
    async createData() {
      let arr = []
      for (let e of this.temp.stockList) {
        // 必填
        if (!e.preSku || !e.color || !e.size || !e.subtotalMoney || !e.amount) {
          this.$message.error('内容不能为空!')
          return
        }
        // 选项防重复
        let a = e.sku + e.color + e.size
        if (!arr.includes(a)) {
          arr.push(a)
        } else {
          this.$message.error('货号颜色尺码不能重复!')
          return
        }
      }
      this.btnLoading = true
      try {
        let res = await create(this.temp)
        this.temp.createTime = new Date().getTime()
        this.temp.id = res.data
        this.list.unshift(this.temp)
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '下单成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        this.btnLoading = false
      }
    },
    async handleRemove(row, $index) {
      this.btnLoading = true
      try {
        await remove(row.id)
        this.list.splice($index, 1)
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.btnLoading = false
      }
    }
  }
}
