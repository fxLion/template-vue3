import axios from 'axios'
import { i18n } from '@/i18n'
import { router } from '@/router'
import { useAppStore } from '@/store/app'
const { t: $t } = i18n.global
import { languageString } from '@/utils'

// 全局加载
let loadingCount = 0
let isAlert = false
const loading = boolean => {
  if (boolean) {
    ElLoading.service({ fullscreen: true })
    loadingCount++
  } else {
    if (loadingCount === 1) ElLoading.service().close()
    if (loadingCount > 0) loadingCount--
  }
}

// 异常 status 码错误提示
const errorStatusMessage = status => {
  ElMessage.error({
    message: $t(`axios.status.${status}`),
    duration: 4000
  })
}
// 异常 status 码处理
const statusExceptionHandler = (status = 'default') => {
  if ([400, 401, 403, 404, 408, 500, 501, 502, 503, 504, 505].includes(status)) {
    errorStatusMessage(status)
  } else {
    errorStatusMessage(500)
  }
}

// 异常 code 码错误提示
const errorCodeMessage = (code, message) => {
  ElMessage.error({
    message: message ? message : $t(`axios.code.${code}`),
    duration: 4000
  })
}
// 异常 code 码处理
const codeExceptionHandler = (code = 'default', message = '') => {
  switch (code) {
    case '401':
      if (isAlert) return
      isAlert = true
      ElMessageBox.alert($t(`axios.code.401`), 'Tips', {
        showClose: false,
        callback: action => {
          isAlert = false
          const store = useAppStore()
          store.setUserInfo({})
          router.push('/enter/login')
        }
      })
      break
    case '403':
      errorCodeMessage(code)
      break
    default:
      errorCodeMessage(code, message)
      break
  }
}

// 控制台日志
const interceptorsLogs = (descripition, data) => {
  // console.log(`%c${descripition}`, 'color:#fff;font-size:12px;background:#0d52c9;padding:2px;margin:2px;', data)
}
class AxiosInstanceClass {
  constructor() {
    this.initInstance()
    this.initInterceptors()
  }
  // 初始化 axios 实例
  initInstance() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_AXIOS_BASEURL,
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      withCredentials: true
    })
  }
  // 初始化 interceptors 拦截器
  initInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      config => {
        // 在发送请求之前做些什么
        interceptorsLogs('interceptors request config', config)
        config.headers.lang = languageString(i18n.global.locale.value)
        return config
      },
      error => {
        // 对请求错误做些什么
        loading(false)
        interceptorsLogs('interceptors request error', error)
        return Promise.reject(error)
      }
    )
    // 响应拦截器
    this.instance.interceptors.response.use(
      response => {
        // 2xx 范围内的状态码都会触发该函数
        // 对响应数据做点什么
        loading(false)
        interceptorsLogs('interceptors response response', response)
        return response.data
      },
      error => {
        // 超出 2xx 范围的状态码都会触发该函数
        // 对响应错误做点什么
        loading(false)
        // if (error && error.response) statusExceptionHandler(error.response.status)
        interceptorsLogs('interceptors response error', error)
        return Promise.reject(error)
      }
    )
  }
  // 抽离请求方法
  request(method, url, paramsOrData, config, errorCallback) {
    return new Promise((resolve, reject) => {
      return this.instance(
        Object.assign({ method, url, ...config }, method === 'get' ? { params: paramsOrData } : { data: paramsOrData })
      ).then(res => {
        const { code, data, msg, succ } = res
        if (succ) {
          resolve(res)
        } else {
          errorCallback(code, msg)
          reject(res)
        }
      }).catch(err=>{
        errorCallback('500', err)
        reject(err)
      })
    })
  }
  /**
   * get 方法
   * @param {String} url [请求的地址]
   * @param {Object} params [请求时携带的参数]
   * @param {Object} config [其他配置项]
   * @param {Boolean} useLoading [是否使用默认加载]
   * @param {Boolean} useMessage [是否使用默认消息提示]
   * @returns axios 实例
   */
  get(url, params = {}, config = {}, useLoading = false, useMessage = true) {
    if (useLoading) loading(true)
    return this.request('get', url, params, config, (code, message) => {
      if (useMessage) codeExceptionHandler(code, message)
    })
  }
  /**
   * post 方法
   * @param {String} url [请求的地址]
   * @param {Object} data [请求体中的参数]
   * @param {Object} config [其他配置项]
   * @param {Boolean} useLoading [是否使用默认加载]
   * @param {Boolean} useMessage [是否使用默认消息提示]
   * @returns axios 实例
   */
  post(url, data = {}, config = {}, useLoading = false, useMessage = true) {
    if (useLoading) loading(true)
    return this.request('post', url, data, config, (code, message) => {
      console.log(code, message)
      if (useMessage) codeExceptionHandler(code, message)
    })
  }
  /**
   * put 方法
   * @param {String} url [请求的地址]
   * @param {Object} data [请求体中的参数]
   * @param {Object} config [其他配置项]
   * @param {Boolean} useLoading [是否使用默认加载]
   * @param {Boolean} useMessage [是否使用默认消息提示]
   * @returns axios 实例
   */
  put(url, data = {}, config = {}, useLoading = false, useMessage = true) {
    if (useLoading) loading(true)
    return this.request('put', url, data, config, (code, message) => {
      if (useMessage) codeExceptionHandler(code, message)
    })
  }
  /**
   * delete 方法
   * @param {String} url [请求的地址]
   * @param {Object} data [请求体中的参数]
   * @param {Object} config [其他配置项]
   * @param {Boolean} useLoading [是否使用默认加载]
   * @param {Boolean} useMessage [是否使用默认消息提示]
   * @returns axios 实例
   */
  delete(url, data = {}, config = {}, useLoading = false, useMessage = true) {
    if (useLoading) loading(true)
    return this.request('delete', url, data, config, (code, message) => {
      if (useMessage) codeExceptionHandler(code, message)
    })
  }
  /**
   * upload 方法
   * @param {String} url [请求的地址]
   * @param {Object} data [请求体中的参数]
   * @param {Object} config [其他配置项]
   * @param {Boolean} useLoading [是否使用默认加载]
   * @param {Boolean} useMessage [是否使用默认消息提示]
   * @returns axios 实例
   */
  upload(url, data = {}, config = {}, useLoading = false, useMessage = true) {
    if (useLoading) loading(true)
    return this.request(
      'post',
      url,
      data,
      Object.assign(
        {
          headers: {
            'content-type': 'multipart/form-data'
          }
        },
        config
      ),
      (code, message) => {
        if (useMessage) codeExceptionHandler(code, message)
      }
    )
  }
}

const axiosInstance = new AxiosInstanceClass()

export default axiosInstance
