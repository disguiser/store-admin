import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
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
    // 4001:非法的token; 4000:token不存在;  4001:Token 过期了;
    const res = error.response
    if (res) {
      if (res.status === 401 || res.status === 402 || res.status === 403) {
        const userStore = useUserStore()
        userStore.logout()
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
