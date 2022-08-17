import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import router from './router/index'
import '@/permission'
app.use(router)

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
app.use(ElementPlus)

import naive from 'naive-ui'
app.use(naive)

import SvgIcon from '@/components/SvgIcon.vue'
app.component('SvgIcon', SvgIcon)

import "@ui5/webcomponents/dist/Input";
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ui5-')

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
app.use(VXETable)

import '@/styles/index.scss' // global css

app.directive('focus', {
  mounted(el) {
    el.querySelector('.n-input__input-el').focus()
  }
})

import MyInput from '@/components/MyInput.vue'
app.component('my-input', MyInput)

app.mount('#app')