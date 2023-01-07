export interface IVip {
  id?: number
  name: string
  phone: string
  birthday: string
  certNo: string
  birthDiscount: number
  vipDiscount: number
  balance: number
  deptId: number
  createTime: Date
}

export class Vip implements IVip {
  id?: number
  name: string = ''
  phone: string = ''
  birthday: string = ''
  certNo: string = ''
  birthDiscount: number = 70
  vipDiscount: number = 90
  balance: number = 0
  deptId: number = 0
  createTime: Date
  constructor(data?: Partial<IVip>) {
    if (data) {
      const {
        id,
        name,
        phone,
        birthday,
        certNo,
        birthDiscount,
        vipDiscount,
        balance,
        deptId,
        createTime
      } = data
      if (id) {
        this.id = id
      }
      if (name) {
        this.name = name
      }
      if (phone) {
        this.phone = phone
      }
      if (birthday) {
        this.birthday = birthday
      }
      if (certNo) {
        this.certNo = certNo
      }
      if (birthDiscount) {
        this.birthDiscount = birthDiscount
      }
      if (vipDiscount) {
        this.vipDiscount = vipDiscount
      }
      if (balance) {
        this.balance = balance
      }
      if (deptId) {
        this.deptId = deptId
      }
      if (createTime) {
        this.createTime = createTime
      }
    }
  }
}