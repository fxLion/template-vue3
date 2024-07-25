const fs = require('fs')
const path = require('path')
const DIR_TEMPLATE = 'plop-template/'
const DIR_PAGE = 'src/views'
const DIR_I18N = 'src/i18n/'
const DIR_ROUTE = 'src/router/routes'

module.exports = plop => {
  // npx plop
  plop.setGenerator('page', {
    description: '快速生成页面、i18n、路由文件',
    prompts: [
      /**
       * 如 path 为 enter/login
       * 就会指定到 src/pages/enter/login、src/i18n/modules/enter、src/router/modules
       * 目录不存在则自动创建
       * 并且分别创建 src/pages/enter/login/index.vue、src/i18n/modules/enter/login.js、src/router/modules/login.js
       */
      {
        type: 'input',
        name: 'initModule',
        message: '请输入模块名',
        validate: function (value) {
          if (!String(value).trim()) {
            return '模块名不能为空，请重新输入'
          }
          return true
        }
      },
      {
        type: 'checkbox',
        name: 'initType',
        message: '初始化类型(默认全部)',
        choices: ['page', 'router', 'i18n']
      }
    ],
    actions: data => {
      let pathArr = String(data.initModule)
        .split('/')
        .map(item => item.trim())
        .filter(item => item.trim())
      let typeArr = data.initType.length ? data.initType : ['page', 'router', 'i18n']
      let actions = []

      for (let item of typeArr) {
        let funName = `init${firstUpper(item)}`
        initFuns[funName](pathArr, actions)
      }
      return actions
    }
  })
}

const initFuns = {
  /**
   * 页面初始化
   */
  initPage(pathArr, actions) {
    mkdirIfNotExist(path.join(__dirname, DIR_PAGE, ...pathArr))

    actions.push({
      type: 'add',
      path: path.join(DIR_PAGE, pathArr.join('/'), 'index.vue'),
      templateFile: path.join(DIR_TEMPLATE, 'TemplatePage.vue')
    })
  },
  /**
   * i18n初始化
   */
  initI18n(pathArr, actions) {
    mkdirIfNotExist(path.join(__dirname, DIR_I18N))

    const fileName = pathArr.pop() + '.js'
    const filePath = path.join(__dirname, DIR_I18N, pathArr.join('/'))

    // 初始化 index.js 文件
    if (!fs.existsSync(filePath)) {
      mkdirIfNotExist(filePath)
      actions.push({
        type: 'add',
        path: path.join(DIR_I18N, pathArr.join('/'), 'index.js'),
        templateFile: path.join(DIR_TEMPLATE, 'TemplateI18n.js')
      })
    }

    actions.push({
      type: 'add',
      path: path.join(DIR_I18N, pathArr.join('/'), fileName),
      templateFile: path.join(DIR_TEMPLATE, 'TemplateI18n.js')
    })
  },
  /**
   * 路由初始化
   */
  initRouter(pathArr, actions) {
    mkdirIfNotExist(path.join(__dirname, DIR_ROUTE))

    const fileName = pathArr[0] + '.js'
    const filePath = path.join(__dirname, DIR_ROUTE, fileName)
    const templateData = {
      path: path.join('/', pathArr.join('/')),
      name: pathArr
        .map((item, index) => {
          return index == 0 ? item : firstUpper(item)
        })
        .join(''),
      component: `@/pages/${path.join(pathArr.join('/'), 'index.vue')}`
    }

    if (!fs.existsSync(filePath)) {
      actions.push({
        type: 'add',
        path: path.join(DIR_ROUTE, fileName),
        templateFile: path.join(DIR_TEMPLATE, 'TemplateRoute.js'),
        data: templateData
      })
    } else {
      actions.push({
        type: 'modify',
        path: path.join(DIR_ROUTE, fileName),
        transform(fileContents, data) {
          let routeStr = fileContents.replace(/export default \[([\s\S]+)\]$/m, '$1').trimRight()
          let newRouteStr = `
    {
      path: '${templateData.path}',
      name: '${templateData.name}',
      component: () => import('${templateData.component}'),
      meta: {
        key: '',
        active: '${templateData.name}',
        title: '',
        reqUrl: '',
        actionKey: ''
      }
    }
  `
          return `export default [${routeStr},${newRouteStr}]`
        }
      })
    }
  }
}

function mkdirIfNotExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}
function firstUpper(str) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1)
}
