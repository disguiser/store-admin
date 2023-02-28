<template>
  <div class="main el-card">
    <div class="goods">
      <div>款号：{{ currentGoods.sku }}</div>
      <div>商品名称：{{ currentGoods.name }}</div>
      <div>颜色：{{ currentColorList.map(e => colorMap.get(e)).join('，') }}</div>
      <div>尺码：{{ currentSizeList.map(e => sizeMap.get(e)).join('，') }}</div>
    </div>
    <div class="page-container">
      <div class="left">
        <tag
          :list="currentTemplate.data"
          :width="currentTemplate.width"
          :height="currentTemplate.height"
          :scale="scale"
          editable
          @choose="choose"
        />
        <template v-if="temp">
          <div>x: {{ temp.x }}</div>
          <div>y: {{ temp.y }}</div>
        </template>
      </div>
      <div class="right">
        <fieldset>
          <legend>打印机操作</legend>
          <el-button :loading="btnLoading" type="primary" :disabled="disabled" @click="print">打印</el-button>
          <el-select v-model="printer" placeholder="选择打印机" @change="printerSwitch" style="width:120px">
            <el-option value="argox" label="Argox"></el-option>
            <el-option value="tsc" label="TSC"></el-option>
          </el-select>
          <div class="item">
            <div class="label">打印份数</div>
            <el-input-number v-model="copy" :min="1" size="small" style="width:100px" />
          </div>
          <div class="item">
            <div class="label">打印机状态</div>
            <el-input :value="status" disabled style="width: 150px;"></el-input>
          </div>
        </fieldset>
        <fieldset>
          <legend>模板设置</legend>
          <el-button :loading="btnLoading" type="success" @click="save">模版保存</el-button>
          <div class="item">
            <div class="label">放大倍数</div>
            <el-input-number v-model="scale" :min="1" size="small" style="width:100px" />
          </div>
          <div class="item">
            <div class="label">高度</div>
            <el-input-number v-model="currentTemplate.height" size="small" style="width:100px" />
          </div>
          <div class="item">
            <div class="label">宽度</div>
            <el-input-number v-model="currentTemplate.width" size="small" style="width:100px" />
          </div>
          <div class="item">
            <div class="label">模版名称</div>
            <el-input v-model="currentTemplate.name" style="width:150px" />
          </div>
        </fieldset>
        <el-form
          ref="formRef"
          label-position="right"
          label-width="100px"
          :model="temp"
        >
          <template v-if="temp && temp.type !== 'barcode'">
            <!-- <el-form-item
              v-if="temp.type === 'text'"
              label="类型"
              prop="label"
            >
              <el-select v-model="temp.label">
                <el-option value="" label="" />
                <el-option value="尺码" label="尺码" />
                <el-option value="品名" label="品名" />
                <el-option value="等级" label="等级" />
                <el-option value="颜色" label="颜色" />
                <el-option value="执行标准" label="执行标准" />
                <el-option value="安全类别" label="安全类别" />
              </el-select>
            </el-form-item> -->
            <template v-if="temp.type === 'material'">
              <el-form-item :label="temp.lable" prop="value">
                <div>
                  <el-button icon="Plus" @click="addFabric" style="margin-bottom: 10px" />
                </div>
                <div v-for="(v, vi) in temp.value" :key="vi" class="fabric">
                  <el-select v-model="v.type">
                    <el-option v-for="(e, i) in fabricList" :key="i" :value="e.itemName" :label="e.itemName" />
                  </el-select>
                  <el-input v-model="v.percent">
                    <template #append>%</template>
                  </el-input>
                  <el-button icon="Delete" type="danger" @click="removeFabric(vi)" />
                </div>
              </el-form-item>
            </template>
            <el-form-item
              v-else-if="!['款号', '品名'].includes(temp.label)"
              label="内容"
              prop="value"
              :rules="[
                { required: true, message: '必输项', trigger: 'change' }
              ]"
            >
              <el-select
                v-if="temp.label === '尺码'"
                v-model="barcode.size"
                @change="colorSizeChange($event, 'size')"
              >
                <el-option
                  v-for="(e, i) in currentSizeList"
                  :key="i"
                  :value="e"
                  :label="sizeMap.get(e)"
                />
              </el-select>
              <el-select
                v-else-if="temp.label === '颜色'"
                v-model="barcode.color"
                @change="colorSizeChange($event, 'color')"
              >
                <el-option
                  v-for="(c, ci) in currentColorList"
                  :key="ci"
                  :value="c"
                  :label="colorMap.get(c)"
                />
              </el-select>
              <el-select
                v-else-if="temp.label === '等级'"
                v-model="temp.value"
                filterable
                allow-create
                default-first-option
              >
                <el-option
                  v-for="(c, ci) in levelList"
                  :key="ci"
                  :label="c.itemName"
                  :value="c.itemName"
                />
              </el-select>
              <el-input v-else v-model="temp.value" @change="valueChange(formRef)" />
            </el-form-item>
            <el-form-item
              label="字体大小"
              prop="fontheight"
              :rules="[
                { required: true, message: '必输项', trigger: 'change' }
              ]"
            >
              <el-input-number v-model="temp.fontheight" :min="2" :step="0.1" />
            </el-form-item>
          </template>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tag from './Tag.js'
