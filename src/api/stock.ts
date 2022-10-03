import request from '@/utils/request'

let preUrl = '/stock'

export function list(query: any) {
  return request({
    url: `${preUrl}/list`,
    method: 'get',
    params: query
  })
}

export function create(data: any) {
  return request({
    url: `${preUrl}/create`,
    method: 'put',
    data
  })
}

export function update(data: any) {
  return request({
    url: `${preUrl}/update/${data.id}`,
    method: 'patch',
    data
  })
}

export function remove(ids: number[]) {
  return request({
    url: `${preUrl}/delete`,
    method: 'delete',
    data: ids
  })
}
