<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>对话管理后台</h1>
      <div class="dashboard-actions">
        <button @click="refreshData">刷新数据</button>
        <button @click="exportData">导出数据</button>
      </div>
    </div>
    <div class="dashboard-content">
      <div class="stats-cards">
        <div class="stat-card">
          <div class="card-header">今日对话</div>
          <div class="card-value">{{ todayConversations }}</div>
          <div class="card-change" :class="{ 'increase': conversationChange > 0 }">
            {{ conversationChange > 0 ? '+' : '' }}{{ conversationChange }}%
          </div>
        </div>
        <div class="stat-card">
          <div class="card-header">平均回复时间</div>
          <div class="card-value">{{ avgResponseTime }}秒</div>
          <div class="card-change" :class="{ 'increase': responseTimeChange > 0 }">
            {{ responseTimeChange > 0 ? '+' : '' }}{{ responseTimeChange }}%
          </div>
        </div>
        <div class="stat-card">
          <div class="card-header">用户满意度</div>
          <div class="card-value">{{ satisfactionRate }}%</div>
          <div class="card-change increase">+2.3%</div>
        </div>
      </div>
      <div class="conversations-table">
        <h2>对话历史</h2>
        <div class="table-container">
          <table>
            <thead>
            <tr>
              <th>对话ID</th>
              <th>用户</th>
              <th>开始时间</th>
              <th>消息数量</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(conversation, index) in conversations" :key="index">
              <td>{{ conversation.id }}</td>
              <td>{{ conversation.user }}</td>
              <td>{{ conversation.startTime }}</td>
              <td>{{ conversation.messageCount }}</td>
              <td>
                <span :class="getStatusClass(conversation.status)">{{ conversation.status }}</span>
              </td>
              <td>
                <button @click="viewConversation(conversation.id)">查看详情</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const todayConversations = ref(128)
const conversationChange = ref(12.5)
const avgResponseTime = ref(8.5)
const responseTimeChange = ref(-3.2)
const satisfactionRate = ref(94.7)
const conversations = ref([
  { id: 'CONV-20230615-001', user: '用户A', startTime: '2023-06-15 09:15', messageCount: 12, status: '已完成' },
  { id: 'CONV-20230615-002', user: '用户B', startTime: '2023-06-15 10:30', messageCount: 8, status: '已完成' },
  { id: 'CONV-20230615-003', user: '用户C', startTime: '2023-06-15 11:45', messageCount: 5, status: '进行中' },
  { id: 'CONV-20230615-004', user: '用户D', startTime: '2023-06-15 13:20', messageCount: 15, status: '已完成' },
  { id: 'CONV-20230615-005', user: '用户E', startTime: '2023-06-15 14:10', messageCount: 7, status: '已完成' },
  { id: 'CONV-20230615-006', user: '用户F', startTime: '2023-06-15 15:30', messageCount: 3, status: '进行中' }
])

const refreshData = () => {
  // 模拟刷新数据
  alert('数据已刷新')
}

const exportData = () => {
  // 模拟导出数据
  alert('数据导出中...')
}

const viewConversation = (id) => {
  // 模拟查看对话详情
  alert(`查看对话 ${id} 详情`)
}

const getStatusClass = (status) => {
  return {
    'status-completed': status === '已完成',
    'status-pending': status === '进行中',
    'status-closed': status === '已关闭'
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  height: 100vh;
  background-color: #f0f2f5;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-actions button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.stats-cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  margin: 0 10px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-change {
  font-size: 14px;
}

.increase {
  color: #67c23a;
}

.decrease {
  color: #f56c6c;
}

.conversations-table {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f7fa;
  font-weight: 600;
}

tr:hover {
  background-color: #fafafa;
}

button {
  padding: 6px 12px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #3a8ee6;
}

.status-completed {
  color: #67c23a;
  background-color: #f0f9eb;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-pending {
  color: #e6a23c;
  background-color: #fdf6ec;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-closed {
  color: #909399;
  background-color: #f4f4f5;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>