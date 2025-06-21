<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>智能对话助手</h1>
    </div>
    <div class="chat-messages" ref="messagesContainer">
      <ChatMessage
          v-for="(message, index) in messages"
          :key="index"
          :content="message.content"
          :isUser="message.isUser"
          :timestamp="message.timestamp"
          :isStreaming="message.isStreaming"
          @stream-end="handleStreamEnd(index)"
      />
      <div v-if="isWaitingResponse" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <MessageInput :onSend="handleSendMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ChatMessage from '@/components/ChatMessage.vue'
import MessageInput from '@/components/MessageInput.vue'

// 先定义formatTime函数
const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const messagesContainer = ref(null)
const messages = ref([
  {
    content: "你好！我是智能对话助手，有什么可以帮助你的吗？",
    isUser: false,
    timestamp: formatTime(new Date()), // 现在函数已经定义，可以安全调用
    isStreaming: false
  }
])
const isWaitingResponse = ref(false)

const handleSendMessage = (content) => {
  const now = new Date()
  const message = {
    content,
    isUser: true,
    timestamp: formatTime(now),
    isStreaming: false
  }

  messages.value.push(message)
  scrollToBottom()
  isWaitingResponse.value = true

  // 模拟AI回复
  setTimeout(() => {
    simulateAIResponse(content)
  }, 1000)
}

const simulateAIResponse = (userMessage) => {
  const responses = [
    "感谢你的提问，我理解你的需求是关于" + userMessage + "。让我为你提供一些相关的信息...",
    "这是一个很好的问题。关于" + userMessage + "，我认为有几个方面值得考虑...",
    "我明白你在询问" + userMessage + "。根据我的知识库，以下是一些关键点...",
    "对于" + userMessage + "这个问题，我可以提供以下见解...",
    "我很高兴你问到了" + userMessage + "。这里有一些可能对你有帮助的信息..."
  ]

  const randomIndex = Math.floor(Math.random() * responses.length)
  const responseContent = responses[randomIndex]

  const now = new Date()
  const aiMessage = {
    content: responseContent,
    isUser: false,
    timestamp: formatTime(now),
    isStreaming: true
  }

  messages.value.push(aiMessage)
  isWaitingResponse.value = false
  scrollToBottom()
}

const handleStreamEnd = (index) => {
  messages.value[index].isStreaming = false
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* 样式保持不变 */
</style>