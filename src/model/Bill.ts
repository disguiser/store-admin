export enum PaymentChannel {
  bank = 1, wechat = 2, alipay = 3
}
export const PaymentChannelList = [
  {
    key: '银行',
    value: 1
  },
  {
    key: '微信',
    value: 2
  },
  {
    key: '支付宝',
    value: 3
  }
]
export const PaymentChannelMap = new Map(
  PaymentChannelList.map(e => {
    return [e.value, e.key]
  })
)

export interface IBill {
  id?: number
  customerId: number,
  amount: number
  paymentChannel: PaymentChannel
  date: Date
}
export class Bill implements IBill {
  id: number
  customerId: number
  amount: number
  paymentChannel: PaymentChannel
  date: Date = new Date()
  constructor(data?: Partial<IBill>) {
    if (data) {
      const {
        id,
        customerId,
        amount,
        paymentChannel,
        date
      } = data
      if (id) {
        this.id = id
      }
      if (customerId) {
        this.customerId = customerId
      }
      if (amount) {
        this.amount = amount
      }
      if (paymentChannel) {
        this.paymentChannel = paymentChannel
      }
      if (date) {
        this.date = date
      }
    }
  }
}