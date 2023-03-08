<template>
  <el-dropdown data-test="account-btn" trigger="click" @command="handleCommand">
    <el-avatar
      shape="square"
      :src="userStore.avatar"
      style="cursor: pointer"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile">
          <el-dropdown-item>账户信息</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided command="logout">
          <a data-test="logout">退出</a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
const userStore = useUserStore()

function handleCommand(command: string | number | object) {
  if (command === 'logout') {
    userStore.logout()
  }
}
</script>
