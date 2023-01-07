import request from '@/utils/request'

let preUrl = '/order'

export function findByPage(query: any, dateRange: any) {
  return request({
    url: `${preUrl}/findByPage`,
    method: 'post',
    params: query,
    data: dateRange
  })
}

export function getDetailByOrderId(orderId: number) {
  return request({
    url: `${preUrl}/getDetailByOrderId/${orderId}`,
    method: 'get'
  })
}

export function create(data: any) {
  return request({
    url: `${preUrl}/create`,
    method: 'post',
    data
  })
}

export function remove(id: number) {
  return request({
    url: `${preUrl}/delete/${id}`,
    method: 'delete'
  })
}
