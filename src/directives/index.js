export function setupDirectives(app) {
  const allModules = import.meta.globEager('./*.js')
  Object.keys(allModules).forEach(modulePath => {
    const key = modulePath.replace(/\.\/(.*)\.js$/, '$1')
    app.directive(key, allModules[modulePath].default)
  })
}
