export interface IStock {
  id?: number
  color: string
  size: string
  goodsId: number
  deptId: number
  currentStock: number
  edit?: boolean
}

export class Stock implements IStock {
  color: string = ''
  size: string = ''
  goodsId: number = 0
  deptId: number = 0
  currentStock: number = 0
  constructor(data?: Partial<IStock>) {
    if (data) {
      const { color, size, goodsId, deptId, currentStock } = data
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