import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { replayPendingSync } from '@/services/mock/adapter'

// 全局样式（变量需先于 base 引入）
import './assets/styles/variables.css'
import './assets/styles/base.css'

createApp(App).use(router).mount('#app')

// 启动时重放待同步队列（离线写入 → 联网后恢复同步：LocalStorage → 接口）
replayPendingSync()
