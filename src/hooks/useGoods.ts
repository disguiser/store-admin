import { ElLoading, ElMessageBox, ElNotification } from "element-plus"
import { findByPage as findGoods, create, update, remove } from '@/api/goods'
import { ref, reactive, watchEffect } from 'vue'
import { Goods, IGoods } from "@/model/Goods"
import { useRoute } from 'vue-router'

export function useGoods(getList: Function) {
  const tableEl = ref()
  const temp = ref<IGoods>(new Goods())
  const tempIndex = ref<number>()
  const list = ref<IGoods[]>()
  const infoVisible = ref(false)
  const dialogStatus = ref<'新建' | '编辑'>('新建')
  const showImg = ref(false)
  const view = ref('table')
  const total = ref(0)
  const listLoading = ref(true)
  const route = useRoute()
  const listQuery = reactive({
    page: 1,
    limit: 20,
    preSku: '',
    name: '',
    sort: '',
    deptId: null
  })

  function sortChange(data: any) {
    const { prop, order } = data
    if (order === 'ascending') {
      listQuery.sort = prop
    } else if (order === 'descending') {
      listQuery.sort = '-' + prop
    } else {
      listQuery.sort = ''
    }
    handleFilter()
  }

  function handleFilter() {
    listQuery.page = 1
    getList()
  }

  watchEffect(() => {
    listQuery.preSku = route.query.preSku as string
  })

  async function loadMore() {
    try {
      listQuery.page += 1
      let res = await findGoods(listQuery)
      if (res.data.items.length > 0) {
        list.value.concat(res.data.items)
        total.value = res.data.total
      }
    } catch (error) {
      console.error(error)
    } finally {
      listLoading.value = false
    }
  }

  function handleCreate() {
    temp.value = new Goods()
    tempIndex.value = undefined
    dialogStatus.value = '新建'
    infoVisible.value = true
  }
  
  function handleUpdate(row: IGoods, index: number) {
    dialogStatus.value = '编辑'
    temp.value = row
    tempIndex.value = index
    infoVisible.value = true
  }
  async function createData() {
    const loading = ElLoading.service()
    try {
      const res = await create(temp.value)
      temp.value.id = res.data.id
      temp.value.sku = res.data.sku
      list.value.unshift(temp.value)
      infoVisible.value = false
      ElNotification({
        title: '成功',
        message: '新建成功',
        type: 'success',
        duration: 2000
      })
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      loading.close()
    }
  }
  async function updateData() {
    const loading = ElLoading.service()
    try {
      if (temp.value && tempIndex.value >= 0) {
        await update(temp.value)
        list.value.splice(tempIndex.value, 1, temp.value)
        infoVisible.value = false
        ElNotification({
          title: '成功',
          message: '更新成功',
          type: 'success'
        })
      }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      loading.close()
    }
  }
  function handleRemove(row: IGoods, index: number, deptId?: number) {
    ElMessageBox.confirm('确定删除该商品及其所有库存?', 'Warning', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async() => {
      const loading = ElLoading.service()
      try {
        await remove(row.id, deptId)
        ElNotification({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        list.value.splice(index, 1)
      } catch (error) {
        console.error(error)
      } finally {
        loading.close()
      }
    })
  }
  return {
    tableEl,
    temp,
    list,
    infoVisible,
    dialogStatus,
    showImg,
    view,
    total,
    listLoading,
    listQuery,
    createData,
    updateData,
    handleCreate,
    handleUpdate,
    sortChange,
    handleFilter,
    handleRemove
  }
}