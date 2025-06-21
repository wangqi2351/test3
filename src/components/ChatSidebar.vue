<template>
  <div class="chat-sidebar">
    <div class="sidebar-header">
      <h2>会话列表</h2>
      <button @click="createNewChat">
        <i class="fas fa-plus"></i>
      </button>
    </div>
    <div class="search-box">
      <input type="text" placeholder="搜索会话..." v-model="searchQuery" @input="filterConversations">
    </div>
    <div class="conversations-list">
      <div
          v-for="(conversation, index) in filteredConversations"
          :key="conversation.id"
          :class="['conversation-item', { active: selectedConversationId === conversation.id }]"
          @click="selectConversation(conversation.id)"
      >
        <div class="avatar">
          <img :src="conversation.avatar" :alt="conversation.name" />
        </div>
        <div class="conversation-info">
          <div class="name-time">
            <h3>{{ conversation.name }}</h3>
            <span class="time">{{ conversation.lastMessageTime }}</span>
          </div>
          <p class="last-message">{{ conversation.lastMessage }}</p>
          <span v-if="conversation.unreadCount > 0" class="unread-count">{{ conversation.unreadCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  conversations: {
    type: Array,
    required: true
  },
  selectedConversationId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-conversation', 'create-new-chat'])

const searchQuery = ref('')
const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.conversations
  }

  const query = searchQuery.value.toLowerCase()
  return props.conversations.filter(conversation =>
      conversation.name.toLowerCase().includes(query) ||
      (conversation.lastMessage && conversation.lastMessage.toLowerCase().includes(query))
  )
})

const selectConversation = (id) => {
  emit('select-conversation', id)
}

const createNewChat = () => {
  emit('create-new-chat')
}

// 监听搜索查询变化
watch(searchQuery, () => {
  filterConversations()
})

const filterConversations = () => {
  // 已通过计算属性实现过滤
}
</script>

<style scoped>
.chat-sidebar {
  width: 300px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.sidebar-header button {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.search-box {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  position: relative;
}

.conversation-item:hover {
  background-color: #f8f9fa;
}

.conversation-item.active {
  background-color: #e8f5e9;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.name-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.name-time h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-time .time {
  font-size: 12px;
  color: #888;
}

.last-message {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.unread-count {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>