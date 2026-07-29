<!-- web/src/views/LandingView.vue -->
<template>
  <div class="landing-container">
    <div class="hero">
      <h1>Bienvenue sur Sesh</h1>
      
      <div class="cta-group">
        <RouterLink to="/login" class="btn primary">Se connecter</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-family: sans-serif;
  text-align: center;
  color: #2c3e50;
}
.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.cta-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
}
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.2s;
}
.btn.primary {
  background-color: #3498db;
  color: white;
}
.btn.primary:hover {
  background-color: #2980b9;
}
</style>