import _ from 'lodash'
import { print as printApi } from '@/api/printTemplate'
import { computed, reactive, ref } from 'vue';
import { useGoodsStore } from '@/store/goods';
import { useSizeGroupStore } from '@/store/sizeGroup';
import { useDictStore } from '@/store/dict';
import { usePrintTemplateStore } from '@/store/printTemplate';
import { IStock } from '@/model/Stock';
import { ElMessage, FormInstance } from 'element-plus';

const formRef = ref<FormInstance>()
const printer = ref(localStorage.getItem('printer'))
const status = ref('')
let ws: WebSocket
const temp = ref()
const tempIndex = ref<number>()
const btnLoading = ref(false)
const copy = ref(1)
const scale = ref(5)
const barcode = reactive<{
  size: number,
  color: number,
  data: any
}>({
  size: null,
  color: null,
  data: null
})
const { currentGoods } = useGoodsStore()
// 'sizeGroup', 'sizeGroupObj',
const { sizeGroupList, sizeGroupMap } = useSizeGroupStore()
// dictObj sizes
const { dictMap, sizeList, sizeMap, colorMap, colorList, fabricList, levelList } = useDictStore()
const templateStore = usePrintTemplateStore()
const { currentTemplate } = templateStore
const currentColorList = computed<number[]>(() => {
  return Array.from(currentGoods.stock.reduce((a: Set<number>, b: IStock) => {
    a.add(b.color)
    return a
  }, new Set()))
})

const currentSizeList = computed<number[]>(() => {
  return Array.from(currentGoods.stock.reduce((a: Set<number>, b: IStock) => {
    a.add(b.size)
    return a
  }, new Set()))
})

