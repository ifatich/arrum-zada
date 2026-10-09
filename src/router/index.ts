import { createRouter, createWebHistory } from 'vue-router'
import SimulasiBrdView from '../views/SimulasiBrdView.vue'
import DashboardView from '../views/DashboardView.vue'
import DeeplinkTesterView from '../views/DeeplinkTesterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SimulasiBrdView,
      alias: ['/simulasi-brd', '/simulasi'],
    },
    {
      path: '/dashboard-legacy',
      name: 'dashboard-legacy',
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
