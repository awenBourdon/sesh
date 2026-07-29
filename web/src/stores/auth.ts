import { defineStore } from 'pinia'
import { ref } from 'vue'
import { trpc } from '@/trpc'

interface User {
  id: number
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isInitialized = ref(false)

  async function fetchUser() {
    console.log('🔄 [AuthStore] Début de fetchUser...')
    try {
      user.value = await trpc.auth.me.query()
    } catch (err) {
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  return { user, isInitialized, fetchUser }
})
