<template>
  <div :class="['message', { 'user-message': isUser, 'ai-message': !isUser }]">
    <div class="avatar">
      <img :src="avatar" :alt="isUser ? '用户头像' : 'AI头像'" />
    </div>
    <div class="message-content">
      <!-- 使用 v-text 避免 XSS 攻击 -->
      <div class="message-text" v-text="displayText"></div>
      <div class="message-time">{{ timestamp }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: String,
    default: ''
  },
  isStreaming: {
    type: Boolean,
    default: false
  },
  // 新增头像 URL 参数
  userAvatar: {
    type: String,
    default: 'https://picsum.photos/id/64/40/40'
  },
  aiAvatar: {
    type: String,
    default: 'https://picsum.photos/id/237/40/40'
  }
})

const emit = defineEmits(['stream-end'])

const displayText = ref('')
// 根据传入的参数确定头像 URL
const avatar = ref(props.isUser ? props.userAvatar : props.aiAvatar)
const streamIndex = ref(0)
// 新增状态变量，控制流式输出是否正在进行
const isStreamingInProgress = ref(false)

const startStreaming = () => {
  if (isStreamingInProgress.value) return
  isStreamingInProgress.value = true

  const streamInterval = setInterval(() => {
    if (streamIndex.value < props.content.length) {
      displayText.value += props.content[streamIndex.value]
      streamIndex.value++
    } else {
      clearInterval(streamInterval)
      isStreamingInProgress.value = false
      emit('stream-end')
    }
  }, 50)
}

onMounted(() => {
  console.log('ChatMessage 组件挂载，开始处理消息显示')
  if (props.isStreaming) {
    startStreaming()
  } else {
    displayText.value = props.content
  }
})

watch(() => props.isStreaming, (newVal) => {
  console.log('isStreaming 值发生变化，新值为:', newVal)
  if (newVal && displayText.value === '') {
    startStreaming()
  }
})
</script>

<style scoped>
.message {
  display: flex;
  margin: 10px 0;
  padding: 10px;
  max-width: 80%;
}

.user-message {
  justify-content: flex-end;
  margin-left: auto;
}

.ai-message {
  justify-content: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  background-color: #f0f0f0;
  padding: 10px 15px;
  border-radius: 18px;
  position: relative;
  max-width: calc(100% - 50px);
}

.user-message .message-content {
  background-color: #dcf8c6;
}

.message-text {
  word-wrap: break-word;
  text-align: left;
}

.message-time {
  font-size: 12px;
  color: #888;
  text-align: right;
  margin-top: 5px;
}
</style>