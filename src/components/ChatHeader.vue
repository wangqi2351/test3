<template>
  <div class="chat-header">
    <h1>智能对话助手</h1>
    <div class="user-info" v-if="username">
      欢迎，{{ username }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const username = computed(() => {
  return localStorage.getItem('username') || '用户'
})
</script>

<style scoped>
.chat-header {
  padding: 20px;
  background-color: #42b983;
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.user-info {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.8;
}
</style>