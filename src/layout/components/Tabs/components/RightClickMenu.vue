<template>
  <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
    <li @click="refresh(selectedRoute)">刷新</li>
    <li v-if="selectedRoute?.closeable!==false" @click="closeCurrentTab(selectedRoute)">关闭</li>
    <li @click="closeOtherTab">关闭其他</li>
    <li @click="closeAllTab">关闭全部</li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTabFunction } from './useTabFunction';
import { TabsMenuProps } from '@/store/tabs';

const visible = ref(false)
const left = ref(0)
const top = ref(0)
const selectedRoute = ref<TabsMenuProps>()

function closeMenu() {
  visible.value = false
}

watch(visible, current => {
  if (current) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

const {
  refresh,
  closeCurrentTab,
  closeOtherTab,
  closeAllTab
} = useTabFunction()

defineExpose({
  visible,
  left,
  top,
  selectedRoute
})
</script>

<style lang="scss" scoped>
.contextmenu {
  position: fixed;
  margin: 0;
  background: #fff;
  z-index: 3000;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>