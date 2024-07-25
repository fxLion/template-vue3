let regId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
let regEmail = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ //邮箱
let regTel = /^[\d\+\-]+$/ //手机号码
let regFax = /^(\d{3,4}-)?\d{7,8}$/ //传真
let regDomain = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/ //域名
let regPanDomain = /^(?=^.{3,255}$)[*a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/ //域名且包含泛域名 *.abc.com
let regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
let regDecimal = /^\d+\.?\d{0,4}$/ //正数校验
let regNumber = /^-?\d+\.?\d{0,4}$/ //数字校验
let regEmailGroup =
  /^([a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+\,)*([a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)$/ //邮箱列表
let regAccount = /^\w+$/
let regIpv4 = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
let regPositiveInteger = /^[1-9]\d*$/

import { i18n } from '@/i18n'
const { t } = i18n.global

export default {
  email(rule, value, callback) {
    if (rule.required && !value) {
      return callback(new Error(`${t('rule.email')}${t('rule.required')}`))
    }
    if (value && !regEmail.test(value)) {
      callback(new Error(`${t('rule.email')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  emailGroup(rule, value, callback) {
    if (rule.required && !value) {
      return callback(new Error(`${t('rule.email')}${t('rule.required')}`))
    }
    if (value && !regEmailGroup.test(value)) {
      callback(new Error(`${t('rule.email')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  tel(rule, value, callback) {
    if (rule.required && !value) {
      return callback(new Error(`${t('rule.tel')}${t('rule.required')}`))
    }
    if (value && !regTel.test(value)) {
      callback(new Error(`${t('rule.tel')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  domain(rule, value, callback) {
    if (rule.required && !value) {
      return callback(new Error(`${t('rule.domain')}${t('rule.required')}`))
    }
    if (value && !regDomain.test(value)) {
      callback(new Error(`${t('rule.domain')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  PanDomain(rule, value, callback) {
    if (rule.required && !value) {
      return callback(new Error(`${t('rule.domain')}${t('rule.required')}`))
    }
    if (value && !regPanDomain.test(value)) {
      callback(new Error(`${t('rule.domain')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  password(rule, value, callback) {
    if (rule.required && !value) {
      return callback(new Error(`${t('rule.password')}${t('rule.required')}`))
    }
    if (value && !regPassword.test(value)) {
      callback(new Error(`${t('rule.passwordRule')}`))
    } else {
      callback()
    }
  },
  fax(rule, value, callback) {
    if (rule.required && !value) {
      return callback(new Error(`${t('rule.fax')}${t('rule.required')}`))
    }
    if (value && !regFax.test(value)) {
      callback(new Error(`${t('rule.fax')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  decimal(rule, value, callback) {
    if (rule.required && (typeof value === 'undefined' || value === null || value === '')) {
      return callback(new Error(`${t('rule.amount')}${t('rule.required')}`))
    }
    if (value && !regDecimal.test(value)) {
      callback(new Error(`${t('rule.amount')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  number(rule, value, callback) {
    if (rule.required && (typeof value === 'undefined' || value === null || value === '')) {
      return callback(new Error(`${t('rule.required')}`))
    }

    if (value && !regNumber.test(value)) {
      callback(new Error(`${t('rule.number')}${t('rule.format')}`))
    } else {
      callback()
    }
  },
  account(rule, value, callback) {
    if (rule.required && (typeof value === 'undefined' || value === null || value === '')) {
      return callback(new Error(`${t('rule.required')}`))
    }

    if (value && !regAccount.test(value)) {
      callback(new Error(`${t('rule.account')}`))
    } else {
      callback()
    }
  },
  // 可以为空的正数
  optionalPositiveInteger(rule, value, callback) {
    if (!value) return callback()

    let num = Number(value)
    let isNum = !isNaN(num)
    let isInt = !String(value).includes('.')
    let isPositive = num > 0

    if (isNum && isInt && isPositive) {
      return callback()
    }
    return callback(t('rule.pleaseInput') + t('rule.positiveInteger'))
  },
  forbiddenCharacters(rule, value, callback, forbiddenList = []) {
    // let patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im
    let str = '[' + forbiddenList.join('') + ']'
    let patrn = new RegExp(str)
    if (patrn.test(value)) {
      return callback(new Error(`${t('rule.forbiddenCharacters', {characters: forbiddenList.join()})}`))
    } else {
      return callback()
    }
  },
  forbiddenWords(rule, value, callback, forbiddenList = []) {
    let str = forbiddenList.join('|')
    let patrn = new RegExp(str)
    if (patrn.test(value)) {
      return callback(new Error(`${t('rule.forbiddenWords', {words: forbiddenList.join()})}`))
    } else {
      return callback()
    }
  },
  valueRrange(rule, value, callback, object) {
    let {min = 0 , max = 0} = object
    if (value >= min && value <= max) {
      callback()
    } else {
      callback(new Error(`${t('rule.valueRrange', {min: min, max: max})}`))
    }
  },
  regIpv4,
  regPositiveInteger
}
