import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import DeeplinkTesterView from '../views/DeeplinkTesterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/deeplink-test',
      name: 'deeplink-test',
      component: DeeplinkTesterView,
    },
  ],
})

export default router
