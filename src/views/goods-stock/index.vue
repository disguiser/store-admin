<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.preSku" clearable placeholder="款号" style="width: 200px;margin-right:8px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-input v-model="listQuery.phone" clearable placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="useCheckPermission(['Admin', 'Boss'])" class="filter-item" style="margin-left: 10px" type="success" icon="el-icon-plus" @click="handleCreate">
        新增商品
      </el-button>
      <!-- <el-radio-group v-model="view" style="margin-left: 8px">
        <el-radio label="table">表格视图</el-radio>
        <el-radio label="gallery">画廊视图</el-radio>
      </el-radio-group> -->
      <div style="float:right;color:red;font-size:20px;">
        <count-up :start-val="0" :end-val="totalAmount" :duration="1000" :decimals="0" separator="," suffix=" 件" :autoplay="true" />
      </div>
    </div>

    <div v-if="view === 'table'">
      <el-table
        :key="key"
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
            <stock
              :list="row.stocks"
              :goods-id="row.id"
              :dept-id="listQuery.deptId"
              :size-group="row.sizeGroup"
              @stockUpdated="stockUpdated($event, row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="货号" prop="sku" align="center" sortable width="90" />
        <el-table-column label="厂家款号" prop="preSku" align="center" sortable width="100" />
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
            <el-button size="small" type="danger" @click="handleRemove(row, $index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <gallery-view v-else :list="list" :total="total" :loading="listLoading" @loadMore="loadMore" />

    <goods-info
      ref="goodsInfo"
      :dialog.sync="infoVisible"
      :temp="temp"
      :title="dialogStatus"
      :dialog-status="dialogStatus"
      @confirm="dialogStatus==='新建'?createData():updateData()"
    />

  </div>
</template>

<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import { useCheckPermission } from '@/hooks/useCheckPermission'
import { findByDept as findGoods, update, create, remove } from '@/api/goods'
// import CosUpload from '@/components/CosUpload'
import GalleryView from './GalleryView.vue'
import DeptStock from './DeptStock.vue'
import GoodsInfo from '@/views/goods-list/GoodsInfo.vue'
import { reactive, ref } from 'vue'
import { useDictStore } from '@/store/dict'
import { useRoute } from 'vue-router'
import { Goods, IGoods } from '@/model/Goods'
import { ElLoading, ElMessage, ElNotification } from 'element-plus'
import { MessageBox } from '@element-plus/icons-vue'
import { IStock, Stock } from '@/model/Stock'

const dialogStatus = ref<'新建' | '编辑'>('新建')
const showImg = ref<boolean>(false)
const view = ref<'table' | 'gallery'>('table')
const list = ref<IGoods[]>()
const total = ref(0)
const key = ref(0)
const listLoading = ref(true)
const listQuery = reactive({
  page: 1,
  preSku: undefined,
  name: undefined,
  sort: undefined,
  deptId: null
})
const temp = ref<IGoods>(new Goods())
const tempIndex = ref<number>()
const infoVisible = ref(false)
const totalAmount = ref(0)
const { colorObj, sizeObj } = useDictStore()
const route = useRoute()
listQuery.deptId = parseInt(route.params?.id as string)
// const deptName = this.$route.params && this.$route.params.deptName
getList()
async function querySearchAsync(queryString: string, callback: Function) {
  const res = await findGoods({
    page: 1,
    limit: 20,
    sku: queryString
  })
  callback(res.data.items.map((e: IGoods) => {
    return { value: e.sku, data: e }
  }))
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
  temp.value = new Goods()
  tempIndex.value = undefined
  dialogStatus.value = '新建'
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
function handleUpdate(row: IGoods, index: number) {
  dialogStatus.value = '编辑'
  temp.value = row
  tempIndex.value = index
  infoVisible.value = true
}
async function updateData() {
  const loading = ElLoading.service()
  try {
    await update(temp.value)
    list.value.splice(tempIndex.value, 1, temp.value)
    // this.key++
    infoVisible.value = false
    ElNotification({
      title: '成功',
      message: '更新成功',
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
function handleRemove(row: IGoods, index: number) {
  MessageBox.confirm('确定删除该商品及其所有库存?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const loading = ElLoading.service()
    try {
      await remove(row.id)
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
async function getList() {
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
          sku: item.sku,
          preSku: item.preSku,
          name: item.name,
          sizeGroup: item.sizeGroup,
          imgUrl: item.imgUrl,
          salePrice: item.salePrice,
          costPrice: item.costPrice,
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
  row.stocks = list
  rebuildedStocks.set(row.id, rebuildStocks(list))
}
function rebuildStocks(arr: IStock[]) {
  const res = new Map<string, Map<string, number>>()
  const sizeSet = arr.reduce((a, b) => {
    a.add(sizeObj[b.size])
    return a
  }, new Set<string>())
  for (const obj of arr) {
    const color = colorObj[obj.color]
    if (!res.has(color)) {
      res.set(
        color,
        Array.from(sizeSet).sort().reduce((a: Map<string, number>, b: string) => {
          a.set(b, 0)
          return a
        }, new Map([['颜色', color]]))
      )
    }
    res.get(color).set(sizeObj[obj.size], obj.currentStock)
  }
  return Array.from(res.values())
}
function handleFilter() {
  listQuery.page = 1
  getList()
}
function handleImgVal(val: string) {
  temp.value.imgUrl = val
}
function removeStock(i: number) {
  temp.value.stocks.splice(i, 1)
}

const rebuildedStocks = reactive<Map<number, Map<string, number | string>[]>>(
  new Map<number, Map<string, number | string>[]>
)
</script>

<style lang="scss" scoped>
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
