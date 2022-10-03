import { defineStore } from "pinia";
import { list } from '@/api/stock'
import { IGoods } from "@/model/Goods";
import { ref } from "vue";

export const useGoodsStore = defineStore('goods', {
  state: () => {
    return {
      currentGoods: null as IGoods | null,
    }
  },
  actions: {
    async setGoods(goods: IGoods) {
      const res = await list({ goodsId: goods.id })
      goods.stock = res.data
      this.currentGoods = goods
      return goods.stock
    }
  },
  persist: {
    enabled: true
  }
})
