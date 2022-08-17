<template>
  <div class="page-container">
    <n-grid x-gap="20" cols="3">
      <n-grid-item span="1">
        <user-card />
      </n-grid-item>
      <n-grid-item span="2">
        <n-card title="账号信息">
          <account />
        </n-card>
      </n-grid-item>
    </n-grid>
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
