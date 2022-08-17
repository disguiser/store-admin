<template>
  <div class="login-container">
    <n-card class="login-form">
      <div class="title-container">
        <h3 class="title">益谦服饰</h3>
      </div>
      <n-tabs
        :default-value="activeName"
        size="large"
        justify-content="space-evenly"
        animated
      >
        <n-tab-pane tab="密码登陆" name="pwdForm">
          <password @handle-login="handleLogin"/>
        </n-tab-pane>
        <!-- <el-tab-pane label="扫码登录" name="QRCode">
          <div style="text-align:center"><canvas id="canvas" /></div>
        </el-tab-pane>
        <el-tab-pane label="短信登陆" name="phoneForm">
          <el-form ref="phoneForm" :model="loginForm" :rules="phoneRules" autocomplete="on" label-position="left">
            <el-tooltip v-model="capsTooltip" content="键盘大小写已开启" placement="right" manual>
              <el-form-item prop="phoneNumber">
                <span class="svg-container">
                  <i class="el-icon-phone" />
                </span>
                <el-input
                  v-model="loginForm.phoneNumber"
                  placeholder="手机号"
                  tabindex="2"
                />
                <span v-if="countDown === 0" class="show-pwd" @click="getPhoneCode">点击获取验证码</span>
                <span v-else class="show-pwd">{{ countDown }}</span>
              </el-form-item>
            </el-tooltip>
            <el-form-item prop="phoneCode">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="phoneCode"
                v-model="loginForm.phoneCode"
                placeholder="验证码"
                type="text"
                tabindex="1"
              />
            </el-form-item>
          </el-form>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">提交</el-button>
        </el-tab-pane> -->
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup name="Login" lang="ts">
// import { sendPhoneCode } from '@/api/user'
// import { v4 as uuid } from 'uuid'
// import QRCode from 'qrcode'
import { useVersionStore } from '@/store/version'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import Password from './Password.vue'

const router = useRouter()

const versionStore = useVersionStore()

const activeName = ref('pwdForm')

async function handleLogin() {
  await versionStore.checkVersion()
  router.push({ path: '/dashboard' })
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #ccc;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .login-form {
    width: 520px;
    max-width: 100%;
    padding: 35px;
    overflow: hidden;
    background: #fff;
    border-radius: 10px;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
