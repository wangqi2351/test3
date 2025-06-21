<template>
  <section class="h-[calc(100vh-4rem)] flex flex-col">
    <div class="mb-6">
      <h1 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-gray-800">用户对话</h1>
      <p class="mt-1 text-gray-500">与用户进行实时对话交流</p>
    </div>

    <div class="bg-white rounded-xl shadow-custom overflow-hidden flex-1 flex flex-col">
      <!-- 对话头部 -->
      <div class="border-b border-gray-200 p-4 flex items-center justify-between">
        <div class="flex items-center">
          <img :src="currentUser.avatar" :alt="currentUser.name" class="w-10 h-10 rounded-full object-cover">
          <div class="ml-3">
            <h3 class="font-medium text-gray-900">{{ currentUser.name }}</h3>
            <p class="text-xs text-gray-500">{{ currentUser.status }}</p>
          </div>
        </div>

        <div class="flex space-x-2">
          <button class="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="文件">
            <i class="fa fa-file-text-o"></i>
          </button>
          <button class="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="更多选项">
            <i class="fa fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      <!-- 对话历史 -->
      <div ref="chatHistory" class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- 系统消息 -->
        <div class="flex justify-center">
          <span class="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">今天 14:30</span>
        </div>

        <!-- 消息列表 -->
        <div v-for="(message, index) in messages" :key="index"
             :class="['flex items-start message-appear', message.sender === 'me' ? 'justify-end' : '']">
          <img v-if="message.sender !== 'me'" :src="currentUser.avatar" alt="用户头像" class="w-8 h-8 rounded-full object-cover">

          <div :class="['ml-2 max-w-[80%]', message.sender === 'me' ? 'mr-2' : '']">
            <div :class="['rounded-lg p-3',
                        message.sender === 'me'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-gray-100 rounded-tl-none']">
              <p>{{ message.content }}</p>
              <ul v-if="message.listItems" class="list-disc pl-5 mt-1 space-y-1">
                <li v-for="(item, i) in message.listItems" :key="i">{{ item }}</li>
              </ul>
            </div>
            <div :class="['flex mt-1', message.sender === 'me' ? 'justify-end' : '']">
              <span class="text-xs text-gray-400">{{ message.time }}</span>
              <i v-if="message.sender === 'me'" class="fa fa-check-circle ml-1 text-success"></i>
            </div>
          </div>

          <img v-if="message.sender === 'me'" src="https://picsum.photos/200/200?random=1" alt="我的头像" class="w-8 h-8 rounded-full object-cover">
        </div>

        <!-- 正在输入提示 -->
        <div v-if="isTyping" class="flex items-start message-appear">
          <img :src="currentUser.avatar" alt="用户头像" class="w-8 h-8 rounded-full object-cover">
          <div class="ml-2">
            <div class="bg-gray-100 rounded-lg rounded-tl-none p-3">
              <p class="typing-animation">正在输入...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex space-x-2 mb-2">
          <button class="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="表情">
            <i class="fa fa-smile-o"></i>
          </button>
          <button class="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="图片">
            <i class="fa fa-picture-o"></i>
          </button>
          <button class="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="文件">
            <i class="fa fa-paperclip"></i>
          </button>
        </div>

        <div class="flex">
          <input v-model="newMessage" @keypress.enter="sendMessage" type="text" placeholder="输入消息..."
                 class="flex-1 rounded-l-lg border border-r-0 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all">
          <button @click="sendMessage"
                  class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center">
            <i class="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 当前对话用户信息
const currentUser = ref({
  id: 1,
  name: '用户123456',
  avatar: 'https://picsum.photos/200/200?random=2',
  status: '在线'
})

// 消息列表
const messages = ref([
  {
    id: 1,
    sender: 'user',
    content: '你好，请问这个产品的具体使用方法是什么？',
    time: '14:31'
  },
  {
    id: 2,
    sender: 'me',
    content: '您好，感谢您的咨询。这个产品使用方法如下：',
    listItems: [
      '首先打开产品包装，取出主体和配件',
      '然后连接电源，等待设备启动',
      '打开手机APP，按照指引完成配对',
      '配对成功后即可正常使用'
    ],
    time: '14:35'
  },
  {
    id: 3,
    sender: 'user',
    content: '请问这个产品支持多设备连接吗？',
    time: '14:40'
  }
])

// 新消息输入
const newMessage = ref('')
const isTyping = ref(true)
const chatHistory = ref(null)

// 发送消息
const sendMessage = () => {
  if (newMessage.value.trim()) {
    const now = new Date()
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0')

    // 添加用户消息
    messages.value.push({
      id: Date.now(),
      sender: 'me',
      content: newMessage.value,
      time: timeString
    })

    newMessage.value = ''
    scrollToBottom()

    // 模拟对方正在输入
    isTyping.value = true
    scrollToBottom()

    // 模拟回复
    setTimeout(() => {
      isTyping.value = false

      const replies = [
        "感谢您的提问，我们的产品支持多设备连接，您可以同时在2台设备上使用。",
        "您好，这款产品的保修期是12个月，从购买日期开始计算。",
        "很抱歉听到您收到的产品有损坏，请您提供一下订单号，我们会为您安排退换货。",
        "您好，这个产品的使用方法非常简单，您只需要按照说明书上的步骤操作即可。",
        "感谢您的咨询，我们的客服人员会在10分钟内与您联系，请您保持电话畅通。"
      ]

      const randomReply = replies[Math.floor(Math.random() * replies.length)]

      messages.value.push({
        id: Date.now(),
        sender: 'user',
        content: randomReply,
        time: timeString
      })

      scrollToBottom()

      // 重新显示正在输入状态
      setTimeout(() => {
        isTyping.value = true
        scrollToBottom()
      }, 500)
    }, 1500)
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight
    }
  })
}

// 初始化时滚动到底部
onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* 动画效果 */
.message-appear {
  animation: messageAppear 0.3s ease-out forwards;
}

.typing-animation::after {
  content: '';
  animation: typing 1.4s infinite;
}

@keyframes messageAppear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes typing {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
</style>