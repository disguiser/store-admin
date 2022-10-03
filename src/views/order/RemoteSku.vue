<template>
  <el-select
    :value="value"
    filterable
    remote
    default-first-option
    :remote-method="remoteSku"
    :loading="loading"
    placeholder="货号"
    @input="handleInput"
  >
    <el-option
      v-for="item in skuOptions"
      :key="item.sku"
      :label="item.preSku"
      :value="item.sku"
    >
      <span style="float: left">{{ item.preSku }}</span>
      <span style="float: right">{{ item.sku }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { findByPage as findGoods } from '@/api/goods'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      skuOptions: []
    }
  },
  computed: {
  },
  methods: {
    handleInput(sku) {
      let choosen = this.skuOptions.filter(e => e.sku === sku)
      this.$emit('change', { goodsId: choosen[0].id, salePrice: choosen[0].salePrice, sku: choosen[0].sku })
      this.$emit('input', choosen[0].preSku)
    },
    remoteSku(query) {
      if (query !== '') {
        this.loading = true
        findGoods({
          preSku: query
        }).then(res => {
          this.loading = false
          this.skuOptions = res.data.items.map(e => {
            return {
              id: e.id,
              sku: e.sku,
              preSku: e.preSku,
              salePrice: e.salePrice
            }
          })
        }).catch(err => {
          console.error(err)
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
