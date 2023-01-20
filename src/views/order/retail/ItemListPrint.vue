<template>
  <div ref="mainRef" v-loading="loading" class="print_container">
    <template v-if="!loading">
      <h3 style="margin: 0;font-weight:normal;margin-bottom: 10px">益谦服饰-零售单品列表({{ dayjs().format('YYYY-MM-DD') }})</h3>
      <table>
        <tr>
          <td>款号</td>
          <!-- <td>品名</td> -->
          <td>颜色</td>
          <td v-for="s in sizes" :key="s.id" style="white-space:break-spaces;">{{ sizeFilter(s.itemName) }}</td>
          <td>单价</td>
          <td>金额合计</td>
          <td>时间</td>
        </tr>
        <tr v-for="(e, i) in list" :key="i">
          <td>{{ e.preSku }}</td>
          <!-- <td>{{ e.name }}</td> -->
          <td>{{ colorMap.get(e.color) }}</td>
          <td v-for="s in sizes" :key="s.id">{{ e[s.id] }}</td>
          <td>{{ e.salePrice }}</td>
          <td>{{ e.subtotalMoney }}</td>
          <td>{{ dayjs(e.orderTime).format('HH:mm') }}</td>
        </tr>
      </table>
      <div style="margin-top: 10px">
        <div class="head-foot">
          <span>总数:{{ total }}</span>
          <span>金额合计:{{ totalMoney }}</span>
        </div>
      </div>
      <div class="btn" style="float: right;">
        <button type="button" @click="print">打印</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useDictStore } from '@/store/dict';
import dayjs from 'dayjs';
import { nextTick, ref } from 'vue';

const { sizeMap, colorMap } = useDictStore()
const loading = ref(true)

const total = ref<number>(0)
const totalMoney = ref<number>(0)
const list = ref()
const listJson = localStorage.getItem('retailItemList')
if (!listJson) {
  window.close()
}
list.value = JSON.parse(listJson)

const mainRef = ref()
function print() {
  mainRef.value.classList.add('print')
  nextTick(() => {
    window.print()
    mainRef.value.classList.remove('print')
  })
}

function sizeFilter(val: string) {
  if (val) {
    return val.split('/').join('\n')
  } else {
    return ''
  }
}

const sizes = ref()
dealData()
async function dealData() {
  loading.value = true
  const _sizes: any = []
  for (let e of list.value) {
    total.value += e.amount
    totalMoney.value += e.subtotalMoney
    e[e.size] = e.amount
    if (!_sizes.includes(e.size)) {
      _sizes.push(e.size)
    }
  }
  sizes.value = _sizes.map((e: any) => {
    return {
      id: e,
      itemName: sizeMap.get(e)
    }
  }).sort((a: any, b: any) => {
    if (a.itemName > b.itemName) {
      return 1
    } else {
      return -1
    }
  })
  loading.value = false
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  border-spacing: 0;
  td {
    min-width: 50px;
    border-left: 1px solid #000;
    border-top: 1px solid #000;
  }
}
.print_container {
  padding: 0px;
  font-size: 10pt;
  width: 22cm;
  text-align: center;
}

.head-foot {
  display: flex;
  justify-content: space-between;
}
.print {
  .btn {
    visibility: hidden;
  }
}
</style>
