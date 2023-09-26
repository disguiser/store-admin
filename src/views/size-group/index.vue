<template>
  <div class="container el-card">
    <div class="left">
      <div class="search">
        <el-input v-model="searchText" placeholder="搜索" style="margin:5px;width:189px" @keyup.enter="handleFilter" @blur="handleFilter"></el-input>
      </div>
      <el-scrollbar>
        <draggable
          v-model="_sizeList"
          :group="{ name: 'size', put: false, pull: 'clone' }"
          :clone="cloneSize"
          :move="checkMove"
          item-key="id"
        >
          <template #item="{element, index}">
            <div class="item">
              <el-checkbox v-model="element.checked"></el-checkbox>
              <span>{{ element.itemName }}</span>
              <div class="operation">
                <a @click="editSize(element)">
                  <el-icon><Edit /></el-icon>
                </a>
                <a @click="removeSize(element.id, index)">
                  <el-icon><Delete /></el-icon>
                </a>
              </div>
            </div>
          </template>
        </draggable>
      </el-scrollbar>
      <div class="footer">
        <el-button type="success" icon="Plus" @click="addSize"></el-button>
        <el-button type="primary" :disabled="!_sizeList.some(e => e.checked)" @click="addToSizeGroup">></el-button>
      </div>
    </div>
    <div class="right">
      <el-scrollbar>
        <fieldset v-for="(sg, sgi) in sizeGroupList" :key="sgi" style="position: relative">
          <legend>
            <el-popover
              trigger="hover"
              placement="bottom"
            >
              <el-input v-model="sg.name" @change="updateSizeGroup(sg)"></el-input>
              <template #reference>
                <span>{{ sg.name }}</span>
              </template>
            </el-popover>
          </legend>
          <draggable
            v-model="sg.data"
            :group="{
              name: 'size',
              pull: 'clone'
            }"
            :id="sgi"
            item-key="id"
            :move="checkMove"
            @change="updateSizeGroup(sg)"
          >
            <template #item="{element, index}">
              <el-tag
                closable
                size="large"
                :effect="appStore.isDark?'plain':'dark'"
                style="margin: 5px 5px 0 0"
                @close="handleClose(sg, index)"
              >{{ sizeMap.get(element) }}</el-tag>
            </template>
          </draggable>
          <a style="position: absolute;top: 10px;right: 10px" @click="removeSizeGroup(sg.id, sgi)"><i class="Close"></i></a>
        </fieldset>
      </el-scrollbar>
      <div class="footer">
        <el-button type="success" icon="Plus" @click="addSizeGroup"></el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable-es'
import { update as updateSizeGroupApi, create as createSizeGroup, remove as removeSizeGroupApi } from '@/api/sizeGroup'
import { create as createSize, update as updateSizeApi, remove as removeSizeApi } from '@/api/size'
import { useSizeGroupStore } from '@/store/sizeGroup';
import { useDictStore, sizeSort } from '@/store/dict';
import { h, onUnmounted, ref } from 'vue';
import { Action, ElMessageBox, ElNotification } from 'element-plus';
import { ISizeGroup } from '@/model/SizeGroup';
import { IDictItem } from '@/model/Dict';
import { useAppStore } from '@/store/app';
const appStore = useAppStore()
const { sizeGroupList } = useSizeGroupStore()
const { sizeList, sizeMap } = useDictStore()

type _SizeType = IDictItem & {checked?: boolean}

