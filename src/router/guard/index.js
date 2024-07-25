import { createPageLoadingGuard } from './page-loading-guard'
import { createPageTitleGuard } from './page-title-guard'
// import { createPageVersionGuard } from './page-version-guard'
import { createPageLanguageGuard } from './page-language-guard'

export function setupRouterGuard(router) {
  createPageLoadingGuard(router)
  createPageTitleGuard(router)
  // createPageVersionGuard(router)
  createPageLanguageGuard(router)
}
