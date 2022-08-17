<template>
  <n-form
    ref="formRef"
    :model="temp"
    status-icon
    :rules="rules"
    label-placement="left"
  >
    <n-form-item label="登录名" path="accountName">
      <my-input v-model="temp.accountName" trim />
    </n-form-item>
    <n-form-item label="旧密码" path="oldPassword">
      <my-input v-model="temp.oldPassword" type="password" trim />
    </n-form-item>
    <n-form-item label="新密码" path="newPassword">
      <my-input v-model="temp.newPassword" type="password" trim />
    </n-form-item>
    <n-form-item label="再次输入" path="newPassword2">
      <my-input v-model="temp.newPassword2" type="password" trim />
    </n-form-item>
    <n-form-item>
      <n-button type="primary" @click="submit">更新</n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { checkUnique } from '@/api/user'
import { useUserStore } from '@/store/user'
import { ref } from 'vue'
import {
  FormRules,
  FormInst,
  FormItemRule,
useMessage
} from 'naive-ui'

type TempType = {
  id: string | undefined,
  userName: string | undefined,
  accountName: string | undefined,
  oldPassword: string | undefined,
  newPassword: string | undefined,
  newPassword2: string | undefined
}
const formRef = ref<FormInst | null>(null)

const temp = ref<TempType>({
  id: undefined,
  userName: undefined,
  accountName: undefined,
  oldPassword: undefined,
  newPassword: undefined,
  newPassword2: undefined
})
const userStore = useUserStore()
temp.value.accountName = userStore.accountName
temp.value.id = userStore.userId
const rules: FormRules = {
  accountName: [{
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error('未填写')
      }
      if (value !== userStore.accountName) {
        checkUnique(value).then(res => {
          if (!res.data) {
            return new Error('用户名已存在')
          }
        })
      }
      return true
    },
    trigger: 'blur'
  }],
  newPassword: [{
    validator: (rule: FormItemRule, value) => {
      if (!value) {
        return new Error('请输入新密码')
      } else {
        if (temp.value.oldPassword) {
          console.log('===')
          formRef.value?.restoreValidation()
        }
        return true
      }
    },
    trigger: 'blur'
  }],
  newPassword2: [{
    validator: (rule: FormItemRule, value) => {
      if (!value) {
        return new Error('请再次输入密码')
      } else if (value !== temp.value.newPassword) {
        return new Error('两次输入密码不一致!')
      } else {
        return true
      }
    },
    trigger: 'blur'
  }],
  oldPassword: [{ required: true, message: '未填写', trigger: 'blur' }]
}
const message = useMessage()
function submit() {
  formRef.value?.validate(async errors => {
    if (!errors) {
      userStore.update(temp)
      temp.value.oldPassword = ''
      temp.value.newPassword = ''
      temp.value.newPassword2 = ''
      message.success('用户信息更新成功!')
    }
  })
}
</script>
