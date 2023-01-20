import { onMounted, onUnmounted } from 'vue'

export function useBarcodeScan(callback: Function) {
  let temp = ''
  let flag = false
  onMounted(() => {
    document.onkeydown = e => {
      if (flag) {
        handleInput(e.key)
      } else {
        temp = ''
        handleInput(e.key)
        flag = true
        setTimeout(() => {
          flag = false
        }, 150)
      }
    }
  })
  onUnmounted(() => {
    document.onkeydown = null
  })
  async function add(barcode: string) {
    if (barcode.length >= 8) {
      if (barcode.startsWith('YQ')) {
        barcode = barcode.substring(2)
      }
      const sku = barcode.substring(0, 4)
      const color = parseInt(barcode.substring(4, 6))
      let size = parseInt(barcode.substring(6, 8))
      if ([63, 38, 39, 40, 41, 42, 43, 44, 45].includes(size)) {
        switch (size) {
          case 63:
            size = 1
            break
          case 38:
            size = 2
            break
          case 39:
            size = 3
            break
          case 40:
            size = 4
            break
          case 41:
            size = 5
            break
          case 42:
            size = 6
            break
          case 43:
            size = 7
            break
          case 44:
            size = 8
            break
          case 45:
            size = 9
            break
        }
      }
      callback(sku, color, size)
    }
  }
  function handleInput(val: string) {
    if (val === 'Enter') {
      add(temp)
    } else {
      temp += val
    }
  }
}