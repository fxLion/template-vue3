/*
* 返回当前语言
*/
export function languageString (text) {
    let langauge = ''
    switch(text) {
      case 'zh-CN':
        langauge = 'zh'
        break
      case 'en-US':
        langauge = 'en'
        break
      default: 
        langauge = 'en'
        break
    }
    return langauge
  }