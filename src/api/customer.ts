import request from '@/utils/request'

let preUrl = '/customer'

export function findByPage(query: any) {
  return request({
    url: `${preUrl}/page`,
    method: 'get',
    params: query
  })
}

export function findOne(id: number) {
  return request({
    url: `${preUrl}/${id}`,
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

