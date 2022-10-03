import { useUserStore } from "@/store/user";

const userStore = useUserStore()

export function useCheckPermission(roles: string[]) {
  return roles.some(role => {
    return userStore.roles.includes(role)
  })
}