<template>
  <div class="page-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <user-card />
      </el-col>
      <el-col :span="16">
        <el-card header="账号信息">
          <account />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserCard from './components/UserCard.vue'
import Account from './components/Account.vue'

export default {
  name: 'Profile',
  components: { Account, UserCard },
  data() {
    return {
      activeTab: 'account'
    }
  },
}
</script>
