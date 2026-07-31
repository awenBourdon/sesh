<template>
  <div class="dashboard-container">
    <div class="card">
      <span class="badge">Succès</span>
      <h1>Cool, vous êtes connecté !</h1>
      <p v-if="authStore.user">
        Ravi de vous revoir, <strong>{{ authStore.user.username }}</strong
        >.
      </p>

      <button @click="handleLogout" class="btn-logout">Se déconnecter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-family: sans-serif;
}
.card {
  text-align: center;
  padding: 2.5rem;
  border: 1px solid #e1e8ed;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: white;
  max-width: 400px;
  width: 100%;
}
.badge {
  display: inline-block;
  background-color: #e8f8f5;
  color: #1abc9c;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
h1 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}
p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}
.btn-logout {
  padding: 0.7rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-logout:hover {
  background-color: #c0392b;
}
</style>
