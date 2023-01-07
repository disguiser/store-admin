export enum UserStatus {
  Enabled = 'Enabled',
  Disabled = 'Disabled'
}

export type PasswordLoginInfo = {
  accountName: string,
  password: string
}

export type AccountInfo = {
  id: string | undefined,
  userName: string | undefined,
  accountName: string | undefined,
  oldPassword: string | undefined,
  newPassword: string | undefined,
  newPassword2: string | undefined
}

export interface IUser {
  id?: number
  userName: string
  accountName: string
  avatar: string
  deptId: number
  roles: string[]
  phoneNumber: string
  status: UserStatus
}

export class User implements IUser {
  id?: number
  userName: string = ''
  accountName: string = ''
  avatar: string = ''
  deptId: number = 0
  roles: string[] = []
  phoneNumber: string = ''
  status: UserStatus
  constructor(data?: IUser) {
    if (data) {
      const {
        userName,
        accountName,
        avatar,
        deptId,
        roles,
        phoneNumber,
        status
      } = data
      if (userName) {
        this.userName = userName
      }
      if (accountName) {
        this.accountName = accountName
      }
      if (avatar) {
        this.avatar = avatar
      }
      if (deptId) {
        this.deptId = deptId
      }
      if (roles) {
        this.roles = roles
      }
      if (phoneNumber) {
        this.phoneNumber = phoneNumber
      }
      if (status) {
        this.status = status
      }
    }
  }
}