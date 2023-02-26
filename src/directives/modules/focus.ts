import { Directive } from "vue"

const focus: Directive = {
  mounted(el: HTMLElement) {
    el.querySelector<HTMLInputElement>('.n-input__input-el')?.focus()
    el.querySelector<HTMLInputElement>('.el-input__inner')?.focus()
  }
}
export default focus