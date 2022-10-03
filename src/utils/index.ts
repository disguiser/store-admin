export function JSONParse(str: string | null) {
  if (str === null) {
    return null
  } else {
    return JSON.parse(str)
  }
}

const title = '益谦服饰'

export default function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

/**
 * Upper case first char
 * @param {String} str
 */
 export function uppercaseFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

import { addressOptions } from './locations'
export function addressFilter(code: string[]) {
  let address = ''
  if (code.length > 0) {
    let data: any = addressOptions
    code.forEach((e: string) => {
      data = data.filter(p => p.code === e)[0]
      address += data.name
      data = data.children
    })
  }
  return address
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
 export function parseTime(time: Date, cFormat: string) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let formatObj: any
  if (time instanceof Array) {
    formatObj = {
      y: time[0],
      m: time[1],
      d: time[2],
      h: time[3],
      i: time[4],
      s: time[5]
    }
  } else if (time instanceof Date) {
    formatObj = {
      y: time.getFullYear(),
      m: time.getMonth() + 1,
      d: time.getDate(),
      h: time.getHours(),
      i: time.getMinutes(),
      s: time.getSeconds()
    }
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
