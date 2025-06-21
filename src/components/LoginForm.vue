<template>
  <div class="login-container">
    <div class="login-box">
      <h2>用户登录</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input
            type="text"
            id="username"
            v-model="form.username"
            placeholder="请输入用户名"
        >
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="请输入密码"
        >
      </div>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <button @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const form = ref({
  username: '',
  password: ''
})

const errorMessage = ref('')
const router = useRouter()

const handleLogin = () => {
  if (!form.value.username || !form.value.password) {
    errorMessage.value = '用户名和密码不能为空'
    return
  }

  // 模拟登录验证
  if (form.value.username === 'admin' && form.value.password === '123456') {
    localStorage.setItem('user', JSON.stringify({
      username: form.value.username,
      role: 'admin'
    }))
    router.push('/conversations')
  } else if (form.value.username && form.value.password) {
    localStorage.setItem('user', JSON.stringify({
      username: form.value.username,
      role: 'user'
    }))
    router.push('/conversations')
  } else {
    errorMessage.value = '用户名或密码错误'
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 320px;
}

h2 {
  margin-bottom: 24px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #35495e;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}
</style>