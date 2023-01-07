export interface IDict {
  id?: number
  dictName: string
  data: IDictItem[]
  moreOption: boolean
  modifyTime: Date
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
  modifyTime: Date
  constructor(_data?: IDict) {
    if (_data) {
      const {
        id,
        dictName,
        data,
        moreOption,
        modifyTime
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
      if (modifyTime) {
        this.modifyTime = modifyTime
      }
    }
  }
}