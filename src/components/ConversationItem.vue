<template>
  <div
      class="conversation-item"
      :class="{ active: conversation.id === selectedConversationId }"
      @click="selectConversation(conversation.id)"
  >
    <div class="avatar">
      <img :src="conversation.avatar" :alt="conversation.name" />
    </div>
    <div class="content">
      <div class="header">
        <h3>{{ conversation.name }}</h3>
        <span class="time">{{ conversation.lastTime }}</span>
      </div>
      <p class="message-preview">{{ conversation.lastMessage }}</p>
    </div>
    <div class="badge" v-if="conversation.unreadCount > 0">
      {{ conversation.unreadCount }}
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  conversation: {
    type: Object,
    required: true
  },
  selectedConversationId: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['select'])

const selectConversation = (id) => {
  emits('select', id)
}
</script>

<style scoped>
.conversation-item {
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: #f8f8f8;
}

.conversation-item.active {
  background-color: #e8f5e9;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.message-preview {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.badge {
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  margin-left: 10px;
}
</style>