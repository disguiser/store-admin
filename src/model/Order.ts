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
  constructor(data?: IOrderGoods) {
    if (data) {
      const {
        sku,
        preSku,
        name,
        color,
        size,
        amount,
        salePrice,
        subtotalMoney,
        colorOptions,
        sizeOptions
      } = data
      if (sku) {
        this.sku = sku
      }
      if (preSku) {
        this.preSku = preSku
      }
      if (name) {
        this.name = name
      }
      if (color) {
        this.color = color
      }
      if (size) {
        this.size = size
      }
      if (amount) {
        this.amount = amount
      }
      if (salePrice) {
        this.salePrice = salePrice
      }
      if (subtotalMoney) {
        this.subtotalMoney = subtotalMoney
      }
      if (colorOptions) {
        this.colorOptions = colorOptions
      }
      if (sizeOptions) {
        this.sizeOptions = sizeOptions
      }
    }
  }
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
  orderTime?: Date
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
      const {
        id,
        total,
        totalMoney,
        orderTime,
        buyer,
        goodsList,
        deptId,
        deptName,
        name,
        mobile,
        address,
        addressDetail
      } = data
      if (id) {
        this.id = id
      }
      if (total) {
        this.total = total
      }
      if (totalMoney) {
        this.totalMoney = totalMoney
      }
      if (orderTime) {
        this.totalMoney = totalMoney
      }
      if (orderTime) {
        this.orderTime = orderTime
      }
      if (buyer) {
        this.buyer = buyer
      }
      if (goodsList) {
        this.goodsList = goodsList.map(e => new OrderGoods(e))
      }
      if (deptId) {
        this.deptId = deptId
      }
      if (deptName) {
        this.deptName = deptName
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

export type OrderWithDetail = {
  sku: string,
  name: string,
  color: number,
  size: number,
  amount: number,
  salePrice: number,
  subtotalMoney: number,
  discount: number,
  customerName: string,
  customerAddress: string[]
  addressDetail: string,
  customerMoblie: string,
  userName: string
}
