import { defineStore } from "pinia";
import { list } from '@/api/stock'
import { IGoods } from "@/model/Goods";
import { ref } from "vue";

export const useGoodsStore = defineStore('goods', () => {
  const currentGoods = ref<IGoods>()
  async function setGoods(goods: IGoods) {
    const res = await list({ goodsId: goods.id })
    goods.stock = res.data
    currentGoods.value = goods
    return goods.stock
  }
  return {
    currentGoods,
    setGoods
  }
}, {
  persist: true
})