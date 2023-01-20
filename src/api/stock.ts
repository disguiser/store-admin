import { IStock } from '@/model/Stock'
import request from '@/utils/request'

let preUrl = '/stock'

export function list(query: Partial<IStock>) {
  return request({
    url: `${preUrl}/list`,
    method: 'get',
    params: query
  })
}

export function multiCreate(data: IStock[]) {
  return request({
    url: `${preUrl}/multi`,
    method: 'post',
    data
  })
}

export function create(data: IStock) {
  return request({
    url: `${preUrl}/single`,
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

export function wholeStock() {
  return request({
    url: `${preUrl}`,
    method: 'get'
  })
}

export function sumByDept() {
  return request({
    url: `${preUrl}/sum`,
    method: 'get'
  })
}
