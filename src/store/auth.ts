import { dynamicRouter } from '@/router/modules/dynamicRouter';
import { defineStore } from "pinia";

/* AuthState */
export interface AuthState {
	routeName: string;
	authButtonList: {
		[key: string]: string[];
	};
	authMenuList: Menu.MenuOptions[];
}

// AuthStore
export const useAuthStore = defineStore({
	id: "AuthState",
	state: (): AuthState => ({
		// 当前页面的 router name，用来做按钮权限筛选
		routeName: "",
		// 按钮权限列表
		authButtonList: {},
		// 菜单权限列表
		authMenuList: []
	}),
	getters: {
		// 按钮权限列表
		authButtonListGet: state => state.authButtonList,
		// 后端返回的菜单列表 ==> 这里没有经过任何处理
		authMenuListGet: state => state.authMenuList,
		// 扁平化之后的一维数组路由，主要用来添加动态路由
		flatMenuListGet: state => getFlatArr(state.authMenuList),
		// 所有面包屑导航列表
		breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
	},
	actions: {
		// getAuthButtonList
		// async getAuthButtonList() {
		// 	const { data } = await getAuthButtonListApi();
		// 	this.authButtonList = data;
		// },
		// getAuthMenuList
		async getAuthMenuList(roles: string[]) {
			// const { data } = await getAuthMenuListApi();
			const accessedRoutes = filterDynamicRouter(dynamicRouter, roles)
			this.authMenuList = accessedRoutes;
		},
		// setRouteName
		async setRouteName(name: string) {
			this.routeName = name;
		}
	}
});

/**
 * Use meta.roles to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: string[], route: Menu.MenuOptions) {
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
function filterDynamicRouter(routes: Menu.MenuOptions[], roles: string[]) {
  const res: Menu.MenuOptions[] = []

  routes.forEach(route => {
    if (hasPermission(roles, route)) {
      if (route.children) {
        const children: Menu.MenuOptions[] = []
        route.children.forEach((child: Menu.MenuOptions) => {
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

/**
 * @description 扁平化数组对象(主要用来处理路由菜单)
 * @param {Array} menuList 所有菜单列表
 * @return array
 */
function getFlatArr(menuList: Menu.MenuOptions[]) {
	let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
	return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
		let flatArr = [...pre, current];
		if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
		return flatArr;
	}, []);
}

/**
 * @description 递归找出所有面包屑存储到 pinia/vuex 中
 * @param {Array} menuList 所有菜单列表
 * @param {Object} result 输出的结果
 * @param {Array} parent 父级菜单
 * @returns object
 */
const getAllBreadcrumbList = (menuList: Menu.MenuOptions[], result: { [key: string]: any } = {}, parent?: any) => {
	for (const item of menuList) {
		if (parent) {
			parent[`${parent.path}/${item.path}`] = {
				path: `${parent.path}/${item.path}`,
				title: item.meta.title
			};
		} else {
			result[item.path] = {
				path: item.path,
				title: item.meta.title
			};
		}
		if (item.children) getAllBreadcrumbList(item.children, result, result[item.path]);
	}
	return result;
};
