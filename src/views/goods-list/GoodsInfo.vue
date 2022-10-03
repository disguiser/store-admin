<template>
  <el-dialog
    v-model="dialog"
    :title="title"
    :close-on-click-modal="false"
    width="500px"
    @update:visible="close"
  >
    <el-form ref="formRef" :rules="rules" label-position="right" label-width="100px" :model="temp">
      <el-form-item v-if="title !== '新建'" label="款号" prop="sku">
        <el-input :value="temp.sku" disabled />
      </el-form-item>
      <el-form-item label="厂家款号" prop="preSku">
        <el-input v-model="temp.preSku" />
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="temp.name" :disabled="temp.disabled" />
      </el-form-item>
      <el-form-item label="尺码组" prop="sizeGroup">
        <el-select v-model="temp.sizeGroup">
          <el-option v-for="(item, i) in sizeGroupStore.sizeGroup" :key="i" :label="item.name" :value="item.id!" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="图片" prop="imgUrl">
        <cos-upload :img-url="temp.imgUrl" :disabled="temp.disabled" @handleImgVal="handleImgVal" />
      </el-form-item> -->
      <el-form-item label="售价" prop="salePrice">
        <el-input-number v-model="temp.salePrice" :disabled="temp.disabled" :min="0" :step="10" :precision="1" />
      </el-form-item>
      <el-form-item v-if="useCheckPermission(['Admin', 'Boss'])" label="进价" prop="costPrice">
        <el-input-number v-model="temp.costPrice" :disabled="temp.disabled" :min="0" :step="10" :precision="1" />
      </el-form-item>
      <!-- <el-form-item label="折扣" prop="discount">
        <el-slider v-model="temp.discount" :disabled="temp.disabled" :min="0.1" :max="1" :step="0.05" show-stops show-input />
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">
        取消
      </el-button>
      <el-button type="primary" @click="confirm(formRef!)">
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useCheckPermission } from '@/hooks/useCheckPermission'
import { IGoods } from '@/model/Goods';
import { useSizeGroupStore } from '@/store/sizeGroup'
import { FormInstance, FormRules } from 'element-plus';
import { ref } from 'vue';
const sizeGroupStore = useSizeGroupStore()
const props = withDefaults(
  defineProps<{
    title: string,
    dialog: boolean,
    temp: IGoods
  }>(),
  {
    dialog: false
  }
)
const emits = defineEmits(['update:dialog', 'confirm'])
const rules: FormRules = {
  // sku: [
  //   { required: true, message: '必输项', trigger: 'blur' },
  //   { validator: this.skuRepeat, trigger: 'change' }
  // ],
  name: [{ required: true, message: '必输项', trigger: 'blur' }],
  sizeGroup: [{ required: true, message: '必输项', trigger: 'blur' }],
  preSku: [{ required: true, message: '必输项', trigger: 'blur' }]
}
function handleImgVal(val: string) {
  props.temp.imgUrl = val
}
const formRef = ref<FormInstance | null>(null)
function confirm(formEl: FormInstance | undefined) {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      emits('confirm')
    } else {
      console.log('error submit!', fields)
    }
  })
}
function close() {
  emits('update:dialog', false)
}
</script>
