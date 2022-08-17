import { ComponentObjectPropsOptions } from "vue"

export function useSelectable() {
  const emit = defineEmits(['rowSelection', 'singleChoose', 'multiChoose', 'chooseAll'])
  const props: ComponentObjectPropsOptions = {
    singleSelect: {
      type: Boolean,
      default: false
    },
    multiSelect: {
      type: Boolean,
      default: false
    }
  }
  function handleSingleSelect(row: any) {
    emit('singleChoose', row)
  }
  function handleMultiSelect(selection: any[], row: any) {
    let command = selection.indexOf(row) >= 0 ? 'add' : 'remove'
    emit('multiChoose', row, command)
  }
  function handleSelectAll(selection: any[]) {
    let command
    if (selection.length > 0) {
      command = 'add'
    } else {
      command = 'remove'
    }
    emit('chooseAll', command)
  }
  return {
    props,
    handleSingleSelect,
    handleMultiSelect,
    handleSelectAll
  }
}