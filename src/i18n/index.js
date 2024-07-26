import { createI18n } from 'vue-i18n'
import enEleLocale from 'element-plus/es/locale/lang/en'
import zhEleLocale from 'element-plus/es/locale/lang/zh-cn'

const en = enEleLocale
const zhCN = zhEleLocale
// en.el.pagination.total = '{total} Item(s)'
const allModules = import.meta.glob('./**/*.js', {eager: true})
Object.keys(allModules).forEach(modulePath => {
  const array = modulePath.replace(/\.\/(.*)\.js$/, '$1').split('/')
  let tempEn = en
  let tempZhCN = zhCN
  for (let index = 0; index < array.length; index++) {
    if (index === array.length - 1) {
      const MDefault = (allModules[modulePath].default && allModules[modulePath].default.en) || {}
      const MDzfault = (allModules[modulePath].default && allModules[modulePath].default.zhCN) || {}
      if (array.length > 1 && array[index] === 'index') {
        Object.assign(tempEn, MDefault)
        Object.assign(tempZhCN, MDzfault)
      } else {
        tempEn[array[index]] = MDefault
        tempZhCN[array[index]] = MDzfault
      }
    } else {
      if (!tempEn.hasOwnProperty(array[index])) {
        tempEn[array[index]] = {}
      }
      if (!tempZhCN.hasOwnProperty(array[index])) {
        tempZhCN[array[index]] = {}
      }
      tempEn = tempEn[array[index]]
      tempZhCN = tempZhCN[array[index]]
    }
  }
})
export const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  messages: {
    'en-US': en,
    'zh-CN': zhCN
  },
  missingWarn: true,
  silentTranslationWarn: true
})
export function setupI18n(app) {
  app.use(i18n)
}
