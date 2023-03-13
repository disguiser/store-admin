export interface IConsumerRecord {
  id?: number
  vipId: number
  consumeAmount: number
  createBy: number
  createTime: Date
}

export class ConsumerRecord implements IConsumerRecord {
  id?: number
  vipId: number
  consumeAmount: number
  createBy: number
  createTime: Date
  constructor(data?: Partial<IConsumerRecord>) {
    if (data) {
      const {
        id,
        vipId,
        consumeAmount,
        createBy,
        createTime
      } = data
      if (id) {
        this.id = id
      }
      if (vipId) {
        this.vipId = vipId
      }
      if (consumeAmount) {
        this.consumeAmount = consumeAmount
      }
      if (createBy) {
        this.createBy = createBy
      }
      if (createTime) {
        this.createTime = createTime
      }
    }
  }
}