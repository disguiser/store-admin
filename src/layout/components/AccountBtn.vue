<template>
  <n-dropdown trigger="click" :options="options">
    <n-avatar
      round
      src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
      style="cursor: pointer"
    />
    <!-- <template #dropdown>
      <el-dropdown-menu>
        <router-link to="/profile/index">
          <el-dropdown-item>用户信息</el-dropdown-item>
        </router-link>
        <router-link to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template> -->
  </n-dropdown>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { NButton, NText } from 'naive-ui';
import { h } from 'vue';
import { useRouter } from 'vue-router';
const userStore = useUserStore()
const router = useRouter()

const options = [
  {
    label: '账户信息',
    key: 'profile',
    props: {
      onclick: () => {
        router.push('/profile')
      }
    }
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出',
    key: 'logout',
    props: {
      onclick: () => {
        logout()
      }
    }
  }
]
async function logout() {
  userStore.logout()
  router.push(`/login`)
}
</script>
