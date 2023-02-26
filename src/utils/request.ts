import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import qs from 'qs'
// import { storeToRefs } from 'pinia'
// const { token } = storeToRefs(useUserStore())

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  (config: any) => {
    const userStore = useUserStore()
    // do something before request is sent
    if (userStore.token) {
      config.headers['Authorization'] = 'Bearer ' + userStore.token
    }
    // config.data = unref(config.data)
    if (config.method === 'get') {
      config.paramsSerializer = (params: any) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log('---error') // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response
  },
  error => {
    // 401: 未认证; 403: 无权限访问;
    const res = error.response
    if (res) {
      if (res.status === 401) {
        const userStore = useUserStore()
        userStore.logout()
      } else if (res.status === 403) {
        ElMessage({
          message: '访问被禁止',
          type: 'error'
        })
      } else {
        // console.log(res)
        ElMessage({
          message: res.data.msg,
          type: 'error'
        })
      }
    } else {
      ElMessage({
        message: res ? res.data.message : error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
