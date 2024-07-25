export default [
  {
    path: '{{path}}',
    name: '{{name}}',
    component: () => import('{{component}}'),
    meta: {
      key: '',
      active: '',
      title: '',
      reqUrl: '',
      actionKey: ''
    }
  }
]
