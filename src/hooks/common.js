import { i18n } from '@/i18n'
const { t } = i18n.global

// Notification 居中提示
export function NotificationCenter(params) {
  const { title, message, type, titleStyle = '', bodyStyle = '', ...rest } = params

  const svgType = {
    success:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"></path></svg>',
    error:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z"></path></svg>'
  }
  const svgStyle = {
    success: 'color: #3dba4e;',
    error: 'color: #F56C6C;'
  }

  ElMessage({
    dangerouslyUseHTMLString: true,
    message: `
          <div class="header">
            <div class="icon" style="${svgStyle[type]}">${svgType[type]}</div>
            <div class="title"${titleStyle ? ` style="${titleStyle}"` : ''}>${title}</div>
          </div>
          <div class="body"${bodyStyle ? ` style="${bodyStyle}"` : ''}>${message}</div>
        `,
    customClass: 'notification-center',
    ...rest
  })
}

// 确认 Message
export const ConfirmMessage = (i18M, msgKey, titleKey = '', config = {}) => {
  const curI18M = isRef(i18M) ? unref(i18M) : i18M
  const curTitle = titleKey ? t(curI18M + titleKey) : ''
  const curMsg = t(curI18M + 'tips.' + msgKey)
  const curConfig = Object.assign({ type: 'warning' }, config)

  return ElMessageBox.confirm(curMsg, curTitle, curConfig)
}

// 成功 Message
export const SuccessMessage = (i18M, msgKey, config = { params: {} }) => {
  const curI18M = isRef(i18M) ? unref(i18M) : i18M
  const curMsg = t(curI18M + 'tips.' + msgKey, config.params)

  return ElMessage({ type: 'success', message: curMsg, ...config })
}

/**
 * 格式化时间翻译
 * @param {string} val '1 min'、'2 week'
 * @returns 1天或1day、2天或2weeks
 */
export const timeUnitI18nFormat = val => {
  let arr = String(val).split(' ')
  return arr[0] + t('common.date.' + arr[1], Number(arr[0]))
}

/**
 * 生成 URL
 * @param {string} pathname
 * @param {object} params
 * @param {string} origin
 * @returns
 */
export const buildURL = (pathname = '/', params = {}, origin) => {
  let urlObj = new URL(origin ? origin : window.location.origin)

  urlObj.pathname = pathname
  Object.keys(params).forEach(key => {
    urlObj.searchParams.append(key, params[key])
  })

  return urlObj.href
}

/**
 * 开新窗
 * @param {string} url
 */
export const openWin = url => {
  window.open(url)
}

/**
 * @param {*} params
 */
import { useRoute } from 'vue-router'

export const getQueryToParams = params => {
  const route = useRoute()
  let query = route.query
  let queryKeys = Object.keys(query)
  let paramKeys = Object.keys(params)
  for (let key of queryKeys) {
    if (paramKeys.includes(key)) {
      params[key] = query[key]
    }
  }
}
