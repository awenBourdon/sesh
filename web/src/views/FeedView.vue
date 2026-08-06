<template>
  <main class="dashboard">
    <header class="dashboard-header">
      <div>
        <h1>Tableau de bord</h1>
        <p v-if="authStore.user">
          Bonjour <strong>{{ authStore.user.username }}</strong>
        </p>
      </div>

      <button @click="handleLogout" class="btn">
        Déconnexion
      </button>
    </header>

    <section class="map-card">
      <div id="dashboard-map" class="map"></div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}

onMounted(() => {
  const map = L.map('dashboard-map').setView([48.8566, 2.3522], 12) // Zoom légèrement dézoomé pour voir plus large

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)

  L.marker([48.8566, 2.3522]).addTo(map)
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-heading);
}

.dashboard-header p {
  color: var(--color-text);
  opacity: .7;
}

.map-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1rem;
}

.map {
  width: 100%;
  height: 550px;
  border-radius: 10px;
  overflow: hidden;
}

.btn {
  padding: .7rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #e74c3c;
  color: white;
  transition: .2s;
}

.btn:hover {
  opacity: .9;
}

@media (max-width: 700px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .map {
    height: 400px;
  }
}
</style>