const searchText = ref('')
const _sizeList = ref<_SizeType[]>(sizeList)
function handleFilter() {
  if (searchText.value) {
    _sizeList.value = sizeList
    .filter(e => new RegExp(searchText.value, 'i').test(e.itemName))
  } else {
    _sizeList.value = sizeList
  }
}
async function addSize() {
  const { value } = await ElMessageBox.prompt('请输入新尺码', '新增', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: '邮箱格式不正确'
  })
  try {
    let res = await createSize({
      itemName: value.trim()
    })
    _sizeList.value.push({
      id: res.data,
      itemName: value.trim(),
      checked: false
    })
    sizeList.push({
      id: res.data,
      itemName: value.trim(),
      checked: false
    })
    _sizeList.value.sort(sizeSort)
    sizeList.sort(sizeSort)
  } catch (error) {
    console.error(error)
  }
}
async function editSize(s: _SizeType) {
  const { value } = await ElMessageBox.prompt('请输入新尺码', '新增', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: s.itemName
    // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: '邮箱格式不正确'
  })
  try {
    s.itemName = value.trim()
    await updateSizeApi(s)
    ElNotification({
      message: '修改成功',
      type: 'success'
    })
  } catch (error) {
    // console.error(error)
    console.log('取消')
  }
}
async function removeSize(id: number, si: number) {
  await removeSizeApi(id)
  _sizeList.value.splice(si)
  sizeList.splice(si)
  _sizeList.value.sort(sizeSort)
  sizeList.sort(sizeSort)
}
async function addSizeGroup() {
  const { value } = await ElMessageBox.prompt('请输入新尺码组名称', '新增', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    // inputErrorMessage: '邮箱格式不正确'
  })
  try {
    let res = await createSizeGroup({
      name: value.trim(),
      data: []
    })
    sizeGroupList.push(res.data)
  } catch (error) {
    console.error(error)
  }
}
async function updateSizeGroup(sizeGroup: ISizeGroup) {
  await updateSizeGroupApi({
    id: sizeGroup.id,
    name: sizeGroup.name,
    data: sizeGroup.data
  })
}
async function removeSizeGroup(id: number, sgi: number) {
  await removeSizeGroupApi(id)
  sizeGroupList.splice(sgi, 1)
}
async function handleClose(sg: ISizeGroup, si: number) {
  sg.data.splice(si, 1)
  await updateSizeGroup(sg)
}
async function addToSizeGroup() {
  let chosenIndex: number
  let radioList: any[] = []
  sizeGroupList.forEach((e, i) => {
    radioList.push(h(
      'label', null,
      [h(
        'input',
        {
          type: 'radio',
          name: 'chosenIndex',
          value: i,
          onClick: ($event: any) => {
            chosenIndex = parseInt($event.target.value)
          }
        }
      ), e.name]
    ))
  })
  ElMessageBox({
    title: '选择',
    message: h('div', null, radioList),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    const checked = _sizeList.value.filter(e => e.checked)
    sizeGroupList[chosenIndex].data.push(...checked.map(e => e.id))
    _sizeList.value.map(e => e.checked = false)
    updateSizeGroupApi(sizeGroupList[chosenIndex])
  }).catch((action: Action) => console.log(action))
}
function checkMove(a: any) {
  // console.log(a)
  // console.log(a.to)
  // console.log(a.to.__draggable_component__)
  // console.log(a.to.__draggable_component__.realList)
  // console.log(a.draggedContext)
  // console.log(a.draggedContext.element.id)
  if (
    a.to.id !== a.from.id &&
    a.to.__draggable_component__.realList.includes(a.draggedContext.element.id || a.draggedContext.element)
  ) {
    return false
  }
}
function cloneSize(size: _SizeType) {
  return size.id
}
onUnmounted(() => {
  // this.$store.dispatch('version/checkVersion')
})
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  .left {
    .search {
      height: 50px;
    }
    .el-scrollbar {
      height: calc(100% - 100px);
      .item {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid var(--el-card-border-color);
        cursor: pointer;
        white-space: nowrap;
        .operation {
          float: right;
          visibility: hidden;
          display: flex;
          flex-direction: column;
          line-height: 25px;
        }
      }
      .item:hover {
        background-color: #dddddd;
        color: black;
        .operation {
          visibility: visible;
        }
      }
      .item:first{
        border-top: 1px solid var(--el-card-border-color);
      }
    }
    .footer {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      border-top: 1px solid var(--el-card-border-color);
    }
    border-right: 1px solid var(--el-card-border-color);
    width: 200px;
    height: 100%;
  }
  .right {
    flex: 1;
    height: 100%;
    .el-scrollbar {
      height: 100%;
      padding: 10px;
    }
    .footer {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }
  }
}
</style>
