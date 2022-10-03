<template>
  <el-dropdown trigger="click" @command="handleCommand">
    <el-avatar
      shape="square"
      :src="userStore.avatar"
      style="cursor: pointer"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile/index">
          <el-dropdown-item>账户信息</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided command="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router';
const userStore = useUserStore()
const router = useRouter()

function handleCommand(command: string | number | object) {
  if (command === 'logout') {
    userStore.logout()
  }
}
</script>
