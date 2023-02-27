import request from '@/utils/request'

const preUrl = '/dict'

export function findAll(query: any) {
  return request({
    url: `${preUrl}/all`,
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

export function update(data: any) {
  return request({
    url: `${preUrl}/admin`,
    method: 'patch',
    data
  })
}

export function remove(id: number) {
  return request({
    url: `${preUrl}/admin/${id}`,
    method: 'delete'
  })
}
