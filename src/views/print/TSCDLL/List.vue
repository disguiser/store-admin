<template>
  <div class="main el-card">
    <div
      v-for="(item, i) in list"
      :key="i"
      class="item"
    >
      <tag :list="item.data" :height="item.height" :width="item.width" />
      <el-input v-if="item.id === editingId" v-model="item.name" v-focus class="title" @blur="nameChange(item)" />
      <el-link v-else class="title" @click="nameClick(item)">{{ item.name }}</el-link>
      <el-button-group>
        <el-button @click="open(item)">打开</el-button>
        <el-button @click="copy(item, i)">复制</el-button>
        <el-button type="danger" @click="remove(i)">删除</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findAll, create, update, remove as removeApi } from '@/api/printTemplate'
import Tag from './Tag.js'
import { cloneDeep } from 'lodash-es'
import { ref } from 'vue';
import { ElLoading, ElMessageBox } from 'element-plus';
import { IPrintTemplate } from '@/model/PrintTemplate';
import { usePrintTemplateStore } from '@/store/printTemplate';
import { useRouter } from 'vue-router';

const list = ref()
const loading = ref(true)
const editingId = ref(0)

const printTempateStore = usePrintTemplateStore()
const router = useRouter()

getList()

function open(item: IPrintTemplate) {
  printTempateStore.open(item)
  router.push('/print/edit')
}
function copy(item: IPrintTemplate, index: number) {
  ElMessageBox.confirm('确定复制?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const loading = ElLoading.service()
    try {
      let _item = cloneDeep(item)
      delete _item.id
      let res = await create(_item)
      _item.id = res.data
      list.value.splice(index + 1, 0, _item)
    } catch (error) {
      console.error(error)
    } finally {
      loading.close()
    }
  })
}
function remove(i: number) {
  ElMessageBox.confirm('确定删除?', 'Warning', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    const loading = ElLoading.service()
    try {
      await removeApi(list.value[i].id)
      list.value.splice(i, 1)
    } catch (error) {
      console.error(error)
    } finally {
      loading.close()
    }
  })
}
async function getList() {
  try {
    loading.value = true
    let res = await findAll({})
    list.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
function nameClick(item: IPrintTemplate) {
  editingId.value = item.id
}
async function nameChange(item: IPrintTemplate) {
  await update(item)
  editingId.value = 0
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-wrap: wrap;
  .item {
    margin: 20px 0 0 20px;
    padding: 5px;
    border: 1px solid #afafaf;
    height: max-content;
    .title {
      display: block;
      font-size: 20px;
      text-align: center;
      margin: 10px 0;
      width: 200px;
    }
  }
}
</style>
