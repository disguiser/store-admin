import request from '@/utils/request'

let preUrl = '/chargeRecord'

export function findByPage(query: any) {
  return request({
    url: `${preUrl}/page`,
    method: 'get',
    params: query
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
    url: `${preUrl}`,
    method: 'delete',
    data: id
  })
}
