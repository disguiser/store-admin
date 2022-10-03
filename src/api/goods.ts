import { IGoods } from '@/model/Goods'
import request from '@/utils/request'

let preUrl = '/goods'

export function findByPage(query: any) {
  return request({
    url: `${preUrl}/findByPage`,
    method: 'get',
    params: query
  })
}

export function findByDept(query: any) {
  return request({
    url: `${preUrl}/findByDept`,
    method: 'get',
    params: query
  })
}
// find Goods
export function findOneBySku(sku: string) {
  return request({
    url: `${preUrl}/findOneBySku/${sku}`,
    method: 'get'
  })
}

export function findStockBySku(sku: string) {
  return request({
    url: `${preUrl}/findStockBySku/${sku}`
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

export function remove(id: number) {
  return request({
    url: `${preUrl}/delete/${id}`,
    method: 'delete'
  })
}
