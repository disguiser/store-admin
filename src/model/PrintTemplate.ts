export interface IPrintTemplate {
  id?: number
  name: string
  width: number
  height: number
  data: Record<string, any>[]
}

export class PrintTemplate implements IPrintTemplate {
  id?: number
  name: string
  width: number
  height: number
  data: Record<string, any>[]
  constructor(_data?: IPrintTemplate) {
    if (_data) {
      const {
        id,
        name,
        width,
        height,
        data
      } = _data
      if (id) {
        this.id = id
      }
      if (name) {
        this.name = name
      }
      if (width) {
        this.width = width
      }
      if (height) {
        this.height = height
      }
      if (data) {
        this.data = data
      }
    }
  }
}