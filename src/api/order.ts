import request from '@/utils/request'

let preUrl = '/order'

export function findByPage(query: any) {
  return request({
    url: `${preUrl}/findByPage`,
    method: 'get',
    params: query
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
    url: `${preUrl}`,
    method: 'post',
    data
  })
}

export function remove(id: number) {
  return request({
    url: `${preUrl}/${id}`,
    method: 'delete'
  })
}

export function dailyAmount(query: any) {
  return request({
    url: `${preUrl}/daily/amount`,
    method: 'get',
    params: query
  })
}

export function dailyMoney() {
  return request({
    url: `${preUrl}/daily/money`,
    method: 'get',
  })
}

export function chartAmount(query: any) {
  return request({
    url: `${preUrl}/chart/amount`,
    method: 'get',
    params: query
  })
}

export function chartMoney() {
  return request({
    url: `${preUrl}/chart/money`,
    method: 'get',
  })
}
