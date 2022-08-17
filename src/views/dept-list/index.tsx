import { useSelectable } from "@/hooks/useSelectable";
import { NButton } from "naive-ui";
import { defineComponent } from "vue";

const { props: selectableProps, handleSingleSelect } = useSelectable()

export default defineComponent({
  name: 'DeptList',
  props: selectableProps,
  setup() {

  },
  render() {
    return (
      <div class="app-container">
        <div class="filter-container">
          <NButton v-if="!singleSelect" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" onClick={handleCreate()}>
            添加
          </NButton>
        </div>
      </div>
    )
  }
})