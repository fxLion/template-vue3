import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载 icon
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})
export function createPageLoadingGuard(router) {
  router.beforeEach(() => {
    NProgress.start() // 进度条开始
  })

  router.afterEach(() => {
    setTimeout(() => {
      NProgress.done() // 进度条结束
    }, 200)
  })

  router.onError(() => {
    NProgress.done() // 进度条结束
  })
}
