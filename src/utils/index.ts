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

export let addressOptions: any = localStorage.getItem('addressOptions')
if (!addressOptions) {
  fetch("https://store.zhoumingshuai.top/cdn/locations.json")
  .then((response) => response.json())
  .then((data) => {
      addressOptions = data
      localStorage.setItem('addressOptions', addressOptions)
  })
}
export function addressFilter(code: string[]) {
  let address = ''
  if (code?.length > 0) {
    let data: any
    code.forEach((e: string) => {
      data = addressOptions.find((p: any) => p.code === e)
      address += data.name
      data = data.children
    })
  }
  return address
}

// /**
//  * Parse the time to string
//  * @param {(Object|string|number)} time
//  * @param {string} cFormat
//  * @returns {string | null}
//  */
//  export function parseTime(time: Date, cFormat: string) {
//   console.log(time)
//   console.log(typeof time)
//   if (!time) return
//   if (arguments.length === 0 || !time) {
//     return null
//   }
//   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
//   let formatObj: any
//   if (time instanceof Array) {
//     formatObj = {
//       y: time[0],
//       m: time[1],
//       d: time[2],
//       h: time[3],
//       i: time[4],
//       s: time[5]
//     }
//   } else if (time instanceof Date) {
//     formatObj = {
//       y: time.getFullYear(),
//       m: time.getMonth() + 1,
//       d: time.getDate(),
//       h: time.getHours(),
//       i: time.getMinutes(),
//       s: time.getSeconds()
//     }
//   }
//   const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
//     const value = formatObj[key]
//     // Note: getDay() returns 0 on Sunday
//     if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
//     return value.toString().padStart(2, '0')
//   })
//   return time_str
// }
import dayjs from 'dayjs'
export function parseTime(time: string | Date) {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

export const week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
function generateXAxisData() {
  const day = new Date().getDay()
  let xAxisData = week.slice(day + 1).concat(week.slice(0, day + 1)).reverse()

  xAxisData = xAxisData.map((d: string, index: number) => {
    return `${d}(${dayjs().subtract(index, 'day').format('D')})`
  })
  return xAxisData.reverse()
}
export function initBarOption() {
  const option: any = {
    tooltip: {},
    xAxis: {
      data: generateXAxisData()
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        data: null
      }
    ]
  }
  return option
}

export function initStackOption() {
  const option: any = {
    tooltip: {},
    xAxis: {
      data: generateXAxisData()
    },
    yAxis: {},
    series: [
      {
        type: 'bar',
        stack: 'total',
        data: null
      }
    ]
  }
  return option
}

export function transitionWeekData(resData: any) {
  return resData.map((r: any) => {
    // list to map
    const dataMap = r.reduce((a: any, b: any) => {
      a[b.createTime] = b.total
      return a
    }, {})
    // 不全的日期补0
    return week.map((e: string, index: number) => {
      const date = dayjs().subtract(7 - index - 1, 'day').format('YYYY-MM-DD')
      return dataMap[date]?dataMap[date]:0
    })
  })
}