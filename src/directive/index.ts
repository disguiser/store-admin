export const focus = {
  mounted(el: any) {
    el.querySelector('.n-input__input-el')?.focus()
    el.querySelector('.el-input__inner')?.focus()
  }
}
