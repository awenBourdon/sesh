<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: currentMode === 'login' }"
          @click="switchMode('login')"
        >
          Connexion
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentMode === 'register' }"
          @click="switchMode('register')"
        >
          Inscription
        </button>
      </div>

      <h1>{{ currentMode === 'login' ? 'Se connecter' : "S'inscrire" }}</h1>

      <form @submit.prevent="handleAuth">
        <div class="input-group" v-if="currentMode === 'register'">
          <label>Identifiant</label>
          <input 
            v-model="authForm.username" 
            type="text" 
            placeholder="ton pseudo" 
            required 
            :disabled="isSubmitting"
          />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input 
            v-model="authForm.email" 
            type="email" 
            placeholder="votre@email.com" 
            required 
            :disabled="isSubmitting"
          />
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <input 
            v-model="authForm.password" 
            type="password" 
            placeholder="••••••••" 
            required 
            :disabled="isSubmitting"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Traitement...' : (currentMode === 'login' ? 'Se connecter' : "S'inscrire") }}
        </button>
      </form>

      <p v-if="authError" class="error">{{ authError }}</p>

      <p class="back-link">
        <RouterLink to="/">← Retour à l'accueil</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { trpc } from '@/trpc'
import { useAuthStore } from '@/stores/auth'
import { TRPCClientError } from '@trpc/client'

const router = useRouter()
const authStore = useAuthStore()

const currentMode = ref<'login' | 'register'>('login')
const authError = ref('')
const isSubmitting = ref(false)

const authForm = ref({
  email: '',
  password: '',
  username: ''
})

function switchMode(mode: 'login' | 'register') {
  currentMode.value = mode
  authError.value = ''
}

async function handleAuth() {
  authError.value = ''
  isSubmitting.value = true

  try {
    if (currentMode.value === 'login') {
      await trpc.auth.login.mutate({
        email: authForm.value.email,
        password: authForm.value.password
      })
    } else {
      await trpc.auth.register.mutate({
        email: authForm.value.email,
        username: authForm.value.username,
        password: authForm.value.password
      })
    }

    await authStore.fetchUser()
    router.push({ name: 'feed' })
    
  } catch (err) {
    if (err instanceof TRPCClientError) {
      authError.value = err.message
    } else {
      authError.value = currentMode.value === 'login' 
        ? 'Erreur de connexion' 
        : "Erreur lors de l'inscription"
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-family: sans-serif;
}
.auth-card {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: white;
}

.auth-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e1e8ed;
}
.tab-btn {
  flex: 1;
  padding: 0.75rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #7f8c8d;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-btn:hover {
  color: #2c3e50;
  background-color: #f9f9f9;
}
.tab-btn.active {
  color: #2ecc71;
  border-bottom-color: #2ecc71;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #2c3e50;
  text-align: center;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.3rem;
  font-size: 0.9rem;
  color: #34495e;
}
input {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}
input:focus {
  outline: none;
  border-color: #2ecc71;
}
input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-submit {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-submit:hover:not(:disabled) {
  background-color: #27ae60;
}
.btn-submit:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}
.error {
  margin-top: 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  background: #fdecea;
  padding: 0.5rem;
  border-radius: 4px;
}
.back-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}
.back-link a {
  color: #7f8c8d;
  text-decoration: none;
}
.back-link a:hover {
  text-decoration: underline;
}
</style>