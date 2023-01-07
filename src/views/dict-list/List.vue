<template>
  <div style="padding:5px;width:100%">
    <draggable
      ref="listRef"
      :list="props.data"
      v-bind="$attrs"
      class="board-column-content"
      handle=".drag"
      item-key="id"
    >
      <template #item="{element, index}">
        <el-row :gutter="10">
          <el-col :span="1">
            <svg-icon icon-class="drag" class="drag" />
          </el-col>
          <el-col :span="1">
            <el-tag size="small">{{ element.id }}</el-tag>
          </el-col>
          <el-col :span="9">
            <el-input v-model.trim="element.itemCode" size="small" />
          </el-col>
          <el-col :span="9">
            <el-input v-model.trim="element.itemName" size="small" @keyup.enter="handleEnter" />
          </el-col>
          <el-col :span="4">
            <el-button size="small" style="margin-right: 5px" @click="element.hidden = !element.hidden">
              <svg-icon :icon-class="element.hidden ? 'eye' : 'eye-open'" />
            </el-button>
            <el-button size="small" type="danger" icon="Delete" style="margin-left:0" @click="data.splice(index, 1)" />
          </el-col>
        </el-row>
      </template>
    </draggable>
    <el-row :gutter="10">
      <el-button type="primary" size="small" icon="Plus" @click="add" />
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { IDictItem } from '@/model/Dict';
import { ref } from 'vue';
import draggable from 'vuedraggable-es'

const props = defineProps<{
  data: IDictItem[]
}>()
const listRef = ref()
function handleEnter() {
  add()
  // nextTick(() => {
  //   let list = this.$refs.list.$children
  //   list[list.length - 1].$children[3].$children[0].focus()
  // })
}
function add() {
  props.data.push({
    id: props.data.map(e => e.id).sort((a, b) => b - a)[0] + 1,
    itemCode: '',
    itemName: '',
    hidden: false
  })
}
</script>

<style lang="scss" scoped>
.drag {
  font-size: 1.4em;
  cursor: move;
}
</style>
