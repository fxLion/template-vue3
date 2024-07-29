import { createApp } from 'vue'
import { setupI18n } from '@/i18n'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import { setupComponents } from '@/components'
// import { setupDirectives } from '@/directives'
import App from './App.vue'
// import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'

const app = createApp(App)

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//toFixed兼容方法，四舍五入
Number.prototype.toFixed = function(len) {
  if (len > 20 || len < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20')
  }
  // .123转为0.123
  var number = Number(this)
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString()
  }
  if (typeof len == 'undefined' || len == 0) {
    return Math.round(number).toString()
  }

  //将数字转成字符串 包括科学计数法形式的数字
  var result = scientificNotationToStr(number),
    numberArr = result.split('.')

  if (numberArr.length < 2) {
    //整数的情况
    return padNum(result)
  }
  var intNum = numberArr[0], //整数部分
    deciNum = numberArr[1], //小数部分
    lastNum = deciNum.substr(len, 1) // tofixed的后一位

  if (deciNum.length == len) {
    //需要截取的长度等于当前长度
    return result
  }
  if (deciNum.length < len) {
    //需要截取的长度大于当前长度 1.3.toFixed(2)
    return padNum(result)
  }
  //需要截取的长度小于当前长度，需要判断最后一位数字
  result = intNum + '.' + deciNum.substr(0, len)
  if (parseInt(lastNum, 10) >= 5) {
    //最后一位数字大于5，要进位
    var times = Math.pow(10, len) //需要放大的倍数
    var changedInt = Number(result.replace('.', '')) //截取后转为整数
    var fu = 1 / changedInt < 0 // 为true 时，则 changedInt < 0 或者 changedInt = -0,否则为正数或等于0
    if (fu) {
      changedInt-- //整数进位
    } else {
      changedInt++ //整数进位
    }
    changedInt /= times //整数转为小数，注：有可能还是整数
    result = scientificNotationToStr(changedInt)
  }
  return result
  //对数字补0
  function padNum(num) {
    var dotPos = num.indexOf('.')
    if (dotPos === -1) {
      //整数的情况
      let dotNum = '.'.padEnd(len + 1, 0)
      return num + dotNum
    } else {
      //小数的情况
      let need = len - (num.length - (dotPos + 1))
      return num.padEnd(need, 0)
    }
  }
}

setupComponents(app)
setupStore(app)
setupRouter(app)
setupI18n(app)
// setupDirectives(app)
// app.config.performance = true
app.mount('#app')
export default app
