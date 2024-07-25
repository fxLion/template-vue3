export default {
  en: {
    status: {
      400: 'Request error',
      401: 'Unauthorized, please log in',
      403: 'Access denied',
      404: 'Error in requesting address',
      408: 'Request timeout',
      500: 'Server internal error',
      501: 'Service not implemented',
      502: 'Gateway error',
      503: 'Service unavailable',
      504: 'Gateway timeout',
      505: 'HTTP version is not supported',
      default: 'Request timeout'
    },
    code: {
      401: 'Login timeout, Please login again!',
      403: 'Permission denied!',
      default: 'Request timeout',
      upgrade: 'Check the new version, click OK to update immediately!',
      network: 'The network is unstable. Please check your network connection!'
    }
  },
  zhCN: {
    status: {
      400: '请求错误',
      401: '未授权，请登录',
      403: '拒绝访问',
      404: '请求地址出错',
      408: '请求超时',
      500: '服务器内部错误',
      501: '服务未实现',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
      505: 'HTTP版本不受支持',
      default: '请求超时'
    },
    code: {
      401: '登录超时，请重新登录！',
      403: '权限不足！',
      default: '请求超时',
      upgrade: '检查到新版本，点击确定立即更新！',
      network: '网络不稳定，请检查您的网络连接！'
    }
  }
}
