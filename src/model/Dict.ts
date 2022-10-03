export interface IDict {
  id?: number
  dictName: string
  data: IDictItem[]
  moreOption: boolean
  modifyTime: Date
}
export interface IDictItem {
  id: number
  itemCode?: string
  itemName: string
}