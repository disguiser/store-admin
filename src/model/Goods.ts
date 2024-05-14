import { IStock, Stock } from "./Stock"

export interface IGoods {
  id?: number
  preSku: string
  name: string
  sizeGroup: number
  salePrice: number
  wholesalePrice: number
  costPrice: number
  imgUrl: string
  discount: number
  stocks?: IStock[]
  [key: string]: any
}

export class Goods implements IGoods {
  id?: number
  preSku: string = ''
  name: string = ''
  sizeGroup: number
  salePrice: number = 0
  wholesalePrice: number = 0
  costPrice: number = 0
  imgUrl: string = ''
  discount: number = 1
  stocks: IStock[] = []
  constructor(data?: Partial<IGoods>) {
    if (data) {
      const {
        id,
        preSku,
        name,
        sizeGroup,
        salePrice,
        wholesalePrice,
        costPrice,
        imgUrl,
        discount,
        stocks
      } = data
      if (id) {
        this.id = id
      }
      if (preSku) {
        this.preSku = preSku
      }
      if (name) {
        this.name = name
      }
      if (sizeGroup) {
        this.sizeGroup = sizeGroup
      }
      if (salePrice) {
        this.salePrice = salePrice
      }
      if (wholesalePrice) {
        this.wholesalePrice = wholesalePrice
      }
      if (costPrice) {
        this.costPrice = costPrice
      }
      if (imgUrl) {
        this.imgUrl = imgUrl
      }
      if (discount) {
        this.discount = discount
      }
      if (stocks && stocks.length > 0) {
        this.stocks = stocks.map(e => new Stock(e))
      }
    }
  }
}