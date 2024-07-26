import Layout from '@/layout/index.vue'

const modules = import.meta.glob('./*.js', {eager: true})
const asyncRoutes = []
Object.keys(modules).forEach(key => {
  asyncRoutes.push(...modules[key].default)
})

export const basicRoutes = [
  // {
  //   name: 'NotFound',
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/404'
  // },
  // {
  //   name: 'error',
  //   path: '/error',
  //   component: () => import('@/views/error.vue'),
  //   meta: {
  //     title: 'Error | FUYUN'
  //   }
  // },
  {
    path: '/login',
    name: 'EnterLogin',
    component: () => import('@/views/login/index.vue'),
    meta: {
      key: '',
      active: '',
      title: 'login | FUYUN',
      reqUrl: '',
      actionKey: ''
    }
  },
  {
    name: 'Home',
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {
      title: 'Home | FUYUN',
      icon: 'mdi:chart-bar'
    },
    children: [
      {
        name: 'home',
        path: '/home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: 'Home | FUYUN'
        }
      },
      ...asyncRoutes
    ]
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404.vue'),
    meta: {
      title: '404 | FUYUN'
    }
  },
]



export { asyncRoutes }
