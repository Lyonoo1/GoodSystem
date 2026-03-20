import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

import AdminLayout from '@/layouts/AdminLayout.vue'

export const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { title: '登录', hideInMenu: true },
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    meta: { title: '首页', icon: 'Home' },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'DataBoard' },
      },
      {
        path: 'examples',
        name: 'Examples',
        redirect: '/examples/list',
        meta: { title: '示例', icon: 'Menu' },
        children: [
          {
            path: 'list',
            name: 'ListPage',
            component: () => import('@/pages/examples/ListPage.vue'),
            meta: { title: '列表页' },
          },
          {
            path: 'form',
            name: 'FormPage',
            component: () => import('@/pages/examples/FormPage.vue'),
            meta: { title: '表单页' },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: { title: '404', hideInMenu: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

setupGuards(router)

export default router

