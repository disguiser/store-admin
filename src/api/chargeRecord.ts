import request from '@/utils/request'

let preUrl = '/chargeRecord'

export function findByPage(query: any) {
  return request({
    url: `${preUrl}/findByPage`,
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

export function remove(id: number) {
  return request({
    url: `${preUrl}/remove`,
    method: 'delete',
    data: id
  })
}
