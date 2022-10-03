<template>
  <suspense>
    <router-view></router-view>
    <template #fallback>
      Loading...
    </template>
  </suspense>
</template>
<script setup lang="ts">
</script>
