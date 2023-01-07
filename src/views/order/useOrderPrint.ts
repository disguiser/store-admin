import { useDictStore } from '@/store/dict';
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import { IOrder } from '@/model/Order';

export function useOrderPrint() {
  const { sizeMap, colorMap } = useDictStore()
  const { userName } = useUserStore()
  const loading = ref(true)
  const order = ref<IOrder>()
  const _order = localStorage.getItem('order')
  if (!_order) {
    window.close()
    return
  }
  order.value = JSON.parse(_order)

  return {
    sizeMap,
    colorMap,
    userName,
    loading,
    order
  }
}
