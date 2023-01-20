<template>
  <el-col :span="props.span">
    <div class="card-panel">
      <el-icon>
        <Icon :icon="props.icon"></Icon>
      </el-icon>
      <div class="right">
        <div class="text">{{ props.text }}</div>
        <count-up :end-val="props.result">
          <template #prefix>
            <slot name="prefix"></slot>
          </template>
          <template #suffix>
            <slot name="suffix"></slot>
          </template>
        </count-up>
      </div>
    </div>
  </el-col>
</template>

<script setup lang="ts" name="CardPanel">
import { Icon } from '@iconify/vue';
import CountUp from 'vue-countup-v3'

const props = defineProps<{
  icon: string,
  text: string,
  span: number,
  result: number
}>()
</script>

<style lang="scss" scoped>
.card-panel {
  height: 108px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover {
    background-color: #ddd;
  }
  .el-icon {
    font-size: 48px;
    border-radius: 6px;
  }
  .right {
    .text {
      font-size: 16px;
      color: rgba(0,0,0,.45);
    }
    .countup-wrap {
      font-size: 20px;
      font-weight: 700;
      color: #666;
    }
  }
}
</style>