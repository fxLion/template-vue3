import axios from './axios.js'

export const test = () => {
    return axios.get('/test')
}

// 获取验证码图片
export const getCaptchaImage = (data = {}) => {
    return axios.get('/api/manager/user/getCaptcha', data, {}, false, false)
  }
// 检查验证码
export const validCaptcha = (data = {}) => {
    return axios.post('/api/manager/user/checkCaptcha', data, {}, false, false)
}