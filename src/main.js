import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 全局样式（变量需先于 base 引入）
import './assets/styles/variables.css'
import './assets/styles/base.css'

createApp(App).use(router).mount('#app')
