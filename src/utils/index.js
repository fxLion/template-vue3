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
  // 深拷贝
  export function deepClone(data) {
    if (typeof data !== 'object') return data
    let obj = data instanceof Array ? [] : {}
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        obj[key] = deepClone(data[key])
      }
    }
    return obj
  }
  // 代码来自 v-copy
  export function copy(val) {
    if (!val) {
      // 值为空的时候，给出提示。可根据项目UI仔细设计
      console.log('无复制内容')
      return
    }
    // 动态创建 textarea 标签
    const textarea = document.createElement('textarea')
    // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
    textarea.readOnly = 'readonly'
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    // 将要 copy 的值赋给 textarea 标签的 value 属性
    textarea.value = val
    // 将 textarea 插入到 body 中
    document.body.appendChild(textarea)
    // 选中值并复制
    textarea.select()
    const result = document.execCommand('Copy')
    return result
  }