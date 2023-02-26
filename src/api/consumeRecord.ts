import request from '@/utils/request'

let preUrl = '/consume-record'

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

export function remove(id: string) {
  return request({
    url: `${preUrl}`,
    method: 'delete',
    data: id
  })
}
