import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  filters: {
    timeFilter(time) {
      return dayjs(time).format('YYYY-MM-DD hh:mm')
    }
  },
  computed: {
    ...mapGetters([
      'userName',
      'sizeObj',
      'colorObj'
    ])
  },
  data() {
    return {
      list: [],
      loading: true,
      order: null
    }
  },
  created() {
    let order = localStorage.getItem('order')
    if (!order) {
      window.close()
      return
    }
    this.order = JSON.parse(order)
    this.dealData()
  },
  methods: {
    print() {
      this.$refs.main.classList.add('print')
      this.$nextTick(() => {
        window.print()
        this.$refs.main.classList.remove('print')
      })
    }
  }
}
