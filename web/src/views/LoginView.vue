<!-- web/src/views/LoginView.vue -->
<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Connexion</h1>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Email</label>
          <input v-model="loginForm.email" type="email" placeholder="votre@email.com" required />
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <input v-model="loginForm.password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-submit">Se connecter</button>
      </form>

      <p v-if="loginError" class="error">{{ loginError }}</p>

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

const loginForm = ref({ email: '', password: '' })
const loginError = ref('')

async function handleLogin() {
  loginError.value = ''
  try {
    await trpc.auth.login.mutate(loginForm.value)
    await authStore.fetchUser()
    router.push({ name: 'feed' })
  } catch (err) {
    if (err instanceof TRPCClientError) {
      loginError.value = err.message
    } else {
      loginError.value = 'Erreur de connexion'
    }
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
h1 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #2c3e50;
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
.btn-submit:hover {
  background-color: #27ae60;
}
.error {
  margin-top: 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
}
.back-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
.back-link a {
  color: #7f8c8d;
  text-decoration: none;
}
.back-link a:hover {
  text-decoration: underline;
}
</style>
