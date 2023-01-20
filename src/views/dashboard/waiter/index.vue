<template>
  <div v-loading="loading">
    <el-row :gutter="20" style="margin-bottom: 32px;">
      <CardPanel
        :span="6"
        icon="ic:sharp-point-of-sale"
        text="今日零售"
        :result="retailAmount"
        @click="setOption('retail')"
      >
        <template #suffix> 件</template>
      </CardPanel>
      <CardPanel
        :span="6"
        icon="clarity:factory-line"
        text="今日批发"
        :result="wholesaleAmount"
        @click="setOption('wholesale')"
      >
        <template #suffix> 件</template>
      </CardPanel>
      <Sales
        :totalMoney="totalMoney"
        @setOption="echarts.setOption($event)"
      />
      <CardPanel
        :span="6"
        icon="vaadin:stock"
        text="库存"
        :result="totalStock"
      >
        <!-- @setOption="generateOption('stock')" -->
        <template #suffix> 件</template>
      </CardPanel>
    </el-row>
    <Echarts ref="echarts" v-loading="chartLoading" @ready="setOption('retail')" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { dailyAmount, dailyMoney, chartAmount } from '@/api/order'
import { sumByDept } from '@/api/stock'
import { CategoryEnum } from '@/model/Order';
import CardPanel from '../components/CardPanel.vue'
import Sales from '../components/Sales.vue'
import Echarts from '../components/Echarts.vue'
import { transitionWeekData, initBarOption } from '@/utils/index'

const wholesaleAmount = ref<number>(0)
const retailAmount = ref<number>(0)
const totalMoney = ref<number>(0)
const totalStock = ref<number>(0)
const loading = ref<boolean>(true)
const chartLoading = ref<boolean>(false)

const option: any = initBarOption()

const dailyWholesale = dailyAmount({
  category: CategoryEnum.wholesale,
})

const dailyRetail = dailyAmount({
  category: CategoryEnum.retail,
})

Promise.all([dailyRetail, dailyWholesale, dailyMoney(), sumByDept()]).then((res: any) => {
  retailAmount.value = res[0].data
  wholesaleAmount.value = res[1].data
  totalMoney.value = res[2].data
  totalStock.value = res[3].data
  loading.value = false
}).catch(err => {
  console.error(err)
  loading.value = false
})
const echarts = ref()
async function setOption(type: string) {
  chartLoading.value = true
  try {
    let res
    if (type === 'wholesale') {
      res = await chartAmount({
        category: CategoryEnum.wholesale
      })
    } else if (type === 'retail') {
      res = await chartAmount({
        category: CategoryEnum.retail
      })
    }
    option.series = [{
      type: 'bar',
      stack: 'total',
      label: {
        show: true
      },
      data: transitionWeekData([res.data])[0]
    }]
    echarts.value.setOption(option)
  } catch (error) {
    console.error(error)
  } finally {
    chartLoading.value = false
  }
}
</script>
