import { ref } from "vue";

export function usePageList<T extends object>(listFn: Function) {
  const dialogStatus = ref<'新建' | '编辑'>('新建')
  const total = ref(0)
  const listLoading = ref(true)
  const list = ref<T[]>()
}