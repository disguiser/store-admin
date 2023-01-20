<template>
  <CardPanel
    icon="material-symbols:attach-money"
    :span="6"
    text="销售额"
    :result="props.totalMoney"
    @click="generateOption"
  >
    <template #prefix>¥ </template>
    <template #suffix> 元</template>
  </CardPanel>
</template>

<script setup lang="ts" name="Sales">
import { chartMoney } from '@/api/order'
import { CategoryEnum } from '@/model/Order';
import CardPanel from './CardPanel.vue'
import { initStackOption, transitionWeekData } from '@/utils/index'

const props = defineProps<{
  totalMoney: number
}>()
const option = initStackOption()
const emits = defineEmits(['setOption'])
async function generateOption() {
  const res = await Promise.all([
    chartMoney({
      category: CategoryEnum.retail
    }),
    chartMoney({
      category: CategoryEnum.wholesale
    })
  ])
  const data = transitionWeekData([res[0].data, res[1].data])
  const sumResult = data.reduce((a: any, b: any) => {
    b.forEach((e: any, index: number) => {
      if (!a[index]) {
        a[index] = e
      } else {
        a[index] += e
      }
    })
    return a
  }, [])
  option.series = [
    {
      type: 'bar',
      stack: 'total',
      name: '零售',
      label: {
        show: true,
        formatter: '{a}: {c}',
      },
      data: data[0]
    },
    {
      type: 'bar',
      stack: 'total',
      name: '批发',
      label: {
        show: true,
        formatter: '{a}: {c}',
      },
      data: data[1]
    },
    {
      type: 'bar',
      stack: 'total',
      name: '总计',
      label: {
        show: true,
        formatter: '{a}: {c}',
      },
      itemStyle: {
        normal: {
          color: 'rgba(128, 128, 128, 0)'
        }
      },
      data: sumResult
    }
  ]
  emits('setOption', option)
}
</script>
