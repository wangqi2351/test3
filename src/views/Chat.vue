<template>
  <div class="chat-page">
    <ChatSidebar
        :conversations="conversations"
        :selectedConversationId="selectedConversationId"
        @select-conversation="handleSelectConversation"
        @create-new-chat="handleCreateNewChat"
    />
    <div class="chat-main" v-if="selectedConversation">
      <div class="chat-header">
        <div class="header-info">
          <div class="avatar">
            <img :src="selectedConversation.avatar" :alt="selectedConversation.name" />
          </div>
          <div class="info-text">
            <h2>{{ selectedConversation.name }}</h2>
            <p v-if="selectedConversation.status === 'online'" class="status online">在线</p>
            <p v-else class="status offline">离线</p>
          </div>
        </div>
        <div class="header-actions">
          <button @click="navigateToAdmin" v-if="isAdmin">
            <i class="fas fa-cog"></i>
          </button>
          <button>
            <i class="fas fa-phone"></i>
          </button>
          <button>
            <i class="fas fa-video"></i>
          </button>
          <button>
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
      <div class="chat-messages" ref="messagesContainer">
        <ChatMessage
            v-for="(message, index) in selectedConversation.messages"
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
    <div class="empty-chat" v-else>
      <div class="empty-content">
        <i class="fas fa-comments"></i>
        <h3>选择一个会话开始聊天</h3>
        <p>从左侧选择一个联系人开始对话，或者创建一个新的聊天</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import MessageInput from '@/components/MessageInput.vue'

const router = useRouter()
const messagesContainer = ref(null)
const isWaitingResponse = ref(false)

// 模拟会话数据
const conversations = ref([
  {
    id: 'conv1',
    name: 'AI助手',
    avatar: 'https://picsum.photos/id/237/200/200',
    status: 'online',
    lastMessage: '有什么可以帮助你的吗？',
    lastMessageTime: '09:15',
    unreadCount: 0,
    messages: [
      {
        content: "你好！我是AI助手，有什么可以帮助你的吗？",
        isUser: false,
        timestamp: "09:15",
        isStreaming: false
      }
    ]
  },
  {
    id: 'conv2',
    name: '产品经理',
    avatar: 'https://picsum.photos/id/1025/200/200',
    status: 'online',
    lastMessage: '明天上午10点开会讨论新功能',
    lastMessageTime: '昨天',
    unreadCount: 2,
    messages: [
      {
        content: "明天上午10点开会讨论新功能，记得参加",
        isUser: false,
        timestamp: "昨天 16:30",
        isStreaming: false
      },
      {
        content: "好的，我会准时参加",
        isUser: true,
        timestamp: "昨天 16:32",
        isStreaming: false
      },
      {
        content: "需要准备相关资料吗？",
        isUser: true,
        timestamp: "昨天 16:33",
        isStreaming: false
      }
    ]
  },
  {
    id: 'conv3',
    name: '设计师',
    avatar: 'https://picsum.photos/id/1062/200/200',
    status: 'offline',
    lastMessage: '设计稿已经上传到共享文件夹',
    lastMessageTime: '周一',
    unreadCount: 1,
    messages: [
      {
        content: "设计稿已经上传到共享文件夹，请查收",
        isUser: false,
        timestamp: "周一 14:20",
        isStreaming: false
      },
      {
        content: "好的，我稍后查看",
        isUser: true,
        timestamp: "周一 14:22",
        isStreaming: false
      }
    ]
  }
])

const selectedConversationId = ref('conv1')
const selectedConversation = computed(() => {
  const conv = conversations.value.find(conv => conv.id === selectedConversationId.value)
  return conv ? {...conv} : null
})

const isAdmin = computed(() => {
  return localStorage.getItem('userRole') === 'admin'
})

const handleSelectConversation = (id) => {
  selectedConversationId.value = id
  // 清除未读消息
  const convIndex = conversations.value.findIndex(conv => conv.id === id)
  if (convIndex !== -1) {
    conversations.value[convIndex].unreadCount = 0
    conversations.value = [...conversations.value]
  }
}

const handleCreateNewChat = () => {
  const newId = 'conv' + (conversations.value.length + 1)
  const newConv = {
    id: newId,
    name: '新聊天',
    avatar: 'https://picsum.photos/id/1005/200/200',
    status: 'online',
    lastMessage: '',
    lastMessageTime: '',
    unreadCount: 0,
    messages: []
  }

  conversations.value.push(newConv)
  selectedConversationId.value = newId
  conversations.value = [...conversations.value]
}

const handleSendMessage = (content) => {
  const convIndex = conversations.value.findIndex(conv => conv.id === selectedConversationId.value)
  if (convIndex === -1) return

  const now = new Date()
  const message = {
    content,
    isUser: true,
    timestamp: formatTime(now),
    isStreaming: false
  }

  conversations.value[convIndex].messages.push(message)
  conversations.value[convIndex].lastMessage = content
  conversations.value[convIndex].lastMessageTime = message.timestamp
  conversations.value = [...conversations.value]

  scrollToBottom()
  isWaitingResponse.value = true

  setTimeout(() => {
    simulateAIResponse(content, convIndex)
  }, 1000)
}

const simulateAIResponse = (userMessage, convIndex) => {
  const responses = [
    "感谢你的提问，关于" + userMessage + "，我认为有以下几个方面需要考虑...",
    "我理解你的需求，针对" + userMessage + "，我们可以采取以下解决方案...",
    "根据我的分析，" + userMessage + "可能涉及到几个关键点...",
    "关于" + userMessage + "，我建议你考虑以下几点...",
    "很高兴收到你的消息，对于" + userMessage + "，我有以下建议..."
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

  conversations.value[convIndex].messages.push(aiMessage)
  conversations.value[convIndex].lastMessage = responseContent.substring(0, 20) + '...'
  conversations.value[convIndex].lastMessageTime = aiMessage.timestamp
  conversations.value = [...conversations.value]

  isWaitingResponse.value = false
  scrollToBottom()
}

const handleStreamEnd = (index) => {
  const convIndex = conversations.value.findIndex(conv => conv.id === selectedConversationId.value)
  if (convIndex !== -1 && conversations.value[convIndex].messages[index]) {
    conversations.value[convIndex].messages[index].isStreaming = false
    conversations.value = [...conversations.value]
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const navigateToAdmin = () => {
  router.push('/admin')
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* 样式保持不变 */
.chat-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.header-info {
  display: flex;
  align-items: center;
}

.header-info .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.header-info .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-info .info-text {
  text-align: left;
}

.header-info .info-text h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.header-info .info-text .status {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.header-info .info-text .status.online::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #67c23a;
  margin-right: 5px;
}

.header-info .info-text .status.offline::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #909399;
  margin-right: 5px;
}

.header-actions {
  display: flex;
}

.header-actions button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin-left: 15px;
  font-size: 16px;
}

.header-actions button:hover {
  color: #333;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.empty-chat {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
}

.empty-content {
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  max-width: 400px;
}

.empty-content i {
  font-size: 60px;
  color: #42b983;
  margin-bottom: 20px;
}

.empty-content h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.empty-content p {
  font-size: 16px;
  color: #666;
  margin: 0;
}
</style>