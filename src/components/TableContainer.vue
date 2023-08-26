<template>
  <div class="table-container el-card">
    <div class="filter-container">
      <slot name="filter-container"></slot>
    </div>
    <slot></slot>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TableContainer'
})
</script>

<style scoped>
.table-container {
  padding: 0 20px;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  height: 100%;
  width: 100%;
}
.footer {
  padding: 10px 0;
}
</style>