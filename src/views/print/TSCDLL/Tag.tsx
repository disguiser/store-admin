import { CSSProperties, defineComponent, onMounted, ref } from 'vue'
import Barcode from './Barcode.vue'
import styles from './tag.module.scss'

export default defineComponent({
  props: {
    list: {
      type: Array,
      required: true
    },
    scale: {
      type: Number,
      default: 5
    },
    editable: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  emits: ['choose'],
  setup(props, context) {
    const highlightIndex = ref(-1)
    const currentX = ref(0)
    const currentY = ref(0)
    const currentTop = ref(0)
    const currentLeft = ref(0)
    const top = ref(0)
    const left = ref(0)
    const current = ref<Record<string, any>>()
    const currentDom = ref<EventTarget>()
    const moveFlag = ref(false)
    onMounted(() => {
      if (props.editable) {
        document.onmouseup = () => {
          if (moveFlag.value) {
            moveFlag.value = false
            current.value.x = left.value / props.scale
            current.value.y = top.value / props.scale
          }
        }
        document.onmousemove = e => {
          if (moveFlag.value) {
            const nowX = e.clientX
            const nowY = e.clientY
            const disX = nowX - currentX.value
            const disY = nowY - currentY.value
            left.value = currentLeft.value + disX
            top.value = currentTop.value + disY
            if (left.value < 0) {
              left.value = 0
            }
            if (top.value < 0) {
              top.value = 0
            }
            (currentDom.value as HTMLElement).style.left = left.value + 'px';
            (currentDom.value as HTMLElement).style.top = top.value + 'px';
          }
        }
      }
    })
    function choose(item: Record<string, any>, index: number) {
      highlightIndex.value = index
      context.emit('choose', { item, index })
    }
    return () => (
      <div
        class={styles['tag']}
        style={{
          width: props.width * props.scale + 'px',
          height: props.height * props.scale + 'px'
        }}
      >
        {
          props.list.map((item: Record<string, any>, i: number) => {
            const initLeft = item.x * props.scale
            const initTop = item.y * props.scale
            const _class = styles['item'] + (highlightIndex.value === i ? ' ' + styles['highlight'] : '')
            const style: CSSProperties = {
              cursor: props.editable ? 'pointer' : '',
              left: initLeft + 'px',
              top: initTop + 'px',
              fontSize: item.fontheight * props.scale + 'px',
              fontWeight: item.fontstyle === 'Bold' ? 'bolder' : 'lighter'
            }
            const onMousedown = (e: MouseEvent) => {
              currentX.value = e.clientX
              currentY.value = e.clientY
              currentTop.value = item.y * props.scale
              currentLeft.value = item.x * props.scale
              left.value = initLeft
              top.value = initTop
              current.value = item
              currentDom.value = e.target
              moveFlag.value = true
              choose(item, i)
            }

            let itemContent
            if (item.type === 'text') {
              itemContent = item.label + '：' + item.value
            } else if (item.type === 'title') {
              itemContent = item.value
            } else if (item.type === 'material') {
              itemContent = item.value.map((v: any, vi: number) => {
                return (
                  <div
                    style={{
                      fontSize: item.fontheight * props.scale + 'px'
                    }}
                    innerHTML={`${vi === 0 ? `${item.label}：` : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}${v.type}${v.percent}%`}
                  />
                )
              })
            } else if (item.type === 'barcode') {
              itemContent = <Barcode value={item.value} height={item.height} scale={props.scale} />
            }

            return (
              <div
                class={_class}
                style={style}
                onMousedown={onMousedown}
              >
                {itemContent}
              </div>
            )
          })
        }
      </div>
    )
    // return () => (
    //   <>
    //     <div>1</div>
    //     <div>2</div>
    //   </>
    // )
  }
})
