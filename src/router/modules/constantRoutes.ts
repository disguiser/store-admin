import { RouteRecordRaw } from 'vue-router'
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue')
  },
  // {
  //   path: '/401',
  //   component: () => import('@/views/error-page/401.vue'),
  //   hidden: true
  // },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/layout',
    name: 'layout',
    component: import("@/layout/index.vue"),
    redirect: '/dashboard',
    children: []
  }
]