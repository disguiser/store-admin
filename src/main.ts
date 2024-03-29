import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import router from './router/index'
import '@/router'
app.use(router)

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "@/styles/element-dark.scss";
import 'virtual:svg-icons-register'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
app.use(ElementPlus,  {
  locale: zhCn
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

import SvgIcon from '@/components/SvgIcon.vue'
app.component('SvgIcon', SvgIcon)

// import "@ui5/webcomponents/dist/Input";
// app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ui5-')

import '@/styles/index.scss' // global css

import directives from '@/directives/index'
app.use(directives)

import MyInput from '@/components/MyInput.vue'
app.component('my-input', MyInput)

app.mount('#app')