/**
 * router/index.ts
 * Vue Router 路由配置。
 *
 * 页面分为三类布局：`home`、`auth`、`app`。
 * 路由守卫负责鉴权检查，并在跨布局跳转时触发过渡动画。
 */
import { nextTick } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { usePageTransition } from '@/composables/usePageTransition'

// 路由表按用户看到的页面分组组织。
const routes: RouteRecordRaw[] = [
  // 首页。
  {
    path: '/',
    component: () => import('@/views/HomeView.vue'),
    meta: { layout: 'home' },
  },
  // 认证页：登录和注册共用 AuthLayout。
  {
    path: '/auth',
    component: () => import('@/views/auth/AuthLayout.vue'),
    redirect: '/auth/login',
    meta: { layout: 'auth' },
    children: [
      { path: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { order: 0, layout: 'auth' } },
      { path: 'register', component: () => import('@/views/auth/RegisterView.vue'), meta: { order: 1, layout: 'auth' } },
    ],
  },
  // 工作台：由 AppLayout 根据 view/subview 渲染具体子视图。
  {
    path: '/app/:view?/:subview?',
    component: () => import('@/views/app/AppLayout.vue'),
    meta: { requiresAuth: true, layout: 'app' },
  },
  // 兜底：未知路径统一回到工作台默认页。
  {
    path: '/:pathMatch(.*)*',
    redirect: '/app/workspace',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 前置守卫：先确认登录状态，再处理跨布局切换动画。
router.beforeEach(async (to, from) => {
  const { currentUser, authChecked, refreshCurrentUser } = useAuth()

  // 首次导航时主动刷新登录态，避免页面刷新后误判为未登录。
  if (!authChecked.value) {
    await refreshCurrentUser()
  }

  // 未登录访问受保护页面时，跳转到登录页。
  if (to.meta.requiresAuth && !currentUser.value) {
    return '/auth/login'
  }

  // 已登录用户不再进入登录/注册页，直接回到工作台。
  if (to.path.startsWith('/auth') && currentUser.value) {
    return '/app/workspace'
  }

  // 跨布局跳转时，先让 loading 遮罩完整进场，再继续导航。
  const fromLayout = from.meta.layout || ''
  const toLayout = to.meta.layout || ''
  if (fromLayout && toLayout && fromLayout !== toLayout) {
    const { show } = usePageTransition()
    await show()
  }
})

// 后置守卫：新页面挂载后，再让跨布局过渡淡出。
router.afterEach(async (to, from) => {
  const fromLayout = from.meta.layout || ''
  const toLayout = to.meta.layout || ''
  if (fromLayout && toLayout && fromLayout !== toLayout) {
    const { hide } = usePageTransition()
    await nextTick() // 等待 DOM 更新，确保新页面已经挂载。
    hide(500) // 稍作延迟再淡出，让内容切换更稳定。
  }
})

export default router

