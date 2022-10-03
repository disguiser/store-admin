import { ref } from "vue"
import { create, remove } from '@/api/order'
import { ElMessage, ElNotification } from "element-plus"

export function useHook() {
  const list = ref(null)
  const total = ref(0)
  const key = ref(0)
  const listLoading = ref(true)
  const btnLoading = ref(false)
  const temp = ref({})
  const dialogVisible = ref(false)
  const dateRange = ref(null)
  const pickerOptions = {
    shortcuts: [{
      text: '最近一周',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      }
    }, {
      text: '最近一个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      }
    }, {
      text: '最近三个月',
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      }
    }]
  }
  function getSummaries(param) {
    const { columns, data } = param
    const sums: string[] = []
    if (!listLoading.value) {
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
  }
  function sortChange(data) {
    const { prop, order } = data
    if (order === 'ascending') {
      listQuery.value.sort = prop
    } else if (order === 'descending') {
      listQuery.value.sort = '-' + prop
    } else {
      listQuery.value.sort = ''
    }
    handleFilter()
  }
  function handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }
  function handleCreate() {
    if (!this.dialogVisible) {
      this.resetTemp()
      this.dialogVisible = true
    }
  }
  async function createData() {
    let arr = []
    for (let e of temp.stockList) {
      // 必填
      if (!e.preSku || !e.color || !e.size || !e.subtotalMoney || !e.amount) {
        ElMessage.error('内容不能为空!')
        return
      }
      // 选项防重复
      let a = e.sku + e.color + e.size
      if (!arr.includes(a)) {
        arr.push(a)
      } else {
        ElMessage.error('货号颜色尺码不能重复!')
        return
      }
    }
    btnLoading.value = true
    try {
      const res = await create(temp.value)
      temp.value.orderTime = new Date().getTime()
      temp.value.id = res.data
      list.value.unshift(temp.value)
      dialogVisible.value = false
      ElNotification({
        title: '成功',
        message: '下单成功',
        type: 'success',
        duration: 2000
      })
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      btnLoading.value = false
    }
  }
  async function handleRemove(row, $index) {
    btnLoading.value = true
    try {
      await remove(row.id)
      list.value.splice($index, 1)
      ElNotification({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    } catch (error) {
      console.error(error)
    } finally {
      btnLoading.value = false
    }
  }
}