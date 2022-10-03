import request from '@/utils/request'

let preUrl = '/customer'

export function findByPage(query: any) {
  return request({
    url: `${preUrl}/findByPage`,
    method: 'get',
    params: query
  })
}

export function findOne(id: number) {
  return request({
    url: `${preUrl}/findOne/${id}`,
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

export function debt(id: string) {
  return request({
    url: `${preUrl}/debt/${id}`,
    method: 'get'
  })
}
