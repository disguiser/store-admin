import request from '@/utils/request'
import axios from 'axios'

let preUrl = '/print-template'

export function findAll(query: any) {
  return request({
    url: `${preUrl}/find-all`,
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
export function print(data: any) {
  const server = axios.create({
    baseURL: `http://localhost:25565`,
    timeout: 5000
  })
  return server({
    url: '/print',
    method: 'post',
    data
  })
}