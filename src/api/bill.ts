import { IBill } from '@/model/Bill'
import request from '@/utils/request'

const preUrl = '/bill'

export function findAll(query: any) {
  return request({
    url: `${preUrl}/all`,
    method: 'get',
    params: query
  })
}

export function create(data: IBill) {
  return request({
    url: `${preUrl}`,
    method: 'post',
    data
  })
}

export function update(data: IBill) {
  return request({
    url: `${preUrl}`,
    method: 'patch',
    data
  })
}

export function remove(id: number) {
  return request({
    url: `${preUrl}/${id}`,
    method: 'delete'
  })
}
