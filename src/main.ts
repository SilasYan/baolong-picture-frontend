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

//导入所有 Ant Design Vue 图标库
// import * as Icons from '@ant-design/icons-vue'

import '@/access.ts'

// 图片裁切
import VueCropper from 'vue-cropper'
import 'vue-cropper/dist/index.css'

import './global.css'

const app = createApp(App)

app.use(VueCropper)

app.use(pinia)
app.use(router)
app.use(Antd)

// 全局使用图标
// const icons = Icons
// for (const i in icons) {
//   app.component(i, icons[i])
// }

app.mount('#app')
