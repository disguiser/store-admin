<template>
  <el-form
    v-loading="loading"
    ref="formRef"
    :model="temp"
    :rules="rules"
    label-placement="left"
  >
    <el-form-item label="登录名" prop="accountName">
      <my-input v-model="temp.accountName" trim />
    </el-form-item>
    <el-form-item label="旧密码" prop="oldPassword">
      <my-input v-model="temp.oldPassword" type="password" trim />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <my-input v-model="temp.newPassword" type="password" trim />
    </el-form-item>
    <el-form-item label="再次输入" prop="newPassword2">
      <my-input v-model="temp.newPassword2" type="password" trim />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit()">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { checkUnique } from '@/api/user'
import { useUserStore } from '@/store/user'
import { ref } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { AccountInfo } from '@/model/User'

const formRef = ref<FormInstance>()

const temp = ref<AccountInfo>({
  id: undefined,
  userName: undefined,
  accountName: undefined,
  oldPassword: undefined,
  newPassword: undefined,
  newPassword2: undefined
})

const loading = ref(false)
const userStore = useUserStore()
temp.value.accountName = userStore.accountName
temp.value.id = userStore.userId
const rules: FormRules = {
  accountName: [{
    validator: (rule: any, value: string, callback: any) => {
      if (!value) {
        callback(new Error('未填写'))
      }
      if (value !== userStore.accountName) {
        checkUnique(value).then(res => {
          if (!res.data) {
            callback(new Error('用户名已存在'))
          }
        })
      }
      callback()
    },
    trigger: 'blur'
  }],
  newPassword: [{
    validator: (rule: any, value, callback: any) => {
      if (!value) {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }],
  newPassword2: [{
    validator: (rule: any, value, callback: any) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== temp.value.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    trigger: 'blur'
  }],
  oldPassword: [{ required: true, message: '未填写', trigger: 'blur' }]
}
async function submit() {
  console.log(formRef)
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.update(temp.value)
        temp.value.oldPassword = ''
        temp.value.newPassword = ''
        temp.value.newPassword2 = ''
        ElMessage.success('用户信息更新成功!')
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
