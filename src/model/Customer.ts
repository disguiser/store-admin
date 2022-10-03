export interface ICustomer {
  id?: number
  name: string
  mobile: string
  address: string[]
  addressDetail: string
  openId: string
  debt: number
  createTime?: Date
}

export class Customer implements ICustomer {
  id?: number
  name: string = ''
  mobile: string = ''
  address: string[] = []
  addressDetail: string = ''
  openId: string = ''
  debt: number = 0
  createTime?: Date 
  constructor(data?: ICustomer) {
    if (data) {
      const {
        id,
        name,
        mobile,
        address,
        addressDetail,
        openId,
        debt,
        createTime
      } = data
      if (id) {
        this.id = id
      }
      if (name) {
        this.name = name
      }
      if (mobile) {
        this.mobile = mobile
      }
      if (address) {
        this.address = address
      }
      if (addressDetail) {
        this.addressDetail = addressDetail
      }
      if (openId) {
        this.openId = openId
      }
      if (debt) {
        this.debt = debt
      }
      if (createTime) {
        this.createTime = createTime
      }
    }
  }
}