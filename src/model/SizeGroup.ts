import { IDictItem } from "./Dict"

export interface ISizeGroup {
  id?: number
  name: string
  data: IDictItem[]
}
export class SizeGroup implements ISizeGroup {
  id: number
  name: string
  data: IDictItem[]
  constructor(data?: ISizeGroup) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.data = data.data
    }
  }
}