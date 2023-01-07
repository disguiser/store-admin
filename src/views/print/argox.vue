<template>
  <div style="padding: 20px">
    <div>
      <el-button @click="connection">连线</el-button>
      <el-button :disabled="!ws" @click="getStatus">获取状态</el-button>
      <el-button :disabled="status !== '等待列印'" @click="print">打印</el-button>
      <el-input :value="status" disabled style="width: 300px;margin-left:10px" />
    </div>
    <el-input v-model="myCommand" type="textarea" :rows="6" style="margin-top:20px" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const wsUrl = 'ws://localhost:2012';//打印后台地址与
const ws = ref<WebSocket>()
const status = ref('')
const myCommand = ref('')
function connection() {
  ws.value = new WebSocket(wsUrl)
  //注册各类回调
  ws.value.onopen = () => {
    console.log('连接打印后台成功')
    getStatus()
  }

  ws.value.onclose = () => {
    console.log('与打印后台断开连接')
  }
  ws.value.onerror = () => {
    console.log('数据传输发生错误')
  }
  ws.value.onmessage = receiveMsg => {
    if (receiveMsg.data.split("|")[0] == "B_GetPrinterStatus") {
      console.log(receiveMsg)
      const ret = receiveMsg.data.split("|")[1]
      switch(ret) {
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
function sendMessage() {
  ws.value.send('B_EnumUSB')
  ws.value.send('B_CreateUSBPort|1')
  ws.value.send('B_Set_Direction|B')
  ws.value.send('B_Prn_Barcode|50|210|0|1E|2|6|50|B|20210703')
  ws.value.send('B_Prn_Text_TrueType|50|330|35|宋体|1|600|0|0|0|CC|固定资产标签')
  ws.value.send('B_Print_Out|1')
  ws.value.send('B_ClosePrn')
}
function print() {
  ws.value.send('B_EnumUSB')
  ws.value.send('B_CreateUSBPort|1')
  myCommand.value.split('\n').map(e => {
    ws.value.send(e)
  })
  ws.value.send('B_ClosePrn')
}
function getStatus() {
  ws.value.send('B_EnumUSB')
  ws.value.send('B_CreateUSBPort|1')
  ws.value.send('B_GetPrinterStatus')
  ws.value.send('B_ClosePrn')
}
</script>

<style lang="scss" scoped>

</style>
