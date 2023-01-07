<template>
  <img ref="barcode" style="pointer-events:none" />
</template>

<script setup>
import JsBarcode from 'jsbarcode'
import { watch, ref, onMounted } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  scale: {
    type: Number,
    default: 5
  }
})

watch(props, () => {
  generate()
})
onMounted(() => {
  generate()
})
const barcode = ref()
function generate() {
  JsBarcode(barcode.value, props.value, {
    height: props.height * props.scale,
    displayValue: true,
    width: 0.3 * props.scale,
    margin: 0
  })
}
</script>

<style lang="scss" scoped>
</style>
