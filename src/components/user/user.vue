<template>
  <div>
    <a-modal v-model="dialogGroupId" :title="$t('agent.userInfo')" width="600px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @cancel="dialogGroupId = false" @ok="handRowOk">
      <div class="search-box">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <a-form-item :label="$t('admin.username')">
            <a-input v-model="searchData._like_r_username" style="150px" :placeholder="$t('admin.username')" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" icon="search" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :row-key="record => record.id"
        class="tableLimit"
        :pagination="false"
        style="margin-top:20px;"
        :row-selection="{onChange:onSelectChange,type:'radio'}"
      >
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="status" slot-scope="text, row ">
          {{ row.status == 0 ? $t('admin.normal') : $t('admin.Ban') }}
        </span>
        <span slot="role" slot-scope="text, row ">
          <!-- {{ row.role | getRole }} -->
          {{ row.role == 0 ? $t('admin.user') : null }}
        </span>
      </a-table>
      <!-- <el-table :data="tableData" class="tableLimit" style="width: 100%">
        <el-table-column label="选择" width="50" align="center">
          <template slot-scope="scope">
            <el-radio v-model="radioArr[scope.$index].value" class="radio" @change.native="getCurrentRow(scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="username" label="用户名" width="180" align="center" />>
        <el-table-column prop="email" label="邮箱" width="250" align="center" />
        <el-table-column prop="status" label="用户状态" align="center">
          <template slot-scope="scope">
            {{ scope.row.status == 0 ? '正常' : '封禁' }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" align="center">
          <template slot-scope="scope">
            {{ scope.row.role | getRole }}
          </template>
        </el-table-column>
      </el-table> -->
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <span slot="footer">
        <a-button style="margin-left:10px;" class="add-btn" type="success" @click="dialogGroupId = false">{{$t('admin.cancel')}}</a-button>
        <a-button style="margin-left:10px;" type="primary" :loading="assignLoading" @click="handRowOk">{{$t('admin.confirm')}}</a-button>
      </span>
    </a-modal>
  </div>
</template>

<script>
const columns = [{
  // title: '用户名',
  slotName: 'admin.username',
  dataIndex: 'username',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'username', title:'admin.username' }
}, {
  // title: '用户状态',
  slotName: 'admin.state',
  dataIndex: 'status',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'status', title:'admin.state' }
}, {
  // title: '角色',
  slotName: 'admin.role',
  dataIndex: 'role',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'role', title:'admin.role' }
}]
import * as api from '@/api/index'
import { message } from 'ant-design-vue'
export default {
  props: {
    role: {
      type: Number,
      required: true
    },
    assignLoading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        page: 1,
        page_size: 10,
        role: null,
        order_created_at: true,
        _like_r_username: ''
      },
      columns: columns,
      dialogGroupId: true,
      tableData: [],
      total: 0,
      size: 10,
      radioArr: [],
      selectUserId: ''
    }
  },
  // eslint-disable-next-line vue/order-in-components
  filters: {
    getRole(value) {
      if (value === 0) return '用户'
      if (value === 1) return '管理员'
      if (value === 2) return '代理商'
    }
  },
  watch: {
    dialogGroupId(newValue, oldValue) {
      if (!newValue) {
        this.$emit('cancelGetGroupId')
      }
    },
  },
  mounted() {
    this.searchData.role = this.role
    this.searchData.page = 1
    this.init()
  },
  methods: {
    init() {
      this.getTableData()
    },
    async getTableData() {
      const role = this.userInfo.data.r
      if (role === 2) {
        this.searchData.superiors_id = this.userInfo.data.i
      }
      if (role === 2) {
        const res = await api.getAgentUser(this.searchData)
        if (res && res.code === 0 && res.data) {
          this.tableData = res.data.data
          this.radioArr = []
          this.tableData.forEach((item, index) => {
            this.radioArr.push({
              index,
              value: false
            })
          })
          this.total = res.data.count
        }
      }
    },
    onSelectChange(selectedRowKeys, values) {
      this.selectUserId = values[0].id
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    getCurrentRow(index) {
      const id = this.tableData[index].id
      // console.log(id)
      this.$emit('getGroupId', id)
      this.dialogGroupId = false
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    handRowOk() {
      if (this.selectUserId !== '') {
        this.dialogGroupId = false
        this.$emit('getGroupId', this.selectUserId)
      } else {
        message.warning('请先选择用户')
      }
    }
  }
}
</script>

<style lang="scss">
</style>
