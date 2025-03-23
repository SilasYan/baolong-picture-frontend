import { createApp } from 'vue'
import { createPinia } from 'pinia'
// pinia 持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 自定义配置
import '@/access.ts'

// 图片裁切
import VueCropper from 'vue-cropper'
import 'vue-cropper/dist/index.css'

// 自定义样式
import './global.css'
import './assets/style/scrollbar.css'

const app = createApp(App)

app.use(VueCropper)

app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
