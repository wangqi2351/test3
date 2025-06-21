<template>
  <div id="app">
    <div v-if="isLoggedIn" class="logout-container">
      <button @click="logout">退出登录</button>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoggedIn = computed(() => {
  return localStorage.getItem('isLoggedIn') === 'true'
})

const logout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
  height: 100vh;
}

.logout-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.logout-container button {
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.logout-container button:hover {
  background-color: #f05b5b;
}
</style>