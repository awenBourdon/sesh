<!-- web/src/views/AuthTestView.vue -->
<template>
  <div class="auth-test">
    <h1>Test Auth — Sesh</h1>

    <section class="status">
      <h2>Statut</h2>
      <p v-if="loadingMe">Vérification en cours...</p>
      <p v-else-if="currentUser">
        ✅ Connecté en tant que <strong>{{ currentUser.username }}</strong>
      </p>
      <p v-else>❌ Non connecté</p>
      <button v-if="currentUser" @click="checkMe">Rafraîchir le statut</button>
    </section>

    <section class="form-block">
      <h2>Créer un compte</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="registerForm.email" type="email" placeholder="Email" required />
        <input v-model="registerForm.username" type="text" placeholder="Nom d'utilisateur" required />
        <input v-model="registerForm.password" type="password" placeholder="Mot de passe" required />
        <button type="submit">S'inscrire</button>
      </form>
      <p v-if="registerError" class="error">{{ registerError }}</p>
      <p v-if="registerSuccess" class="success">Compte créé : {{ registerSuccess.username }}</p>
    </section>

    <section class="form-block">
      <h2>Se connecter</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="loginForm.email" type="email" placeholder="Email" required />
        <input v-model="loginForm.password" type="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
      <p v-if="loginError" class="error">{{ loginError }}</p>
    </section>

    <section class="form-block" v-if="currentUser">
      <button @click="handleLogout">Se déconnecter</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { trpc } from '@/trpc';

interface CurrentUser {
  id: number;
  username: string;
}

const currentUser = ref<CurrentUser | null>(null);
const loadingMe = ref(true);

const registerForm = ref({ email: '', username: '', password: '' });
const registerError = ref('');
const registerSuccess = ref<CurrentUser | null>(null);

const loginForm = ref({ email: '', password: '' });
const loginError = ref('');

async function checkMe() {
  loadingMe.value = true;
  try {
    currentUser.value = await trpc.auth.me.query();
  } catch {
    currentUser.value = null;
  } finally {
    loadingMe.value = false;
  }
}

async function handleRegister() {
  registerError.value = '';
  registerSuccess.value = null;
  try {
    const user = await trpc.auth.register.mutate(registerForm.value);
    registerSuccess.value = user;
    await checkMe();
  } catch (err: any) {
    registerError.value = err.message ?? 'Erreur inconnue';
  }
}

async function handleLogin() {
  loginError.value = '';
  try {
    await trpc.auth.login.mutate(loginForm.value);
    await checkMe();
  } catch (err: any) {
    loginError.value = err.message ?? 'Erreur inconnue';
  }
}

async function handleLogout() {
  currentUser.value = null;
}

onMounted(checkMe);
</script>

<style scoped>
.auth-test {
  max-width: 400px;
  margin: 2rem auto;
  font-family: sans-serif;
}
.form-block {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input, button {
  padding: 0.5rem;
}
.error { color: #c0392b; }
.success { color: #27ae60; }
</style>