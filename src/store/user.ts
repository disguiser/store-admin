import { defineStore } from 'pinia'
import { getToken, setToken } from '@/utils/auth'
import router from '@/router'
import { login, update, updateAvatar } from '@/api/user'
import { usePermissionStore } from '@/store/permission'
import { useVersionStore } from '@/store/version'

type StateType = {
  token: string | undefined,
  userId: string | undefined,
  userName: string | undefined,
  accountName: string | undefined,
  avatar: string,
  roles: string[],
  deptId: string | undefined
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      userId: undefined,
      userName: undefined,
      accountName: undefined,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      roles: new Array<string>(),
      deptId: undefined
    } as StateType
  },
  actions: {
    setAvatar(url: string) {
      return new Promise((resolve, reject) => {
        updateAvatar({ id: this.userId, avatar: this.avatar }).then(() => {
          resolve(undefined)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // user login
    login(userInfo: any) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(async res => {
          await this.doLogin(res.data)
          resolve(undefined)
        }).catch(error => {
          reject(error)
        })
      })
    },
    async doLogin(data: any) {
      const permissionStore = usePermissionStore()
      if (data) {
        // generate accessible routes map based on role
        const accessRoutes = await permissionStore.generateRoutes(data.roles)
        // dynamically add accessible routes
        router.addRoute(accessRoutes as any)
        this.token = data.token
        setToken(data.token)
        this.userId = data.userId
        this.userName = data.userName
        this.accountName = data.accountName
        this.roles = data.roles
        this.deptId = data.deptId
        this.avatar = data.avatar
      }
    },
  
    update(userInfo: any) {
      return new Promise((resolve, reject) => {
        update(userInfo).then(res => {
          this.accountName = userInfo.accountName
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    setToken(token: string) {
      setToken(token)
      this.token = token
    },
    // user logout
    logout() {
      const versionStore = useVersionStore()
      this.setToken('')
      this.userId = undefined
      this.userName = undefined
      this.accountName = undefined
      this.deptId = undefined
      this.roles = []
      versionStore.clear()
      sessionStorage.clear()
    },
    updateName(name: string) {
      this.accountName = name
    }
  },
  persist: {
    enabled: true,
  }
})
