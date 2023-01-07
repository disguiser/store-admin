export interface ISizeGroup {
  id?: number
  name: string
  data: number[]
}
export class SizeGroup implements ISizeGroup {
  id: number
  name: string
  data: number[]
  constructor(data?: ISizeGroup) {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.data = data.data
    }
  }
}