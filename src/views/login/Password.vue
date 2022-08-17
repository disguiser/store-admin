<template>
  <n-form
    ref="formRef"
    :model="loginForm"
    :rules="rules"
    label-placement="left"
  >
    <n-form-item path="accountName">
      <my-input
        v-model="loginForm.accountName"
        v-focus
        trim
        placeholder="用户名"
      />
    </n-form-item>
    <n-form-item path="password">
      <n-tooltip :show="capsTooltip" placement="right">
        <template #trigger>
          <my-input
            v-model="loginForm.password"
            trim
            placeholder="密码"
            type="password"
            @keyup="checkCapslock"
            @keyup.enter="handleLogin"
          />
        </template>
        <span>大小写锁定已打开</span>
      </n-tooltip>
    </n-form-item>
  </n-form>
  <n-button type="primary" block strong @click="handleLogin">
    登录
  </n-button>
    <!-- <ui5-button>Hello UI5 Web Components</ui5-button> -->
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { useUserStore } from '@/store/user'
import {
  FormInst,
  FormItemRule,
  useMessage,
  FormRules
} from 'naive-ui'
const message = useMessage()

const userStore = useUserStore()

interface ModelType {
  accountName: string | null
  password: string | null
}

const loginForm = reactive<ModelType>({
  accountName: null,
  password: null,
})

const rules: FormRules = {
  accountName: [{ required: true, trigger: 'blur', message: '请填写用户名' }],
  password: [{ required: true, trigger: 'blur', message: '请填写密码' }]
}

const capsTooltip = ref(false)
const passwordType = ref('password')
const loading = ref(false)

function checkCapslock(e: KeyboardEvent) {
  const { key } = e
  capsTooltip.value = key?.length === 1 && (key >= 'A' && key <= 'Z')
}

function showPwd() {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
  const passwordInput = ref()
  nextTick(() => {
    passwordInput.value.focus()
  })
}

const emit = defineEmits(['handleLogin'])
function handleLogin1() {
  emit('handleLogin')
}
const formRef = ref<FormInst | null>(null)
function handleLogin(e: MouseEvent | KeyboardEvent) {
  e.preventDefault()
  formRef.value?.validate(async errors => {
    if (!errors) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        emit('handleLogin')
      } catch (error) {
        console.error(error.message)
      } finally {
        loading.value = false
      }
    } else {
      console.log(errors)
      // message.error('Invalid')
    }
  })
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
.svg-container {
  padding: 6px 5px 6px 15px;
  color: $dark_gray;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>