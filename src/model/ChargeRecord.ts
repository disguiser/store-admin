export interface IChargeRecord {
  id?: number
  vipId: number
  chargeAmount: number
  giveAmount: number
  creator: number
  createTime: Date
}
export class ChargeRecord implements IChargeRecord {
  id?: number
  vipId: number
  chargeAmount: number
  giveAmount: number
  creator: number
  createTime: Date
  constructor(data?: Partial<IChargeRecord>) {
    if (data) {
      const {
        id,
        vipId,
        chargeAmount,
        giveAmount,
        creator,
        createTime
      } = data
      if (id) {
        this.id = id
      }
      if (vipId) {
        this.vipId = vipId
      }
      if (chargeAmount) {
        this.chargeAmount = chargeAmount
      }
      if (giveAmount) {
        this.giveAmount = giveAmount
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