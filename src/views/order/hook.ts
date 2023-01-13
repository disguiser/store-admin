import { create, remove } from '@/api/order'
import { IOrder } from "@/model/Order"
import { DateModelType, ElMessageBox, ElNotification } from "element-plus"
import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"
import { ref } from "vue"

export type ListItem = IOrder & {
  loading?: boolean
}
interface SummaryMethodProps<T = IOrder> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
export function useHook() {
  const list = ref<ListItem[]>()
  const total = ref(0)
  const listLoading = ref(true)
  const btnLoading = ref(false)
  const temp = ref<IOrder>()
  const dialogVisible = ref(false)
  const dateRange = ref<[Date, Date]>(null)
  const pickerOptions = [{
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
  function getSummaries(param: SummaryMethodProps) {
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
          }, 0) + '件'
        } else if (column.property === 'totalMoney') {
          sums[index] = data.reduce((a, b) => {
            a += b.totalMoney
            return a
          }, 0) + '元'
        }
      })
    }
    return sums
  }
  async function createData() {
    const arr: string[] = []
    for (let e of temp.value.itemList) {
      // 必填
      if (!e.preSku || !e.color || !e.size || !e.subtotalMoney || !e.amount) {
        ElMessageBox.alert('内容不能为空!')
        return
      }
      // 选项防重复
      let a = e.sku + e.color + e.size
      if (!arr.includes(a)) {
        arr.push(a)
      } else {
        ElMessageBox.alert('货号颜色尺码不能重复!')
        return
      }
    }
    btnLoading.value = true
    try {
      const res = await create(temp.value)
      temp.value.orderTime = new Date()
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
  async function handleRemove(row: IOrder, $index: number) {
    btnLoading.value = true
    try {
      await remove(row.id!)
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
  return {
    list,
    total,
    listLoading,
    temp,
    dateRange,
    pickerOptions,
    btnLoading,
    dialogVisible,
    getSummaries,
    createData,
    handleRemove
  }
}