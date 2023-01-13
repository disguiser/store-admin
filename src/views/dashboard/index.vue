<template>
  <div class="dashboard-container" v-loading="loading">
    <el-row :gutter="20">
      <el-col class="card-panel-col" :span="8">
        <div class="card-panel">
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
        <div class="card-panel">
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
        <div class="card-panel">
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
    <div id="echart" style="width: 100%;height: 500px;"></div>
    <!-- <component :is="currentRole" /> -->
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import CountUp from 'vue-countup-v3'
import { onMounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { dailyAmount, dailyMoney } from '@/api/order'
import { CategoryEnum } from '@/model/Order';

const wholesaleAmount = ref<number>()
const retailAmount = ref<number>()
const totalMoney = ref<number>()
const loading = ref<boolean>(true)

const dailyWholesale = dailyAmount({
  category: CategoryEnum.wholesale,
})

const dailyRetail = dailyAmount({
  category: CategoryEnum.retail,
})

Promise.all([dailyWholesale, dailyRetail, dailyMoney()]).then((res: any) => {
  wholesaleAmount.value = res[0]
  retailAmount.value = res[1]
  totalMoney.value = res[2]
  loading.value = false
}).catch(err => {
  console.log(err)
  loading.value = false
})

onMounted(() => {
  var myChart = echarts.init(document.getElementById('echart'));
  // 绘制图表
  myChart.setOption({
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })
  // window.addEventListener('resize', myChart.resize)
})

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