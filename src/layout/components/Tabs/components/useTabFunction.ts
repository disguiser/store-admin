import { nextTick } from "vue";
import { TabsMenuProps, useTabsStore } from "@/store/tabs";
import { useKeepAliveStore } from "@/store/keepAlive";
import { useAppStore } from "@/store/app";
import { useRouter, useRoute } from "vue-router";

export function useTabFunction() {
  const appStore = useAppStore()
  const tabsStore = useTabsStore()
  const keepAliveStore = useKeepAliveStore()
  const router = useRouter()
  const route = useRoute()
  
  // Close All
  const closeAllTab = () => {
    tabsStore.closeMultipleTab();
    keepAliveStore.setKeepAliveName();
    router.push('/');
  }
  
  // Close Other
  const closeOtherTab = () => {
    tabsStore.closeMultipleTab(route.fullPath);
    keepAliveStore.setKeepAliveName([route.name] as string[]);
  }

  // Close Current
  const closeCurrentTab = (selectedRoute?: TabsMenuProps) => {
    if (route.meta.closeable === false) return;
    tabsStore.removeTabs(selectedRoute?selectedRoute.path:route.fullPath);
    keepAliveStore.removeKeepAliveName(selectedRoute?selectedRoute.name:route.name as string);
  }

  // refresh current page
  const refresh = (selectedRoute?: TabsMenuProps) => {
    let name = (selectedRoute ? selectedRoute.name : route.name) as string
    setTimeout(() => {
      appStore.refreshing = true
      keepAliveStore.removeKeepAliveName(name);
      nextTick(() => {
        keepAliveStore.addKeepAliveName(name);
        if (selectedRoute && selectedRoute.path !== route.path) {
          router.push(selectedRoute.path)
        }
        appStore.refreshing = false
      });
    }, 0);
  }
  return {
    refresh,
    closeCurrentTab,
    closeOtherTab,
    closeAllTab
  }
}