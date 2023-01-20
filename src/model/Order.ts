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

export type TOrderGoodsStock = IOrderGoods & {
  currentStock?: number
  stockId?: number
}

export interface IOrderGoodsStock extends IOrderGoods {
  currentStock: number
  stockId: number
}

export class OrderGoodsStock implements IOrderGoodsStock {
  sku: string = ''
  preSku: string = ''
  name: string = ''
  color: number = null
  size: number = null
  amount: number = 0
  salePrice: number = null
  subtotalMoney: number = 0
  colorOptions: any[] = []
  sizeOptions: any[] = []
  currentStock: number = 0
  stockId: number = 0
  constructor(data?: IOrderGoodsStock) {
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
        sizeOptions,
        currentStock,
        stockId
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
      if (currentStock) {
        this.currentStock = currentStock
      }
      if (stockId) {
        this.stockId = stockId
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
  itemList: IOrderGoodsStock[]
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
  buyer: number = null
  itemList: IOrderGoodsStock[] = []
  deptId: number = null
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
        itemList,
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
      if (itemList) {
        this.itemList = itemList.map(e => new OrderGoodsStock(e))
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
