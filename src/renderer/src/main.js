import { createApp } from 'vue'
import '@/assets/cust-elementplus.scss'
import '@/assets/base.scss'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from '@/router'
import '@/assets/icon/icon/iconfont.css'
import '@/assets/icon/MEET/iconfont.css'
import '@/assets/icon/MEET/iconfont.js'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.mount('#app')
