import request from '@/utils/request'

export function login(data: any) {
  return request({
    url: `/login`,
    method: 'post',
    data
  })
}

export function forget(data: any) {
  return request({
    url: '/forget',
    method: 'post',
    data
  })
}

export function updateMyAccount(data: any) {
  return request({
    url: `/my-account`,
    method: 'patch',
    data
  })
}
