<template>
  <div class="page-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.preSku"
        clearable
        placeholder="款号"
        style="width: 230px"
        input-style="width: 230px;margin-right:8px;"
        class="filter-item"
        @keyup.enter="handleFilter()"
      /> -->
      <input
        type="text"
        v-model="listQuery.preSku"
        placeholder="款号"
        style="width: 230px;margin-right:8px;"
        class="filter-item"
        @keyup.enter="handleFilter()"
      >
      <!-- <el-input v-model="listQuery.phone" clearable placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-button
        class="filter-item"
        type="primary"
        icon="Search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="success"
        icon="Plus"
        @click="handleCreate"
      >
        新增商品
      </el-button>
      <!-- <el-checkbox v-model="showImg" class="filter-item" style="margin-left:15px;" @change="key=key+1">
        显示图片
      </el-checkbox> -->
      <!-- <el-radio-group v-model="view" style="margin-left: 8px">
        <el-radio label="table">表格视图</el-radio>
        <el-radio label="gallery">画廊视图</el-radio>
      </el-radio-group> -->
    </div>

    <div v-if="view === 'table'">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        type="expand"
        style="width: 100%"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @sort-change="sortChange"
      >
        <el-table-column type="expand">
          <template #default="{row}">
            <suspense>
              <depts-stock :goods-id="row.id" :size-group="row.sizeGroup" />
            </suspense>
          </template>
        </el-table-column>
        <el-table-column label="货号" prop="sku" align="center" sortable />
        <el-table-column label="厂家款号" prop="preSku" align="center" sortable />
        <el-table-column label="商品名称" prop="name" align="center" sortable />
        <el-table-column v-if="showImg" label="图片" prop="imageUrl" align="center" width="220">
          <template #default="{row}">
            <el-image
              :src="`${row.imgUrl}?imageMogr2/thumbnail/200x`"
              :preview-src-list="new Array(row.imgUrl)"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="font-size: 40px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="售价" prop="salePrice" align="center" sortable />
        <el-table-column v-if="useCheckPermission(['Admin', 'Boss'])" label="进价" prop="costPrice" align="center" sortable />
        <!-- <el-table-column label="折扣" prop="discount" align="center" sortable /> -->

        <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
          <template #default="{row, $index}">
            <el-button type="primary" size="small" @click="handleUpdate(row, $index)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleRemove(row, $index)">
              删除
            </el-button>
            <el-button v-if="useCheckPermission(['Admin', 'Boss'])" size="small" type="warning" @click="handlePrint(row)">
              打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <gallery-view v-else :list="list" :total="total" :loading="listLoading" @loadMore="loadMore" />

    <goods-info
      ref="goodsInfo"
      v-model:dialog="infoVisible"
      :temp="temp!"
      :title="dialogStatus"
      @confirm="dialogStatus==='新建'?createData():updateData()"
    />
  </div>
</template>

<script setup lang="ts" name="GoodsList">
import { findByPage as findGoods, update, create, remove } from '@/api/goods'
import Pagination from '@/components/Pagination/index.vue'
import GalleryView from './GalleryView.vue'
import DeptsStock from './DeptsStock.vue'
import { useCheckPermission } from '@/hooks/useCheckPermission'
import GoodsInfo from './GoodsInfo.vue'
import { reactive, ref } from 'vue'
import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { IGoods, Goods } from '@/model/Goods'
import { useGoodsStore } from '@/store/goods'
import { useRouter } from 'vue-router'
const router = useRouter()

const dialogStatus = ref('')
const showImg = ref(false)
const view = ref('table')
// const list = ref<IGoods[]>([])
const list = ref<IGoods[]>([])
const total = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  limit: 20,
  preSku: '',
  name: '',
  sort: ''
})
const temp = ref<IGoods>()
const tempIndex = ref<number | null>()
const infoVisible = ref(false)

function resetTemp() {
  temp.value = new Goods()
  tempIndex.value = null
}
resetTemp()

async function getList() {
  listLoading.value = true
  const response = await findGoods(listQuery)
  list.value = response.data.items
  total.value = response.data.total
  listLoading.value = false
}
getList()
function handleFilter() {
  listQuery.page = 1
  getList()
}
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
function handleCreate() {
  resetTemp()
  dialogStatus.value = '新建'
  infoVisible.value = true
  // this.$nextTick(() => {
  //   this.$refs.goodsInfo.$refs.dataForm.clearValidate()
  // })
}
async function createData() {
  const loading = ElLoading.service()
  try {
    if (temp.value) {
      const res = await create(temp)
      temp.value.id = res.data.id
      temp.value.sku = res.data.sku
      list.value.unshift(temp.value)
      infoVisible.value = false
      ElNotification({
        title: '成功',
        message: '新建成功',
        type: 'success',
      })
    }
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    loading.close()
  }
}
function handleUpdate(row: IGoods, index: number) {
  dialogStatus.value = '编辑'
  const temp = Object.assign({}, row)
  tempIndex.value = index
  infoVisible.value = true
  // this.$nextTick(() => {
  //   this.$refs.goodsInfo.$refs.dataForm.clearValidate()
  // })
}
async function updateData() {
  const loading = ElLoading.service()
  try {
    if (temp.value && tempIndex.value) {
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
function handleRemove(row: IGoods, index: number) {
  ElMessageBox.confirm('确定删除该商品及其所有库存?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const loading = ElLoading.service()
    try {
      await remove(row.id!)
      ElNotification({
        title: '成功',
        message: '删除成功',
        type: 'success'
      })
      list.value.splice(index, 1)
    } catch (error) {
      console.error(error)
    } finally {
      loading.close()
    }
  })
}
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
const goodsStore = useGoodsStore()
async function handlePrint(row: IGoods) {
  const stock = await goodsStore.setGoods(row)
  if (stock.length === 0) {
    ElMessage.error('没有库存可供打印')
  } else {
    router.push('/print/list')
  }
}
</script>

<style lang="scss" scoped>
  td {
    text-align: center;
  }
</style>
