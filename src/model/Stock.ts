export interface IStock {
  id?: number
  color: number
  size: number
  goodsId: number
  deptId: number
  currentStock: number
  edit?: boolean
}

export class Stock implements IStock {
  id: number
  color: number
  size: number
  goodsId: number
  deptId: number
  currentStock: number = 0
  constructor(data?: Partial<IStock>) {
    if (data) {
      const { id, color, size, goodsId, deptId, currentStock } = data
      if (id) {
        this.id = id
      }
      if (color) {
        this.color = color
      }
      if (size) {
        this.size = size
      }
      if (goodsId) {
        this.goodsId = goodsId
      }
      if (deptId) {
        this.deptId = deptId
      }
      if (currentStock) {
        this.currentStock = currentStock
      }
    }
  }
}