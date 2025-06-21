<template>
  <div class="conversations-layout">
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>会话列表</h2>
        <div class="user-info">
          <div class="user-avatar">
            <img :src="user.avatar" alt="用户头像" />
          </div>
          <div class="user-details">
            <div class="username">{{ user.username }}</div>
            <div class="user-role">{{ user.role === 'admin' ? '管理员' : '用户' }}</div>
          </div>
          <button class="logout-btn" @click="logout">退出</button>
        </div>
      </div>
      <div class="search-box">
        <input
            type="text"
            placeholder="搜索会话..."
            v-model="searchQuery"
        />
      </div>
      <div class="conversations-list">
        <ConversationItem
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            :conversation="conversation"
            :selectedConversationId="selectedConversationId"
            @select="selectConversation"
        />
      </div>
    </div>
    <div class="main-content">
      <router-view
          :user="user"
          :selectedConversation="getSelectedConversation"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ConversationItem from '@/components/ConversationItem.vue'

const router = useRouter()

// 获取当前用户
const user = computed(() => {
  const userData = localStorage.getItem('user')
  return userData ? JSON.parse(userData) : { username: '未知用户', role: 'user', avatar: 'https://picsum.photos/id/237/40/40' }
})

// 会话列表数据
const conversations = ref([
  {
    id: '1',
    name: '智能助手',
    avatar: 'https://picsum.photos/id/237/40/40',
    lastMessage: '你好，有什么可以帮助你的吗？',
    lastTime: '09:42',
    unreadCount: 3,
    messages: [
      { content: "你好！我是智能对话助手，有什么可以帮助你的吗？", isUser: false, timestamp: "09:42" }
    ]
  },
  {
    id: '2',
    name: '技术支持',
    avatar: 'https://picsum.photos/id/1005/40/40',
    lastMessage: '已为你发送解决方案，请查收',
    lastTime: '昨天',
    unreadCount: 0,
    messages: [
      { content: "请问您的问题解决了吗？", isUser: false, timestamp: "昨天 18:30" },
      { content: "已为你发送解决方案，请查收", isUser: false, timestamp: "昨天 18:25" },
      { content: "我的系统出现了一些问题", isUser: true, timestamp: "昨天 18:10" }
    ]
  },
  {
    id: '3',
    name: '产品经理',
    avatar: 'https://picsum.photos/id/1012/40/40',
    lastMessage: '下周二进行产品讨论',
    lastTime: '周一',
    unreadCount: 1,
    messages: [
      { content: "下周二进行产品讨论", isUser: false, timestamp: "周一 14:20" },
      { content: "好的，我准备好了", isUser: true, timestamp: "周一 14:15" }
    ]
  },
  {
    id: '4',
    name: '设计团队',
    avatar: 'https://picsum.photos/id/1027/40/40',
    lastMessage: '请查收新的设计稿',
    lastTime: '周一',
    unreadCount: 0,
    messages: [
      { content: "请查收新的设计稿", isUser: false, timestamp: "周一 10:30" },
      { content: "收到，我稍后查看", isUser: true, timestamp: "周一 10:32" }
    ]
  }
])

const searchQuery = ref('')
const selectedConversationId = ref('1')

// 计算属性：过滤会话列表
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  return conversations.value.filter(conversation =>
      conversation.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 计算属性：获取当前选中的会话
const getSelectedConversation = computed(() => {
  return conversations.value.find(conversation => conversation.id === selectedConversationId.value)
})

// 选择会话
const selectConversation = (id) => {
  if (selectedConversationId.value !== id) {
    selectedConversationId.value = id
    router.push(`/conversations/${id}`)
  }
}

// 退出登录
const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  // 检查是否有会话ID参数
  const routeId = router.currentRoute.value.params.id
  if (routeId && conversations.value.some(c => c.id === routeId)) {
    selectedConversationId.value = routeId
  }
})
</script>

<style scoped>
.conversations-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 300px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
}

h2 {
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.user-role {
  font-size: 12px;
  color: #666;
}

.logout-btn {
  background-color: transparent;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
}

.logout-btn:hover {
  color: #f56c6c;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.search-box input:focus {
  border-color: #42b983;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>