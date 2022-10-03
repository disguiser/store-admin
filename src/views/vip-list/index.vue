<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" clearable placeholder="手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      @sort-change="sortChange"
    >
      <el-table-column label="姓名" prop="name" align="center" />
      <el-table-column label="手机号码" prop="phone" align="center" width="110" />
      <el-table-column label="生日" prop="birthday" align="center" width="100" />
      <el-table-column label="当前余额" prop="balance" align="center" />
      <el-table-column label="生日折扣(%)" prop="birthDiscount" align="center" width="80" />
      <el-table-column label="终身折扣(%)" prop="vipDiscount" align="center" width="80" />
      <el-table-column label="注册时间" prop="createTime" align="center" width="140">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleRemove(row, $index)">
            删除
          </el-button>
          <el-button size="mini" @click="handleShowCharge(row)">
            充值
          </el-button>
          <el-button size="mini" @click="handleShowConsume(row)">
            消费
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="infoDialogVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" label-position="right" label-width="100px" :model="temp">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" v-focus />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="temp.birthday" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="生日折扣(%)" prop="birthDiscount">
          <el-slider v-model="temp.birthDiscount" :step="5" show-stops show-input />
        </el-form-item>
        <el-form-item label="终身折扣(%)" prop="vipDiscount">
          <el-slider v-model="temp.vipDiscount" :step="5" show-stops show-input />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoDialogVisible = false">
          取消
        </el-button>
        <template v-if="dialogStatus==='create'">
          <el-button type="primary" :loading="btnLoading" @click="createData()">
            确认
          </el-button>
        </template>
        <template v-else>
          <el-button type="primary" :loading="btnLoading" @click="updateData()">
            确认
          </el-button>
        </template>
      </div>
    </el-dialog>

    <el-dialog title="充值详情" :visible.sync="chargeDialogVisible" :close-on-click-modal="false">
      <charge-record-list v-if="chargeDialogVisible" :vip-id="currentVipId" @refresh="refresh" />
    </el-dialog>

    <el-dialog title="消费详情" :visible.sync="consumeDialogVisible" :close-on-click-modal="false">
      <consume-record-list v-if="consumeDialogVisible" :vip-id="currentVipId" @refresh="refresh" />
    </el-dialog>
  </div>
</template>

<script>
import { findByPage, update, create, remove } from '@/api/vip'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { mapGetters } from 'vuex'
import ChargeRecordList from '@/views/charge-record-list'
import ConsumeRecordList from '@/views/consume-record-list'
// import { parseTime } from '@/utils'

export default {
  name: 'VipList',
  components: { Pagination, ChargeRecordList, ConsumeRecordList },
  directives: { focus },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Enabled: 'success',
        Disabled: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      key: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        phone: undefined,
        sort: undefined
      },
      temp: null,
      infoDialogVisible: false,
      chargeDialogVisible: false,
      consumeDialogVisible: false,
      currentVipId: '',
      btnLoading: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      rules: {
        name: [{ required: true, message: '必输项', trigger: 'blur' }],
        phone: [
          { required: true, message: '必输项', trigger: 'blur' },
          { type: 'string', pattern: /^(13[0-9]|14[5-9]|15[0-3,5-9]|16[2,5,6,7]|17[0-8]|18[0-9]|19[1,3,5,8,9])\d{8}$/, message: '格式错误', trigger: 'blur' }
        ],
        birthday: [{ required: true, message: '必输项', trigger: 'blur' }],
        birthDiscount: [{ required: true, message: '必输项', trigger: 'blur' }],
        vipDiscount: [{ required: true, message: '必输项', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {
    this.resetTemp()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      findByPage(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    refresh() {
      this.getList()
    },
    handleModifyStatus(row, status) {
      let _row = Object.assign({}, row)
      // let _row = _.cloneDeep(row)
      _row.status = status
      update(_row).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (order === 'ascending') {
        this.listQuery.sort = prop
      } else if (order === 'descending') {
        this.listQuery.sort = '-' + prop
      } else {
        this.listQuery.sort = ''
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        name: '',
        phone: '',
        birthday: '',
        certNo: '',
        birthDiscount: 70,
        vipDiscount: 90
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.infoDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          create(this.temp).then(res => {
            this.temp.id = res.data
            this.temp.balance = 0
            this.temp.createTime = new Date()
            this.list.unshift(this.temp)
            this.infoDialogVisible = false
            this.btnLoading = false
            this.$notify({
              title: '成功',
              message: '新建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            console.error(err)
            this.btnLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.infoDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          // update(this.temp).then(() => {
          //   for (const v of this.list) {
          //     if (v.id === vip.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, vip)
          //       this.key ++
          //       break
          //     }
          //   }
          //   this.infoDialogVisible = false
          //   this.btnLoading = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleRemove(row, index) {
      this.$confirm('确定删除?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        remove([row.id]).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      })
    },
    handleShowCharge(vip) {
      this.currentVipId = vip.id
      this.chargeDialogVisible = true
    },
    handleShowConsume(vip) {
      this.currentVipId = vip.id
      this.consumeDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
