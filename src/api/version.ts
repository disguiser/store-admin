import request from '@/utils/request'

const preUrl = '/version'

export function getVersions() {
  return request({
    url: `${preUrl}/all`,
    method: 'get'
  })
}
