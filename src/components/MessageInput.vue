<template>
  <div class="message-input">
    <textarea
        v-model="message"
        placeholder="输入消息..."
        :rows="rows"
        @input="adjustTextareaHeight"
        @keydown.enter.prevent="sendMessageIfValid"
        ref="textarea"
    ></textarea>
    <div class="input-actions">
      <div class="char-count">{{ message.length }} / {{ maxChars }}</div>
      <button :disabled="!message.trim()" @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  onSend: {
    type: Function,
    required: true
  },
  maxChars: {
    type: Number,
    default: 500
  }
})

const message = ref('')
const rows = ref(1)
const maxRows = 5
const textarea = ref(null)

const adjustTextareaHeight = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    const scrollHeight = textarea.value.scrollHeight
    const maxHeight = maxRows * 24 // 24px per row

    if (scrollHeight <= maxHeight) {
      textarea.value.style.height = `${scrollHeight}px`
      rows.value = Math.ceil(scrollHeight / 24)
    } else {
      textarea.value.style.height = `${maxHeight}px`
      rows.value = maxRows
    }
  }
}

const sendMessage = () => {
  const content = message.value.trim()
  if (content) {
    props.onSend(content)
    message.value = ''
    rows.value = 1
    nextTick(() => {
      if (textarea.value) {
        textarea.value.style.height = 'auto'
      }
    })
  }
}

const sendMessageIfValid = () => {
  if (message.value.length <= props.maxChars) {
    sendMessage()
  } else {
    alert(`输入内容不能超过 ${props.maxChars} 个字符。`)
  }
}

onMounted(() => {
  adjustTextareaHeight()
})
</script>

<style scoped>
.message-input {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  background-color: #fff;
}

textarea {
  border: 1px solid #ddd;
  border-radius: 18px;
  padding: 10px 15px;
  font-size: 14px;
  resize: none;
  outline: none;
  transition: all 0.2s;
  overflow: hidden;
}

textarea:focus {
  border-color: #42b983;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.char-count {
  font-size: 12px;
  color: #888;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 18px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #35495e;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>