const disabled = computed(() => {
  if (
      !printer.value ||
      (printer.value === 'argox' && status.value !== '等待列印')
    ) {
      return true
    } else if (barcode.data.value === 'XXX') {
      return true
    } else {
      return false
    }
})
applyData()
function colorSizeChange(val: number, type: string) {
  if (type === 'size') {
    temp.value.value = sizeMap.get(val)
  } else {
    temp.value.value = colorMap.get(val)
  }
  if (barcode.color && barcode.size) {
    barcode.data.value = `${currentGoods.sku}${_.padStart(barcode.color.toString(), 2, '0')}${_.padStart(barcode.size.toString(), 2, '0')}`
  }
}
function applyData() {
  currentTemplate.data.map((e: any) => {
    if (e.label === '品名') {
      e.value = currentGoods.name
    } else if (e.label === '款号') {
      e.value = currentGoods.preSku
    } else if (e.label === '售价') {
      e.value = `￥${currentGoods.salePrice}.00`
    }
    if (e.type === 'barcode') {
      e.value = 'XXX'
      barcode.data = e
    }
  })
}
async function print() {
  let valid = currentTemplate.data.every((e: any) => e.value)
  if (valid) {
    btnLoading.value = true
    let list: any[] = []
    currentTemplate.data.map((e: any) => {
      let _e = _.cloneDeep(e)
      if (e.type === 'material') {
        let first = _e.value.splice(0, 1)
        first = _e.label + '：' + first[0].type + (first[0].percent ? '：' + first[0].percent + '%' : '')
        _e.value.map((v: any, vi: number) => {
          list.push({
            x: _e.x + _e.fontheight * 3,
            y: _e.fontheight * (vi + 1) + _e.y,
            type: 'text',
            label: '',
            value: v.type + (v.percent ? '：' + v.percent + '%' : ''),
            fontstyle: 'Normal',
            fontheight: _e.fontheight
          })
        })
        _e.value = first
        list.push(_e)
      } else {
        if (_e.label) {
          _e.value = _e.label + '：' + _e.value
        }
        list.push(_e)
      }
    })
    // console.log(JSON.stringify({ list, copy: this.copy }))
    console.log(JSON.stringify({ list, copy: copy.value }))
    if (printer.value === 'argox') {
      await argoxPrint({ list, copy: copy.value })
    } else {
      // let temp = list.filter(e => e.type === 'barcode')
      // temp[0].y = 0
      // await this.tscPrint({ list: temp, copy: this.copy })
      await tscPrint({ list, copy: copy.value, height: currentTemplate.height, width: currentTemplate.width })
    }
    localStorage.setItem('printer', printer.value)
    btnLoading.value = false
  } else {
    ElMessage({
      type: 'error',
      message: '内容不全'
    })
  }
}
function printerSwitch(val: string) {
  if (val === 'argox') {
    if (!ws) {
      connection()
    } else {
      getStatus()
    }
  }
}
function getStatus() {
  console.log('获取状态')
  ws.send('B_EnumUSB')
  ws.send('B_CreateUSBPort|1')
  ws.send('B_GetPrinterStatus')
  ws.send('B_ClosePrn')
}
function connection() {
  ws = new WebSocket('ws://localhost:2012')
  // 注册各类回调
  ws.onopen = () => {
    console.log('连接打印后台成功')
    getStatus()
  }

  ws.onclose = () => {
    console.log('与打印后台断开连接')
  }
  ws.onerror = () => {
    console.log('数据传输发生错误')
  }
  ws.onmessage = receiveMsg => {
    if (receiveMsg.data.split('|')[0] === 'B_GetPrinterStatus') {
      console.log(receiveMsg)
      const ret = receiveMsg.data.split('|')[1]
      switch (ret) {
        case '0':
          status.value = '等待列印'
          break
        case '1':
          status.value = '打印命令错误'
          break
        case '2':
          status.value = 'USB端口开启失败'
          break
        case '3':
          status.value = '条码格式错误'
          break
        case '4':
          status.value = '内存溢出或碳带用完或安装错误'
          break
        case '6':
          status.value = '串口通信异常'
          break
        case '7':
          status.value = '纸张/碳带用完'
          break
        case '9':
          status.value = '未取得返回值'
          break
        case '12':
          status.value = '打印机暂停'
          break
        case '50':
          status.value = '打印机忙碌'
          break
        default:
          status.value = '未知错误'
          break
      }
    }
  }
}
async function argoxPrint(data: any) {
  if (status.value === '等待列印') {
    let scale = 12
    ws.send('B_EnumUSB')
    ws.send('B_CreateUSBPort|1')
    ws.send('B_Set_Direction|B')
    data.list.forEach((item: any, i: number) => {
      if (item.type === 'text') {
        // console.log(`B_Prn_Text_TrueType|${Math.round(item.x*scale)}|${Math.round(item.y*scale)}|${Math.round(item.fontheight*scale)}|黑体|1|400|0|0|0|${i}|${item.value}`)
        ws.send(`B_Prn_Text_TrueType|${Math.round(item.x * scale)}|${Math.round(item.y * scale)}|${Math.round(item.fontheight * scale)}|黑体|1|400|0|0|0|${i}|${item.value}`)
      } else if (item.type === 'barcode') {
        // console.log(`B_Prn_Barcode|${Math.round(item.x*scale)}|${Math.round(item.y*scale)}|0|1E|2|6|${Math.round(item.height*scale)}|B|${item.value}`)
        ws.send(`B_Prn_Barcode|${Math.round(item.x * scale)}|${Math.round(item.y * scale)}|0|1E|2|6|${Math.round(item.height * scale)}|B|${item.value}`)
      }
    })
    ws.send(`B_Print_Out|${data.copy}`)
    ws.send('B_ClosePrn')
  }
}
async function tscPrint(data: any) {
  try {
    // let res = await this.$ipcApi.send("print", { list, copy: this.copy })
    let res = await printApi(data)
    console.log(res.data)
    if (res.data) {
      ElMessage({
        type: 'success',
        message: res.data
      })
    }
  } catch (error) {
    console.error(error)
  }
}
function choose({ item, index }: any) {
  temp.value = item
  tempIndex.value = index
}
async function save() {
  try {
    btnLoading.value = true
    templateStore.update(currentTemplate)
    ElMessage({
      type: 'success',
      message: '保存成功'
    })
  } catch (error) {
    console.error(error)
  } finally {
    btnLoading.value = false
  }
}
function addFabric() {
  temp.value.value.push({
    type: '',
    percent: 0
  })
}
function removeFabric(vi: number) {
  temp.value.value.splice(vi, 1)
}
function valueChange(formEl: FormInstance) {
  formEl.validate((valid) => {
    if (valid) {
      if (temp.value.label === '货号') {
        let barcode = currentTemplate.data.filter((e: any) => e.type === 'barcode')
        barcode[0].value = temp.value
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  display: flex;
  overflow: hidden;
  .right {
    flex: 1;
    padding: 20px;
    > * {
      padding: 10px;
      margin-bottom: 20px;
    }
  }
}
.fabric {
  display: flex;
  margin-bottom: 10px;
  > * {
    margin-right: 10px;
  }
}
.goods {
  padding: 20px;
  display: grid;
  grid-template-columns: 200px 300px 1fr 1fr;
  box-shadow: 0px 6px 18px 0 rgb(51 51 51 / 8%);
}
.item {
  display: inline-block;
  white-space: nowrap;
  margin: 10px 10px 0 0;
  .label {
    display: inline;
    font-weight: bold;
  }
}
</style>
