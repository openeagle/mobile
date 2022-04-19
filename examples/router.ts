import { RouterView, createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./home.vue'),
  },
  {
    path: '/components',
    component: RouterView,
    redirect: '/components/image-uploader',
    children: [
      {
        path: 'image-uploader',
        component: () => import('./components/image-uploader.vue'),
      },
      {
        path: 'number-text',
        component: () => import('./components/number-text.vue'),
      },
      {
        path: 'loader',
        component: () => import('./components/loader.vue'),
      },
      {
        path: 'list',
        component: () => import('./components/list.vue'),
      },
    ],
  },
  {
    path: '/hooks',
    component: RouterView,
    redirect: '/hooks/use-list',
    children: [
      {
        path: 'use-list',
        component: () => import('./hooks/use-list'),
      },
      {
        path: 'use-toast',
        component: () => import('./hooks/use-toast'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
