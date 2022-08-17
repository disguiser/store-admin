<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="!singleSelect" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table
      :key="key"
      v-loading="listLoading"
      :data="list"
      border
      fit
      style="width: 100%;"
      :highlight-current-row="singleSelect"
      @current-change="handleSingleSelect"
    >
      <el-table-column label="门店" prop="name" align="center" min-width="200">
        <template slot-scope="{row}">
          <el-input v-if="row.edit" v-model="temp.name" class="edit-input" size="small" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!singleSelect" label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <template v-if="row.edit">
            <el-link type="success" @click="confirmEdit(row)">确认</el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" @click="cancelEdit(row)">取消</el-link>
          </template>
          <template v-else>
            <el-link type="primary" @click="showDetail(row)">明细</el-link>
            <el-divider direction="vertical" />
            <el-link type="warning" @click="handleEdit(row)">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" @click="handleRemove(row, $index)">删除</el-link>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findAll, create, update, remove } from '@/api/dept'
import Selectable from '@/mixins/Selectable'
import { mapGetters } from 'vuex'

export default {
  mixins: [Selectable],
  props: {
    singleSelect: {
      type: Boolean,
      default: false
    },
    multiSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      key: 0,
      listLoading: false,
      temp: null
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'deptId'
    ])
  },
  created() {
    if (this.roles.includes('Waiter') && this.$route.path === '/stock/dept') {
      this.$router.replace(`/stock/goods/${this.deptId}`)
    } else {
      this.getList()
    }
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        let res = await findAll()
        this.list = res.data
      } catch (error) {
        this.$message.error(error)
      } finally {
        this.listLoading = false
      }
    },
    handleCreate() {
      let row = {
        name: '',
        edit: true
      }
      this.temp = Object.assign({}, row)
      this.list.unshift(row)
    },
    cancelEdit(row) {
      if (row.name === '') {
        this.list.shift()
      } else {
        this.$set(row, 'edit', false)
      }
    },
    handleEdit(row) {
      this.$set(row, 'edit', true)
      this.temp = Object.assign({}, row)
    },
    async confirmEdit(row) {
      if (this.temp.name) {
        let loading = this.$loading()
        let func, message
        if (row.id) {
          func = update(this.temp)
          message = 'Update success'
        } else {
          func = new Promise((resolve, reject) => {
            create(this.temp).then(res => {
              row.id = res.data
              resolve()
            }).catch(err => {
              reject(err)
            })
          })
          message = 'Create success'
        }
        try {
          await func
          row.name = this.temp.name
          row.edit = false
          this.$notify({
            title: 'Success',
            message,
            type: 'success',
            duration: 2000
          })
        } catch (error) {
          console.error(error)
        } finally {
          loading.close()
        }
      }
    },
    async handleRemove(row, index) {
      let loading = this.$loading()
      try {
        await remove(row.id)
        this.list.splice(index, 1)
        this.$notify({
          title: 'Success',
          message: 'Delete success',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error(error)
      } finally {
        loading.close()
      }
    },
    showDetail(row) {
      this.$router.push(`/stock/goods/${row.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
