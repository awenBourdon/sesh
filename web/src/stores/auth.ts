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
    try {
      user.value = await trpc.auth.me.query()
    } catch (err) {
      user.value = null
    } finally {
      isInitialized.value = true
    }
  }

  async function logout() {
    await trpc.auth.logout.mutate()
    user.value = null
  }

  return { user, isInitialized, fetchUser, logout }
})
