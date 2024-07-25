import { defineStore } from 'pinia'
// import { i18n } from '@/i18n'

// const { t: $t } = i18n.global
const localSuffix = 'Fuyun_'

export const useAppStore = defineStore('app', {
  state() {
    return {
      language: 'en-US',
      appVersion: '',
      collapse: false,
      userInfo: {}
    }
  },
  actions: {
    switchLanguage(lang) {
      // api.switchLanguage({ lang }).then(res => {
    //   setLocalData(`${localSuffix}Lang`, lang)
      this.language = lang
      // })
    },
    setAppVersion(appVersion) {
    //   setLocalData(`${localSuffix}AppVer`, JSON.stringify(appVersion))
      this.appVersion = appVersion
    },
    setUserInfo(userInfo) {
    //   setLocalData(`${localSuffix}UserInfo`, JSON.stringify(userInfo))
      this.userInfo = userInfo
    },
    setCollapse(flag) {
      this.collapse = flag
    }
  },
  getters: {
    getUserInfo: state => state.userInfo,
    getAppVersion: state => state.appVersion,
    getLanguage: state => state.language
  },
  persist: {
    key: localSuffix
  }
})
