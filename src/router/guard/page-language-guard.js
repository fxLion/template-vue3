import { useAppStore } from '@/store/app'
// import { switchLanguage } from '@/api'
export function createPageLanguageGuard(router) {
  router.beforeEach(async (to, from, next) => {
    const store = useAppStore()
    if (to.query && to.query.lang) {
      // 修改语言后调用后端接口切换语言
      // await switchLanguage({ lang: to.query.lang }).then(res => {
      //   store.switchLanguage(to.query.lang)
      // })
      const { lang, ...otherQuery } = to.query
      next({ path: to.path, query: otherQuery })
    } else {
      next()
    }
  })
}
