import { login as loginApi, update as updateApi, updateAvatar } from '@/api/user'
import { AccountInfo, PasswordLoginInfo, User } from '@/model/User'
import { useVersionStore } from '@/store/version'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const TokenKey = 'Authorization'

type LoginResponse = {
  userId: string,
  userName: string,
  accountName: string,
  deptId: string,
  avatar: string,
  roles: string[],
  token: string
}

export const useUserStore = defineStore(User.name, () => {
  const token = ref(Cookies.get(TokenKey))
  const userId = ref()
  const userName = ref()
  const accountName = ref()
  const avatar = ref('https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
  const roles = ref([])
  const deptId = ref()
  async function setAvatar(url: string) {
    avatar.value = url
    await updateAvatar({ id: userId.value, avatar: avatar.value })
  }
  async function login(userInfo: PasswordLoginInfo) {
    const res = await loginApi(userInfo)
    await doLogin(res.data)
  }
  async function doLogin(data: LoginResponse) {
    Cookies.set(TokenKey, data.token)
    token.value = data.token
    userId.value = data.userId
    userName.value = data.userName
    accountName.value = data.accountName
    roles.value = data.roles
    deptId.value = data.deptId
    avatar.value = data.avatar
  }
  async function update(userInfo: AccountInfo) {
    await updateApi(userInfo)
    accountName.value = userInfo.accountName
  }
  function setToken(val: string) {
    Cookies.set(TokenKey, val)
    token.value = val
  }
  function logout() {
    const versionStore = useVersionStore()
    Cookies.set(TokenKey, '')
    token.value = undefined
    userId.value = undefined
    userName.value = undefined
    accountName.value = undefined
    deptId.value = undefined
    roles.value = []
    versionStore.clear()
    localStorage.clear()
    location.reload() // 为了重新实例化pania 避免bug
  }
  function updateName(name: string) {
    accountName.value = name
  }
  return {
    token,
    userId,
    userName,
    accountName,
    avatar,
    roles,
    deptId,
    setAvatar,
    login,
    doLogin,
    update,
    setToken,
    logout,
    updateName
  }
}, {
  persist: true
})
