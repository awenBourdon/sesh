import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/test',
      name: 'test',
      component: LoginView,
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    try {
      await authStore.fetchUser()
    } catch (err) {
      authStore.user = null
      authStore.isInitialized = true
    }
  }

  const isLoggedIn = !!authStore.user
  const isPublicRoute = to.meta.public

  if (!isPublicRoute && !isLoggedIn) {
    return { name: 'login' }
  }

  if (isPublicRoute && isLoggedIn && to.name !== 'test') {
    return { name: 'test' }
  }
})

export default router
