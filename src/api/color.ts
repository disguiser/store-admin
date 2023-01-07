import { IDictItem } from '@/model/Dict'
import request from '@/utils/request'

const preUrl = '/color'

export function findAll(query: any) {
  return request({
    url: `${preUrl}/all`,
    method: 'get',
    params: query
  })
}

export function create(data: IDictItem) {
  return request({
    url: `${preUrl}`,
    method: 'post',
    data
  })
}

export function update(data: IDictItem) {
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
