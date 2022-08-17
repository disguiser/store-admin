<template>
  <n-input
    :value="props.modelValue"
    :type="props.type"
    :placeholder="props.placeholder"
    @update-value="handleUpdateValue"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
// const props = defineProps({
//   modelValue: String,
//   number: Boolean,
//   trim: Boolean,
//   placeholder: String,
//   type: {
//     type: String as () => "textarea" | "text" | "password",
//     default: 'text'
//   }
// })
interface IProps {
  modelValue: string
  number?: boolean
  trim?: boolean
  placeholder?: string
  type?: "textarea" | "text" | "password"
}
const props = withDefaults(defineProps<IProps>(), {
  type: 'text'
})
const emit = defineEmits(['update:modelValue'])
function handleUpdateValue (v: string) {
  if (props.number && v !== '') {
    if (/^\d+$/.test(v)) {
      emit('update:modelValue', v)
    }
    return
  }
  emit('update:modelValue', v)
}
function handleChange(v: string) {
  if (props.trim) {
    emit('update:modelValue', v.trim())
  }
}
</script>
