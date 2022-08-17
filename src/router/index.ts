import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
} from 'vue-router'
import {
  DocumentOutline as AboutIcon,
  Home as HomeIcon
} from '@vicons/ionicons5'
import {
  DashboardOutlined as DashboardIcon
} from '@vicons/antd'
import {
  HouseOutlined
} from '@vicons/material'

/* Layout */
import Layout from '@/layout/index.vue'
import { Component, markRaw } from 'vue'

// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
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
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '总览', icon: markRaw(DashboardIcon), affix: true },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { title: 'Profile', noCache: true },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
      }
    ]
  },
  {
    path: '/test',
    component: () => import('@/components/Test.vue'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/vxetable',
    component: Layout,
    meta: { title: 'vxe-table', icon: markRaw(HomeIcon), roles: ['Admin', 'Boss'] },
    children: [
      {
        path: '',
        name: 'VXETable',
        component: () => import('@/views/VXETable.vue'),
      }
    ]
  },
  {
    path: '/AG-Grid',
    component: Layout,
    meta: { title: 'AG-Grid', icon: markRaw(AboutIcon), roles: ['Admin', 'Boss'] },
    children: [
      {
        path: '',
        name: 'AGGrid',
        component: () => import('@/views/AGGrid.vue'),
      }
    ]
  },
  // {
  //   path: '/stock',
  //   component: Layout,
  //   redirect: '/stock/dept',
  //   meta: { title: '门店库存', icon: markRaw(HouseOutlined), roles: ['Admin', 'Boss', 'Waiter'] },
  //   children: [
  //     {
  //       path: 'dept',
  //       component: () => import('@/views/dept-list/index.js'),
  //       name: 'DeptList',
  //     },
  //     {
  //       path: 'goods/:id',
  //       component: () => import('@/views/goods-stock/index.vue'),
  //       name: 'GoodStock',
  //       meta: { title: '库存明细', noCache: true, activeMenu: '/stock/dept', roles: ['Admin', 'Boss', 'Waiter'] },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: '/goods-list',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'goods-list',
  //       component: () => import('@/views/goods-list/index'),
  //       name: 'GoodsList',
  //       meta: { title: '商品管理', icon: 'tab', roles: ['Admin', 'Boss'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/wholesale',
  //   component: Layout,
  //   meta: { title: '批发', icon: 'tab', roles: ['Admin', 'Waiter', 'Boss'] },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/order/wholesale/index'),
  //       name: 'Order',
  //       meta: { title: '订单', roles: ['Admin', 'Waiter', 'Boss'] }
  //     },
  //     {
  //       path: 'customer-list',
  //       component: () => import('@/views/customer-list/index'),
  //       name: 'CustomerList',
  //       meta: { title: '客户', roles: ['Admin', 'Waiter', 'Boss'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/wholesale/print',
  //   component: () => import('@/views/order/wholesale/Print'),
  //   meta: { title: '订货单打印', activeMenu: '/order/wholesale/print', roles: ['Admin', 'Waiter'] },
  //   hidden: true
  // },
  // {
  //   path: '/retail',
  //   component: Layout,
  //   meta: { title: '零售', icon: 'tab', roles: ['Admin', 'Waiter', 'Boss'] },
  //   children: [
  //     {
  //       path: 'test',
  //       component: () => import('@/views/order/retail/BarcodeTable'),
  //       name: 'Sell',
  //       meta: { title: '测试扫码', roles: ['Admin'] }
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/order/retail/index'),
  //       name: 'Sell',
  //       meta: { title: '零售', roles: ['Admin', 'Waiter', 'Boss'] }
  //     },
  //     {
  //       path: '/vip-list',
  //       component: () => import('@/views/vip-list/index'),
  //       name: 'VipList',
  //       meta: { title: '会员列表', roles: ['Admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/retail/print',
  //   component: () => import('@/views/order/retail/Print'),
  //   meta: { title: '小票打印', activeMenu: '/order/retail/print', roles: ['Admin', 'Waiter'] },
  //   hidden: true
  // },
  // {
  //   path: '/size-group',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/size-group/index'),
  //       name: 'SizeGroup',
  //       meta: { title: '尺码组', icon: 'tab', roles: ['Admin', 'Boss'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/size-group-list',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/size-group-list/index'),
  //       name: 'SizeGroupList',
  //       meta: { title: '尺码组table视图', icon: 'tab', roles: ['Admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/user-list',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/user-list/index'),
  //       name: 'UserList',
  //       meta: { title: '员工管理', icon: 'tab', roles: ['Admin'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/dict-list',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/dict-list/index'),
  //       name: 'DictList',
  //       meta: { title: '字典表', icon: 'tab', roles: ['Admin', 'Boss'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/print',
  //   component: Layout,
  //   meta: { title: '打印', icon: 'tab', roles: ['Admin', 'Boss'] },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'TemplateList',
  //       component: () => import('@/views/print/TSCDLL/List'),
  //       meta: { title: '打印模板', roles: ['Admin', 'Boss'] }
  //     },
  //     {
  //       path: 'edit',
  //       name: 'TemplateEdit',
  //       component: () => import('@/views/print/TSCDLL/Edit'),
  //       hidden: true,
  //       meta: { title: '模板编辑', noCache: true, activeMenu: '/print/list', roles: ['Admin', 'Boss'] }
  //     },
  //     {
  //       path: 'Argox',
  //       name: '立象',
  //       component: () => import('@/views/print/argox'),
  //       meta: { title: '立象', roles: ['Admin'] }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export default router

type meta = {
  title: string,
  icon: Component,
  roles: string[]
}

export type MyRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean
}