import request from '@/utils/request'

let preUrl = '/order-goods'

export function findToday(query: any) {
  return request({
    url: `${preUrl}/daily-list`,
    method: 'get',
    params: query
  })
}
