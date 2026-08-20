import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * 路由配置。
 * 当前为单页应用，仅一个主视图 HomeView；使用 hash 模式，便于静态部署后刷新不 404。
 * 后续若拆分页面（如独立统计页），在此追加路由即可。
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  // 兜底：未匹配路由重定向回首页
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
