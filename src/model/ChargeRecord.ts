export interface IChargeRecord {
  id?: number
  vipId: number
  chargeAmount: number
  giveAmount: number
  createBy: number
  createTime: Date
}
export class ChargeRecord implements IChargeRecord {
  id?: number
  vipId: number
  chargeAmount: number
  giveAmount: number
  createBy: number
  createTime: Date
  constructor(data?: Partial<IChargeRecord>) {
    if (data) {
      const {
        id,
        vipId,
        chargeAmount,
        giveAmount,
        createBy,
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
      if (createBy) {
        this.createBy = createBy
      }
      if (createTime) {
        this.createTime = createTime
      }
    }
  }
}