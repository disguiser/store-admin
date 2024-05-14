<template>
  <div class="main-container">
    <DeptFilter
      v-if="useCheckPermission(['Admin', 'Boss'])"
      v-model:active-index="listQuery.deptId"
      style="margin-right: 10px;"
    />
    <table-container style="flex: 1;">
      <template #filter-container>
        <input
          type="text"
          v-model="listQuery.preSku"
          placeholder="款号"
          style="width: 230px;margin-right:8px;"
          class="filter-item"
          @keyup.enter="handleFilter()"
        >
        <!-- <el-input v-model="listQuery.phone" clearable placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
        <el-button class="filter-item" type="primary" icon="Search" @click="handleFilter">
          搜索
        </el-button>
        <el-button
          v-if="useCheckPermission(['Admin', 'Boss'])"
          class="filter-item"
          style="margin-left: 10px"
          type="success" icon="Plus"
          @click="handleCreate"
        >
          新增商品
        </el-button>
        <!-- <el-radio-group v-model="view" style="margin-left: 8px">
          <el-radio label="table">表格视图</el-radio>
          <el-radio label="gallery">画廊视图</el-radio>
        </el-radio-group> -->
        <div style="float:right;color:red;font-size:20px;">
          <count-up :end-val="totalAmount">
            <template #suffix> 件</template>
          </count-up>
        </div>
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
            <dept-stock
              :list="row.stocks"
              :goods-id="row.id"
              :dept-id="listQuery.deptId"
              :size-group="row.sizeGroup"
              @stockUpdated="stockUpdated($event, row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="id" align="center" sortable width="90" />
        <el-table-column label="厂家货号" prop="preSku" align="center" sortable width="100" />
        <el-table-column label="商品名称" prop="name" align="center" sortable width="130" />
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
        <el-table-column label="售价" prop="salePrice" align="center" sortable width="75" />
        <el-table-column v-if="useCheckPermission(['Admin', 'Boss'])" label="进价" prop="costPrice" align="center" sortable width="75" />
        <el-table-column label="明细">
          <template #default="{row}">
            <table v-if="row.stocks.length > 0" class="stocks">
              <thead>
                <tr>
                  <th v-for="sk in rebuildedStocks.get(row.id)[0].keys()">{{ sk }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in rebuildedStocks.get(row.id)">
                  <td v-for="sv in c.values()">{{ sv }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </el-table-column>
    
        <el-table-column v-if="useCheckPermission(['Admin', 'Boss'])" label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template #default="{row, $index}">
            <el-button type="primary" size="small" @click="handleUpdate(row, $index)">
              编辑
            </el-button>
            <el-button type="warning" size="small" @click="handleUpdate(row, $index)">
              盘点
            </el-button>
            <el-button
              v-if="useCheckPermission(['Admin'])"
              size="small"
              type="danger"
              @click="handleRemove(row, $index, listQuery.deptId)"
              style="margin-top: 10px;"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <gallery-view v-else :list="list" :total="total" :loading="listLoading" @loadMore="loadMore" />
      <template #footer>
        <el-pagination
          v-show="total>0"
          :total="total"
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :background="true"
          @current-change="getList"
          @size-change="getList"
        />
      </template>
    </table-container>
  </div>
  <goods-info
    ref="goodsInfo"
    v-model:dialog="infoVisible"
    :temp="temp"
    :title="dialogStatus"
    :dialog-status="dialogStatus"
    @confirm="dialogStatus==='新建'?createData():updateData()"
  />
</template>

<script setup lang="ts">
import { findByDept as findGoods } from '@/api/goods'
import TableContainer from '@/components/TableContainer.vue'
import { useCheckPermission } from '@/hooks/useCheckPermission'
import { useGoods } from '@/hooks/useGoods'
import { IGoods } from '@/model/Goods'
import { IStock, Stock } from '@/model/Stock'
import { useDictStore } from '@/store/dict'
import GoodsInfo from '@/views/goods-list/GoodsInfo.vue'
import { reactive, ref, computed, watch } from 'vue'
import CountUp from 'vue-countup-v3'
import { useRoute } from 'vue-router'
import DeptStock from './DeptStock.vue'
import GalleryView from './GalleryView.vue'
import DeptFilter from './DeptFilter.vue'
import { useUserStore } from '@/store/user'

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
const totalAmount = ref(0)
const { colorMap, sizeMap } = useDictStore()
const route = useRoute()
const userStore = useUserStore()
if (userStore.roles.includes('Waiter')) {
  listQuery.deptId = userStore.deptId
} else {
  listQuery.deptId = computed(() => {
    return parseInt(route.query.deptId as string)
  })
  watch(() => listQuery.deptId, getList)
}
getList()

async function getList() {
  tableEl.value?.setScrollTop(0)
  listLoading.value = true
  totalAmount.value = 0
  try {
    const response = await findGoods(listQuery)
    const map = new Map<number, IGoods>()
    for (const item of response.data.items) {
      totalAmount.value += item.currentStock
      if (!map.has(item.id)) {
        map.set(item.id, {
          id: item.id,
          preSku: item.preSku,
          name: item.name,
          sizeGroup: item.sizeGroup,
          imgUrl: item.imgUrl,
          salePrice: item.salePrice,
          costPrice: item.costPrice,
          wholesalePrice: item.wholesalePrice,
          discount: item.discount,
          stocks: [
            new Stock({
              color: item.color,
              size: item.size,
              currentStock: item.currentStock
            })
          ]
        })
      } else {
        map.get(item.id).stocks.push(
          new Stock({
            color: item.color,
            size: item.size,
            currentStock: item.currentStock
          })
        )
      }
    }
    list.value = Array.from(map.values())
    total.value = response.data.total
    list.value.map(e => {
      rebuildedStocks.set(e.id, rebuildStocks(e.stocks))
    })
  } catch (error) {
    console.error(error)
  } finally {
    listLoading.value = false
  }
}
async function loadMore() {
  try {
    listQuery.page += 1
    const res = await findGoods(listQuery)
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
function stockUpdated(list: IStock[], row: IGoods) {
  rebuildedStocks.set(row.id, rebuildStocks(list))
}
// TO-DO
function rebuildStocks(stocks: IStock[]) {
  const res = new Map<string, Map<string, number | string>>()
  const sizeSet = stocks.reduce((a, b) => {
    a.add(sizeMap.get(b.size))
    return a
  }, new Set<string>())
  for (const stock of stocks) {
    const color = colorMap.get(stock.color)
    if (!res.has(color)) {
      res.set(
        color,
        Array.from(sizeSet).sort().reduce((a: Map<string, number|string>, b: string) => {
          a.set(b, 0)
          return a
        }, new Map([['颜色', color]]))
      )
    }
    res.get(color).set(sizeMap.get(stock.size), stock.currentStock)
  }
  return Array.from(res.values())
}

const rebuildedStocks = reactive<Map<number, Map<string, number | string>[]>>(
  new Map<number, Map<string, number | string>[]>
)
</script>

<style lang="scss" scoped>
  .main-container {
    display: flex;
    // grid-template-columns: max-content 1fr;
    // gap: 10px;
  }
  td {
    text-align: center;
  }
  .stocks {
    width: 100%;
    th {
      text-align: center;
    }
  }
  .cell {
    padding: 0px 5px;
  }
</style>
