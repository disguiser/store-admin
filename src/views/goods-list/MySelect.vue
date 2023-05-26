<template>
  <el-dropdown
    ref="dropdown1"
    trigger="contextmenu"
    max-height="400px"
    style="margin-bottom: 20px;width: 100%;"
    @command="handleCommand"
  >
    <el-input
      :model-value="inputValue"
      :placeholder="props.placeholder"
      @focus="dropdown1.handleOpen()"
      @click="dropdown1.handleOpen()"
      @update:model-value="valueChange"
      @keydown.enter="handleEnter"
    ></el-input>
    <template #dropdown>
      <el-dropdown-menu v-if="list.length > 0" style="width: 100%;">
        <el-dropdown-item
          v-for="c in list"
          :command="c.id"
        >
          {{ c.itemName }}
        </el-dropdown-item>
      </el-dropdown-menu>
      <div style="padding: 10px;">没有匹配项</div>
    </template>
  </el-dropdown>
  <div>
    <el-tag
      v-for="item in props.chosen"
      :key="item"
      type=""
      class="item-tag"
      size="large"
      closable
      @close="remove(item)"
    >
      {{ map.get(item) }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import { IDictItem } from '@/model/Dict';
import { debounce } from 'lodash-es';
import { computed, ref } from 'vue';

const props = defineProps<{
  placeholder: string,
  list: IDictItem[],
  chosen: Set<number>
}>()
const inputValue = ref('')
const list = ref<IDictItem[]>(props.list)

const map = computed(() => {
  return props.list.reduce((a: Map<number, string>, b: IDictItem) => {
    a.set(b.id, b.itemName)
    return a
  }, new Map())
})

const emit = defineEmits(['add'])

function handleEnter() {
  const item = list.value.find((e: IDictItem) => e.itemName === inputValue.value)
  if (item) {
    emit('add', item.id)
  } else {
    emit('add', inputValue.value)
  }
  inputValue.value = ''
}
const dropdown1 = ref()
const debounced = debounce(() => {
  console.log(inputValue.value)
  list.value = props.list.filter((c: IDictItem) => {
    dropdown1.value.handleOpen()
    return c.itemName.includes(inputValue.value)
  })
}, 250)
function valueChange(val: string) {
  inputValue.value = val
  debounced()
}
function handleCommand(command: number) {
  emit('add', command)
  inputValue.value = ''
}
function remove(id: number) {
  props.chosen.delete(id)
}
</script>

<style scoped>
.item-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>