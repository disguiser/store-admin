<template>
  <div ref="body" style="text-align:center">
    <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" class="gallery-container">
      <div v-for="(e, i) in list" :key="i" class="gallery-item">
        <el-image
          :style="`width: ${containerWidth}px; height: ${containerWidth}px`"
          :lazy="true"
          :src="e.imgUrl"
          :preview-src-list="e.imgUrl | previewSrcFilter"
        />
        <div class="form-container">
          <div class="sku">sku-2</div>
          <div class="name">上衣</div>
          <div class="price">¥900</div>
          <a class="detail" @click="showDetail(e)">明细</a>
        </div>
      </div>
    </div>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
  </div>
</template>

<script>

export default {
  filters: {
    previewSrcFilter(url) {
      return [url]
    }
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      containerWidth: 200,
      resizeFlag: true
    }
  },
  computed: {
    noMore() {
      return this.list.length >= this.total
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {
    this.load()
    this.containerWidth = this.galleryWidth(this.$refs.body.clientWidth)
    window.onresize = () => {
      if (this.resizeFlag) {
        this.containerWidth = this.galleryWidth(this.$refs.body.clientWidth)
        this.resizeFlag = false
        setTimeout(() => {
          this.resizeFlag = true
        }, 100)
      }
    }
  },
  methods: {
    galleryWidth(clientWidth) {
      let width = clientWidth - 40 - 3
      let num = Math.floor(width / 200)
      if (num >= this.total) {
        return Math.floor(width / this.total) - 3
      } else {
        return Math.floor(width / num) - 3
      }
    },
    load() {
      this.$emit('loadMore')
    },
    previewSrcList(url) {
      return [url]
    },
    showDetail(e) {

    }
  }
}
</script>

<style lang="scss" scoped>
.gallery-container {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  .gallery-item {
    border: 1px solid gray;
    border-radius: 5px;
    margin: 3px;
    .form-container  {
      padding: 5px;
      text-align: left;
      .price {
        color: aqua;
        font-weight: bolder;
      }
    }
  }
}
</style>
