<template>
  <div class="body-div">
    <el-form ref="ruleForm" style="width:400px;" :model="form" :rules="rules">
      <el-form-item label="New Password" prop="newPassword">
        <el-input v-model="form.newPassword" v-trim type="password" />
      </el-form-item>
      <el-form-item label="Confirm new Password" prop="checkPassword">
        <el-input v-model="form.checkPassword" v-trim type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Update</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter the password again'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('The confirm password must match the one above'))
      } else {
        callback()
      }
    }
    return {
      resetMyPwd: null,
      form: {
        newPassword: '',
        checkPassword: '',
        token: ''
      },
      rules: {
        checkPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.$route.query.token) {
      this.resetMyPwd = data => {
        return axios.create({
          baseURL: import.meta.env.VITE_APP_BASE_API,
          headers: {
            'Authorization': 'Bearer ' + this.$route.query.token
          }
        })({
          url: `/reset-my-pwd`,
          method: 'patch',
          data
        })
      }
    } else {
      this.$router.replace('/404')
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let loading = this.$loading()
          try {
            let res = await this.resetMyPwd(this.form)
            if (res.data.result === 'fail') {
              this.$message.error(res.data.message)
            } else {
              this.$message({
                message: 'Your can login with your new password now',
                showClose: true,
                type: 'success'
              })
              this.$router.push('/login')
            }
          } catch (error) {
            console.error(error)
          } finally {
            loading.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
