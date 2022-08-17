<template>
  <div class="dashboard-container">
    统计功能还在施工:
    当日销售统计
    当月销售统计
    当年销售统计
    <!-- <component :is="currentRole" /> -->
  </div>
</template>

<script>
// import Boss from './boss'
// import Waiter from './waiter'

export default {
  components: {
    // Boss,
    // Waiter
  },
  data() {
    return {
      currentRole: 'Waiter'
    }
  },
  computed: {
  },
  created() {
    // if (!this.roles.includes('Waiter')) {
    //   this.currentRole = 'Boss'
    // }
  }
}
</script>
