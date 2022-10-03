<template>
  <el-card header="关于我" style="margin-bottom:20px;">
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="userStore.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <a style="font-size:15px" @click="show = true">上传头像</a>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ userStore.userName }}</div>
        <div class="user-role text-center text-muted">{{ userStore.roles }}</div>
      </div>
      <avatar-upload
        v-model="show"
        field="file"
        :width="300"
        :height="300"
        :url="url"
        :headers="headers"
        img-format="png"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
      />
    </div>
  </el-card>
</template>

<script setup>
import PanThumb from '@/components/PanThumb/index.vue'
import AvatarUpload from 'vue-image-crop-upload'
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const show = ref(false)
const url = `${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_BASE_API}/file/upload/avatar`
const headers = {
  Authorization: 'Bearer ' + userStore.token
}

async function cropUploadSuccess(jsonData, field) {
  ElMessage.success('上传成功')
  await userStore.setAvatar(jsonData.result)
  show.value = false
}
function cropUploadFail(status, field) {
  ElMessage.error('上传失败')
  console.log(status)
  console.log('field: ' + field)
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
