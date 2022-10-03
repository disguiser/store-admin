<template>
  <div class="main">
    create
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener('paste', this.paste)
  },
  beforeDestroy() {
    window.removeEventListener('paste', this.paste)
  },
  methods: {
    paste(e) {
      let text = e.clipboardData.getData('text')
      console.log(text)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: grid;

}
</style>
