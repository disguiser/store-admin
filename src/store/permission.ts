import { defineStore } from "pinia";
import { MyRouteRecordRaw, asyncRoutes, constantRoutes, RouteChild } from '@/router'
/**
 * Use meta.roles to determine if the current user has permission
 * @param roles
 * @param route
 */
 function hasPermission(roles: string[], route: MyRouteRecordRaw | RouteChild) {
  if (roles && route.meta && route.meta.roles) {
    return (route.meta.roles as string[]).some(e => roles.includes(e))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
 export function filterAsyncRoutes(routes: MyRouteRecordRaw[], roles: string[]) {
  const res: MyRouteRecordRaw[] = []

  routes.forEach(route => {
    if (hasPermission(roles, route)) {
      if (route.children) {
        const children: RouteChild[] = []
        route.children.forEach((child: RouteChild) => {
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
      routes: new Array<MyRouteRecordRaw>,
      addRoutes: new Array<MyRouteRecordRaw>
    }
  },
  actions: {
    generateRoutes(roles: string[]) {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      this.addRoutes = accessedRoutes
      this.routes = Array.prototype.concat(constantRoutes, accessedRoutes)
      return accessedRoutes
    }
  }
})