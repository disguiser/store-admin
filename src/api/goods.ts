import request from '@/utils/request'

let preUrl = '/goods'

export function findByPage(query: any) {
  return request({
    url: `${preUrl}/page`,
    method: 'get',
    params: query
  })
}

export function findByDept(query: any) {
  return request({
    url: `${preUrl}/dept`,
    method: 'get',
    params: query
  })
}
// find Goods
export function findOneById(sku: number | string) {
  return request({
    url: `${preUrl}/${sku}`,
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

export function remove(id: number, deptId?: number) {
  return request({
    url: `${preUrl}/${id}${deptId?'/'+deptId:''}`,
    method: 'delete'
  })
}

export function checkPreSku(preSku: string) {
  return request({
    url: `${preUrl}/check/pre-sku/${preSku}`,
    method: 'get'
  })
}