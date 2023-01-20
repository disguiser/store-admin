import { useAppStore } from "@/store/app";
import { usePermissionStore } from "@/store/permission";
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { Icon } from '@iconify/vue';
import { RouteChild } from "@/router";

export default defineComponent({
  setup(props, context) {
    const appStore = useAppStore()

    const permissionStore = usePermissionStore()

    const route = useRoute()

    const activeIndex = ref(route.path)

    return () => (
      <el-scrollbar>
        <el-menu
          default-active={activeIndex}
          class="sidebar-menu"
          collapse={!appStore.sidebar}
          router
        >
          {
            permissionStore.routes.filter(e => !e.hidden).map(route => {
              if (route.children?.length && route.children.filter((e: RouteChild) => !e.hidden).length > 1) {
                return (
                  <el-sub-menu
                    v-slot={{
                      title: () => (
                        <template>
                          <el-icon>
                            <Icon icon={route.meta.icon}></Icon>
                          </el-icon>
                          <span>{ route.meta.title }</span>
                        </template>
                      )
                    }}
                    index={route.path}
                  >
                  </el-sub-menu>
                )
              }
            })
          }
        </el-menu>
      </el-scrollbar>
    )
  }
})