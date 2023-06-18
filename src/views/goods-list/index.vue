<template>
  <table-container>
    <template #filter-container>
      <el-input
        v-model="listQuery.preSku"
        clearable
        placeholder="款号"
        style="width: 230px;margin-right:8px;"
        class="filter-item"
        @keyup.enter="handleFilter()"
        @clear="handleFilter"
      />
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
        data-test="add-btn"
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
    </template>
    <el-table
      v-if="view === 'table'"
      ref="tableEl"
      v-loading="listLoading"
      :data="list"
      border
      fit
      type="expand"
      style="width: 100%;height: 100%;"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template #default="{row}">
          <depts-stock :goods-id="row.id" :size-group="row.sizeGroup" />
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="id" align="center" sortable />
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

      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template #default="{row, $index}">
          <el-button data-test="editGoods-btn" type="primary" size="small" @click="handleUpdate(row, $index)">
            编辑
          </el-button>
          <el-button v-if="useCheckPermission(['Admin'])" data-test="delGoods-btn" size="small" type="danger" @click="handleRemove(row, $index)">
            删除
          </el-button>
          <el-button v-if="useCheckPermission(['Admin', 'Boss'])" size="small" type="warning" @click="handlePrint(row)">
            打印
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <gallery-view v-else :list="list" :total="total" :loading="listLoading" />
    <template #footer>
      <el-pagination
        v-show="total>0"
        :total="total"
        v-model:current-page="listQuery.page"
        v-model:page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :background="true"
        @size-change="getList"
        @current-change="getList"
      />
    </template>
  </table-container>

  <goods-info
    ref="goodsInfo"
    v-model:dialog="infoVisible"
    :temp="temp!"
    :title="dialogStatus"
    @confirm="dialogStatus==='新建'?createData():updateData()"
  />
</template>

<script setup lang="ts">
import { findByPage as findGoods } from '@/api/goods'
import TableContainer from '@/components/TableContainer.vue'
import { useCheckPermission } from '@/hooks/useCheckPermission'
import { useGoods } from '@/hooks/useGoods'
import { IGoods } from '@/model/Goods'
import { useGoodsStore } from '@/store/goods'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import DeptsStock from './DeptsStock.vue'
import GalleryView from './GalleryView.vue'
import GoodsInfo from './GoodsInfo.vue'

defineOptions({
  name: 'GoodsList'
})

const {
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
} = useGoods(getList)

async function getList() {
  tableEl.value?.setScrollTop(0)
  listLoading.value = true
  const response = await findGoods(listQuery)
  list.value = response.data.items
  // list.value = []
  total.value = response.data.total
  listLoading.value = false
}

getList()

const router = useRouter()
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
