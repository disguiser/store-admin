export interface IDict {
  id?: number
  dictName: string
  data: IDictItem[]
  moreOption: boolean
  updateTime: Date
}
export interface IDictItem {
  id?: number
  itemCode?: string
  itemName: string
  [key: string]: any
}

export class Dict implements IDict {
  id?: number
  dictName: string
  data: IDictItem[]
  moreOption: boolean
  updateTime: Date
  constructor(_data?: IDict) {
    if (_data) {
      const {
        id,
        dictName,
        data,
        moreOption,
        updateTime
      } = _data
      if (id) {
        this.id = id
      }
      if (dictName) {
        this.dictName = dictName
      }
      if (data) {
        this.data = data
      }
      if (moreOption) {
        this.moreOption = moreOption
      }
      if (updateTime) {
        this.updateTime = updateTime
      }
    }
  }
}