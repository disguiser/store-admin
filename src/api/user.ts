import request from '@/utils/request'

let preUrl = '/user'

export function login(data: any) {
  return request({
    url: `${preUrl}/login`,
    method: 'post',
    data
  })
}

export function findByPage(query:  any) {
  return request({
    url: `${preUrl}/findByPage`,
    method: 'get',
    params: query
  })
}

export function findAll(query: any) {
  return request({
    url: `${preUrl}/findAll`,
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
    url: `${preUrl}/${data.id}`,
    method: 'patch',
    data
  })
}

export function updateAvatar(data: any) {
  return request({
    url: `${preUrl}/avatar/${data.id}`,
    method: 'patch',
    data
  })
}

export function checkUnique(accountName: string) {
  return request({
    url: `${preUrl}/checkAccountNameUinque/${accountName}`,
    method: 'get'
  })
}

export function sendPhoneCode(phoneNumber: string) {
  return request({
    url: `${preUrl}/sendPhoneCode/${phoneNumber}`,
    method: 'get'
  })
}

