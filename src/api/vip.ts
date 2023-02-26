import request from '@/utils/request'

let preUrl = '/vip'

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
    method: 'put',
    data
  })
}

export function update(data: any) {
  return request({
    url: `${preUrl}/${data.id}`,
    method: 'patch',
    data
  })
}

export function remove(ids: number[]) {
  return request({
    url: `${preUrl}`,
    method: 'delete',
    data: ids
  })
}
