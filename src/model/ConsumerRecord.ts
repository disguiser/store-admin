export interface IConsumerRecord {
  id?: number
  vipId: number
  consumeAmount: number
  creator: number
  createTime: Date
}

export class ConsumerRecord implements IConsumerRecord {
  id?: number
  vipId: number
  consumeAmount: number
  creator: number
  createTime: Date
  constructor(data?: Partial<IConsumerRecord>) {
    if (data) {
      const {
        id,
        vipId,
        consumeAmount,
        creator,
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
      if (creator) {
        this.creator = creator
      }
      if (createTime) {
        this.createTime = createTime
      }
    }
  }
}