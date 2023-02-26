<template>
  <draggable
    v-model="props.tags"
    item-key="id"
  >
    <template #item="{element}">
      <span style="margin-right: 10px">
        <el-tag
          v-if="!element.edit"
          closable
          :disable-transitions="false"
          @click="handleClick(element)"
          @close="handleClose(element)"
        >
          {{ tagValue(element) }}
        </el-tag>
        <input
          v-else
          id="editInput"
          type="text"
          class="input-new-tag el-input__inner"
          :value="tagValue(element)"
          @blur="handleBlur($event, element)"
        >
      </span>
    </template>
  </draggable>
  <div>
    <input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" type="primary" icon="Plus" @click="inputVisible = true" />
  </div>
</template>

<script lang="ts" setup name="DynamicTags">
import { IDictItem } from '@/model/Dict';
import { ElMessageBox } from 'element-plus';
import { nextTick, ref, watchEffect } from 'vue';
import draggable from 'vuedraggable-es'

const props = defineProps<{
  tags: IDictItem[],
  paramName: string
}>()

const { paramName } = props

const inputVisible = ref(false)
const inputValue = ref('')

// function setSort() {
//   const el = this.$refs.tags
//   this.sortable = Sortable.create(el, {
//     ghostClass: 'sortable-ghost',
//     onEnd: evt => {
//       const targetRow = this.dynamicTags.splice(evt.oldIndex, 1)[0]
//       this.dynamicTags.splice(evt.newIndex, 0, targetRow)
//     }
//   })
// }
function tagValue(tag: IDictItem) {
  return paramName ? tag[paramName] : tag
}
function handleBlur(event: Event, tag: IDictItem) {
  const value = (event.target as HTMLInputElement).value.trim()
  if (value) {
    tag.edit = false
    tag.itemName = value
  }
}
function handleClose(tag: IDictItem) {
  ElMessageBox.confirm('Confirm to remove this item?(Be careful, It will cause problems if this item had been use in otherwhere)', 'Warning', {
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(async() => {
    props.tags.splice(props.tags.indexOf(tag), 1)
  })
}
function handleClick(tag: IDictItem) {
  tag.edit = true
  nextTick(() => {
    document.getElementById('editInput').focus()
  })
}
const saveTagInput = ref<HTMLInputElement>()
watchEffect(() => {
  if (saveTagInput.value) {
    saveTagInput.value.focus()
  }
})
function handleInputConfirm() {
  if (inputValue.value) {
    props.tags.push({
      itemName: inputValue.value
    })
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<style scoped>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
</style>
