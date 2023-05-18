import { dynamicRouter } from '@/router/modules/dynamicRouter';
import { defineStore } from "pinia";
import { RouteRecordRaw } from "vue-router";
/**
 * Use meta.roles to determine if the current user has permission
 * @param roles
 * @param route
 */
 function hasPermission(roles: string[], route: RouteRecordRaw) {
  if (roles && route.meta && route.meta.roles) {
    return (route.meta.roles as string[]).some(e => roles.includes(e))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes dynamicRouter
 * @param roles
 */
 export function filterDynamicRouter(routes: RouteRecordRaw[], roles: string[]) {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    if (hasPermission(roles, route)) {
      if (route.children) {
        const children: RouteRecordRaw[] = []
        route.children.forEach((child: RouteRecordRaw) => {
          if (hasPermission(roles, child)) {
            children.push(child)
          }
        })
        route.children = children
      }
      res.push(route)
    }
  })

  return res
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: () => {
    return {
      addRoutes: new Array<RouteRecordRaw>
    }
  },
  actions: {
    generateRoutes(roles: string[]) {
      const accessedRoutes = filterDynamicRouter(dynamicRouter, roles)
      this.addRoutes = accessedRoutes
      return accessedRoutes
    }
  }
})