import request from '@/utils/request'

const preUrl = '/dict'

export function findAll(query: any) {
  return request({
    url: `${preUrl}/findAll`,
    method: 'get',
    params: query
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
    url: `${preUrl}/update`,
    method: 'patch',
    data
  })
}

export function remove(id: number) {
  return request({
    url: `${preUrl}/delete/${id}`,
    method: 'delete'
  })
}
