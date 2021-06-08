import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: 'sss' },
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/HelloWorld.vue'),
        name: 'Dashboard',
        meta: { title: 'Dashboard' }
      }
    ]
  },
  {
    path: '/components',
    component: Layout,
    meta: { title: 'Components' },
    children: [
      {
        path: 'input-tag',
        component: () => import('../views/inputTag.vue'),
        name: 'InputTag',
        meta: { title: 'InputTag' }
      }
    ]
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../components/input-tag/index.vue'),
    meta: { title: 'Test' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
