<template>
  <div id="echart" style="width: 100%;height: 500px;"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted } from 'vue';

const emits = defineEmits(['ready'])
defineExpose({
  setOption
})
let myChart: echarts.ECharts
onMounted(() => {
  myChart = echarts.init(document.getElementById('echart'));
  // @ts-ignore
  window.addEventListener('resize', myChart.resize)
  emits('ready')
})

onUnmounted(() => {
  // @ts-ignore
  window.removeEventListener('resize', myChart.resize)
})

function setOption(option: any) {
  myChart.clear()
  myChart.setOption(option)
}
</script>
