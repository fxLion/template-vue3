
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
export const setupComponents = (app) => {
    // Import and register your components here
    // 注册公共组件
    const baseComponents = import.meta.glob('@/components/**/*.vue', {eager: true})
    Object.keys(baseComponents).forEach((fileName, component) => {
        // 获取组件的 PascalCase 命名
        const componentName = upperFirst(
            camelCase(
                // 剥去文件名开头的 `./` 和结尾的扩展名
                fileName.substring(fileName.lastIndexOf('/')).replace(/^\.?\/(.*)\.\w+$/, '$1')
            )
        )
        // 全局注册组件
        app.component(componentName, baseComponents[fileName].default)
    })
}