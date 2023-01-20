<template>
  <section class="app-main">
    <router-view v-slot="{Component}">
      <KeepAlive :include="cachedViews">
        <component :is="Component" :key="key" />
      </KeepAlive>
    </router-view>
  </section>
</template>

<script setup>
import { useTagsViewStore } from '@/store/tagsView';
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';
const route = useRoute()

const tagsViewStore = useTagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
const key = computed(() => route.path)
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: auto;
}

</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
