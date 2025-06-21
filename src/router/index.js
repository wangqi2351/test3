import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Chat from '@/views/Chat.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/chat'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/chat',
            name: 'Chat',
            component: Chat,
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            name: 'Admin',
            component: AdminDashboard,
            meta: { requiresAuth: true, adminOnly: true }
        }
    ]
})

// 全局前置守卫，用于验证登录状态


export default router    