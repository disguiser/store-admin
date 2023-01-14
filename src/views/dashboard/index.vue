<template>
  <div class="dashboard-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col class="card-panel-col" :span="8">
        <div class="card-panel" @click="setOption('wholesale')">
          <el-icon>
            <Icon icon="clarity:factory-line"></Icon>
          </el-icon>
          <div class="right">
            <div class="text">今日批发</div>
            <count-up :end-val="wholesaleAmount">
              <template #suffix> 件</template>
            </count-up>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col" :span="8">
        <div class="card-panel" @click="setOption('retail')">
          <el-icon>
            <Icon icon="ic:sharp-point-of-sale"></Icon>
          </el-icon>
          <div class="right">
            <div class="text">今日零售</div>
            <count-up :end-val="retailAmount">
              <template #suffix> 件</template>
            </count-up>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col" :span="8">
        <div class="card-panel" @click="setOption('money')">
          <el-icon>
            <Icon icon="material-symbols:attach-money"></Icon>
          </el-icon>
          <div class="right">
            <div class="text">销售额</div>
            <count-up :end-val="totalMoney">
              <template #prefix>¥ </template>
              <template #suffix> 元</template>
            </count-up>
          </div>
        </div>
      </el-col>
    </el-row>
    <div id="echart" v-loading="chartLoading" style="width: 100%;height: 500px;"></div>
    <!-- <component :is="currentRole" /> -->
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import CountUp from 'vue-countup-v3'
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { Icon } from '@iconify/vue';
import { dailyAmount, dailyMoney, chartAmount, chartMoney } from '@/api/order'
import { CategoryEnum } from '@/model/Order';
import dayjs from 'dayjs';

const wholesaleAmount = ref<number>(0)
const retailAmount = ref<number>(0)
const totalMoney = ref<number>(0)
const loading = ref<boolean>(true)
const chartLoading = ref<boolean>(false)
const week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const day = new Date().getDay()
let xAxisData = week.slice(day + 1).concat(week.slice(0, day + 1)).reverse()

xAxisData = xAxisData.map((d: string, index: number) => {
  return `${d}(${dayjs().subtract(index, 'day').format('D')})`
})
const option = reactive({
    tooltip: {},
    xAxis: {
      data: xAxisData.reverse()
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })
let myChart: echarts.ECharts

const dailyWholesale = dailyAmount({
  category: CategoryEnum.wholesale,
})

const dailyRetail = dailyAmount({
  category: CategoryEnum.retail,
})

Promise.all([dailyWholesale, dailyRetail, dailyMoney()]).then((res: any) => {
  wholesaleAmount.value = res[0].data
  retailAmount.value = res[1].data
  totalMoney.value = res[2].data
  loading.value = false
}).catch(err => {
  console.log(err)
  loading.value = false
})

onMounted(() => {
  myChart = echarts.init(document.getElementById('echart'));
  setOption('wholesale').then(() => {
    // 绘制图表
    myChart.setOption(option)
    // @ts-ignore
    window.addEventListener('resize', myChart.resize)
  })
})

onUnmounted(() => {
  // @ts-ignore
  window.removeEventListener('resize', myChart.resize)
})

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
    } else if (type === 'money') {
      res = await chartMoney()
    }
    // list to map
    // 不全的日期补0
    const dataMap = res.data.reduce((a: any, b: any) => {
      a[b.orderTime] = b.total
      return a
    }, {})
    option.series[0].data = week.map((e: string, index: number) => {
      const date = dayjs().subtract(7 - index - 1, 'day').format('YYYY-MM-DD')
      return dataMap[date]?dataMap[date]:0
    })
    myChart.setOption(option)
  } catch (error) {
    console.error(error)
  } finally {
    chartLoading.value = false
  }
}
</script>
<style lang="scss" scoped>
.dashboard-container {
  padding: 32px;
  .card-panel-col {
    margin-bottom: 32px;
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover {
        background-color: #ddd;
      }
      .el-icon {
        font-size: 48px;
        border-radius: 6px;
      }
      .right {
        .text {
          font-size: 16px;
          color: rgba(0,0,0,.45);
        }
        .countup-wrap {
          font-size: 20px;
          font-weight: 700;
          color: #666;
        }
      }
    }
  }
}
</style>