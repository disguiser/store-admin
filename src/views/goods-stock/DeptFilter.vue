<template>
  <div class="el-card" v-loading="loading">
    <el-menu
      :default-active="props.activeIndex.toString()"
      @select="handleSelect"
      style="border: 0;"
    >
      <el-menu-item v-for="e in list" :index="e.id.toString()">
        {{ e.name }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts" name="DeptFilter">
import { ref } from 'vue'
import { findAll } from '@/api/dept'
import { IDept } from '@/model/Dept';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()

const props = defineProps<{
  activeIndex: string
}>()
const emits = defineEmits(['update:activeIndex'])

const list = ref<IDept[]>([])
const loading = ref(false)
async function getList() {
  try {
    loading.value = true
    const res = await findAll({})
    list.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
getList()
function handleSelect(key: string) {
  console.log(key)
  router.push({
    path: route.path,
    query: {
      deptId: key
    }
  })
  // emits('update:activeIndex', parseInt(key))
}
</script>

<style scoped>

</style>