import { ICustomer } from "./Customer"

export interface IOrderGoods {
  sku: string
  preSku: string
  name: string
  color: number
  size: number
  amount: number
  salePrice: number
  subtotalMoney: number
  colorOptions: any[]
  sizeOptions: any[]
}

export class OrderGoods implements IOrderGoods {
  sku: string = ''
  preSku: string = ''
  name: string = ''
  color: number = 0
  size: number = 0
  amount: number = 0
  salePrice: number = 0
  subtotalMoney: number = 0
  colorOptions: any[] = []
  sizeOptions: any[] = []
}

export interface IOrder extends Pick<
  ICustomer, 'name' | 'mobile' | 'address' | 'addressDetail'
> {
  id?: number
  total: number
  totalMoney: number
  orderTime?: Date
  buyer: number
  goodsList: IOrderGoods[]
  deptId: number
  deptName: string
  category: 1 | 2
  paymentStatus: 0 | 1
}

export class Order implements IOrder {
  id?: number | undefined
  total: number = 0
  totalMoney: number = 0
  orderTime?: Date | undefined
  buyer: number = 0
  goodsList: IOrderGoods[] = []
  deptId: number = 0
  deptName: string = ''
  category: CategoryEnum
  paymentStatus: PaymentStatusEnum = 1
  name: string = ''
  mobile: string = ''
  address: string[] = []
  addressDetail: string = ''
  constructor(
    category: CategoryEnum,
    data?: IOrder
  ) {
    this.category = category
    if (data) {
      this.id = data.id
      this.total
      this.totalMoney = data.totalMoney
      this.orderTime = data.orderTime
      this.buyer = data.buyer
      this.goodsList = data.goodsList
      this.deptId = data.deptId
      this.deptName = data.deptName
      this.name = data.name
      this.mobile = data.mobile
      this.address = data.address
      this.addressDetail = data.addressDetail
    }
  }
}

export enum CategoryEnum {
  wholesale = 1,
  retail = 2
}

export enum PaymentStatusEnum {
  square = 1,
  debt = 0
}