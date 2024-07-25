// import { getVersion } from '@/api'
// import { useAppStore } from '@/store/app'

// const checkVersion = to => {
//   if (import.meta.env.DEV) return
//   return getVersion().then(async res => {
//     const store = useAppStore()
//     let { ver } = store.getAppVersion
//     if (ver && ver != res.ver) {
//       ElMessage({
//         message: 'Found new content, updating automatically...',
//         type: 'success',
//         showClose: true,
//         duration: 1500,
//         onClose: () => {
//           console.log('刷新版本')
//           window.location.reload(true)
//         }
//       })
//     }
//     store.setAppVersion(res)
//   })
// }

export function createPageVersionGuard(router) {
  // router.beforeEach(to => {
  //   checkVersion()
  // })
}
