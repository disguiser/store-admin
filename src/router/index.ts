import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './modules/constantRoutes'
import NProgress from '@/utils/nprogress'
import getPageTitle from '@/utils/index'
import { useUserStore } from '@/store/user'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHashHistory(),
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/client', 'print'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title as string)
  
  const userStore = useUserStore()
  
  if (userStore.userId) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      const authStore = useAuthStore();
      authStore.setRouteName(to.name as string);
      if (!authStore.authMenuListGet.length) {
        await authStore.getAuthMenuList(userStore.roles);
        authStore.authMenuList.forEach((e: any) => {
          if (e.meta?.isFull) {
            router.addRoute(e)
          } else {
            router.addRoute('layout', e)
          }
        })
        return next({ ...to, replace: true });
      } else {
        next()
      }
      /*
      // determine whether the user has obtained his permission role through getInfo
      const permissionStore = usePermissionStore()
      const hasRoutes = permissionStore.addRoutes
      if (!hasRoutes || hasRoutes.length === 0) {
        // generate accessible routes map based on role
        const accessRoutes: RouteRecordRaw[] = await permissionStore.generateRoutes(userStore.roles)
        // dynamically add accessible routes
        accessRoutes.forEach((e: RouteRecordRaw) => {
          if (e.meta?.isFull) {
            router.addRoute(e)
          } else {
            router.addRoute('layout', e)
          }
        })
        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true })
      } else {
        next()
      }
      */
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
      next('/login')
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
