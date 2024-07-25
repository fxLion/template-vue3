const baseTitle = 'FUYUN'

export function createPageTitleGuard(router) {
  router.afterEach(to => {
    const pageTitle = to.meta?.title
    if (pageTitle) {
      document.title = `${pageTitle}`
    } else {
      document.title = baseTitle
    }
  })
}
