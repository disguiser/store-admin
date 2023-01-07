<template>
  <el-form
    ref="formRef"
    :model="loginForm"
    :rules="rules"
    label-placement="left"
  >
    <el-form-item prop="accountName">
      <el-input
        name="accountName"
        data-test="accountname"
        v-model.trim="loginForm.accountName"
        v-focus
        placeholder="用户名"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-tooltip :visible="capsTooltip" content="大小写锁定已打开" placement="right">
        <el-input
          name="password"
          data-test="password"
          v-model.trim="loginForm.password"
          placeholder="密码"
          :type="passwordType"
          @keyup="checkCapslock"
          @keyup.enter="handleLogin(formRef)"
        >
          <template #append>
            <el-button :icon="passwordType === 'password' ? 'View' : 'Hide'" @click="showPwd">
              <!-- <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" /> -->
            </el-button>
          </template>
        </el-input>
      </el-tooltip>
    </el-form-item>
  </el-form>
  <el-button name="submit" :loading="loading" data-test="login-submit" type="primary" style="width:100%" @click="handleLogin(formRef, $event)">
    登录
  </el-button>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { useUserStore } from '@/store/user'
import { FormInstance, FormRules } from 'element-plus';

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
const formRef = ref<FormInstance | null>(null)
async function handleLogin(formEl: FormInstance | undefined, event: Event) {
  if (event) event.preventDefault()
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(loginForm)
        emit('handleLogin')
      } catch (error: any) {
        console.error(error.message)
      } finally {
        loading.value = false
      }
    } else {
      console.log('error submit!', fields)
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