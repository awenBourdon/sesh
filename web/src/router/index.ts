import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import FeedView from '@/views/FeedView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { public: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/feed',
      name: 'feed',
      component: FeedView,
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

  if (isPublicRoute && isLoggedIn && to.name !== 'feed') {
    return { name: 'feed' }
  }
})

export default router
