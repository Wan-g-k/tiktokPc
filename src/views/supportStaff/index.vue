<template class="searcahss">
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.username')">
          <a-input v-model="searchData.username" style="150px" :placeholder="this.$t('admin.username')" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="add">{{this.$t('admin.Add')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :loading="tableLoading" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1200}" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="status" slot-scope="text, row">
          {{ row.status == 0 ? $t('admin.normal') : $t('admin.Ban') }}
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="role" slot-scope="text, row ">
          {{ row.role | getRole }}
        </span>
        <span slot="action" slot-scope="text, row">
            <a-button style="margin-left:10px" type="primary" @click="edit(row)">{{$t('admin.edit')}}</a-button>
          <a-popconfirm :title="$t('admin.delete')" ok-text="Yes" cancel-text="No" @confirm="del(row.id)">
            <a-button style="margin-left:10px" type="danger">{{$t('admin.delete')}}</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" :title="this.$t('admin.newUsers')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addUser">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('admin.role')" prop="role">
            <a-select v-model="form.role" :placeholder="this.$t('admin.role')">
              <a-select-option :value="4">{{$t('admin.customerService')}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.username')" prop="username">
            <a-input v-model="form.username" oninput="value=value.replace(/[^\w\/]/ig,'')"/>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.password')" prop="password">
            <a-input-password v-model="form.password" type="password" oninput="value=value.replace(/[^\w\/]/ig,'')"/>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.Mail')">
            <a-input v-model="form.email" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>


      <a-modal v-model="modifyDialogVisible" :title="this.$t('admin.modifyUser')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="editUser">
        <a-form-model ref="edit_form" layout="horizontal" :model="modifyForm"  :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('admin.role')">
            <a-select v-model="modifyForm.role" :placeholder="this.$t('admin.role')">
              <a-select-option :value="4">{{$t('admin.customerService')}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.state')">
            <a-select v-model="modifyForm.status" :placeholder="this.$t('admin.state')">
              <a-select-option :value="1">{{$t('admin.Ban')}}</a-select-option>
              <a-select-option :value="0">{{$t('admin.normal')}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.password')">
            <a-input-password v-model="modifyForm.password" type="password" oninput="value=value.replace(/[^\w\/]/ig,'')"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} ，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/index'
import user from '@/components/user/user'
import { number } from 'echarts'
const columns = [{
  // title: '用户名',
  slotName: 'admin.username',
  dataIndex: 'username',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'username', title:'admin.username' }
}, {
  // title: '状态',
  slotName: 'admin.state',
  dataIndex: 'status',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'status', title:'admin.state' }
},
{
  // title: '角色',
  slotName: 'admin.role',
  dataIndex: 'role',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'role', title:'admin.role' }
},
{
  // title: '邮箱',
  slotName: 'admin.Mail',
  dataIndex: 'email',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'email', title:'admin.Mail' }
},
{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title:'admin.creationTime' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '300px',
  align: 'center',
  fixed: 'right',
  scopedSlots: { customRender: 'action', title:'admin.operate' }
}]
const columnsAgency = [
{
  // title: '代理用户名',
  slotName: 'admin.proxyUsername',
  dataIndex: 'username',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'username', title:'admin.proxyUsername' }
},
{
  // title: '代理密码',
  slotName: 'admin.proxypassword',
  dataIndex: 'password',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'password', title:'admin.proxypassword' }
},
{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title:'admin.creationTime' }
},
]
export default {
  components: {
    user
  },
  data() {
    return {
      earningsRecordData: [],
      dialogTableVisible: false,
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      total: 20,
      size: 10,
      columns: [],
      columnsAgency: [],
      dialogGroupId: false,
      dialogAdv: false,
      tableLoading: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
      OKbuttonDisplay:{ style: { display: 'none' } },
      searchData: {
        _like_r_username: null,
        username: null,
        role: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      tableData: [],
      agencyData: [],
      dialogVisible: false,
      agentLevelVisible: false,
      agentLevelForm: {
        name: '',
        describe: '',
        port_discount: 1
      },
      agencyId: null,
      modifyDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        role: null,
        user_id: null,
        agentLevel: null,
        points: null,
        level_id: 1,
        remarks: null
      },

      levelList: [],
      advForm: {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      },
      form_rule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 100, message: '密码最少六位数', trigger: 'blur' }
        ]
      },
      modifyForm: { role: null, status: 0, rate: 0, password: null },
      levelForm: { agent_level: null },
    }
  },
  filters: {
    getRole(value) {
      if (value === 0) return '用户'
      if (value === 1) return '管理员'
      if (value === 2) return '代理商'
      if (value === 3) return '号商'
      if (value === 4) return '客服'
    }
  },
  mounted() {
    this.role = this.userInfo.data.r
    this.columns = []
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columns.push(item)
    })
    this.columnsAgency = []
    columnsAgency.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columnsAgency.push(item)
    })
    this.init()
  },
  methods: {
    async init() {
      if (this.searchData.role === '') {
        this.searchData.role = null
      }
      if (this.role === 2) {
        this.searchData.role = 0
        this.searchData.superiors_id = this.userInfo.data.i
      }
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      let searchData = {}
      this.tableLoading = true
      if(this.searchData.username === '') {
        this.searchData.username = null
      }
      searchData.page = this.searchData.page
      searchData.page_size = this.searchData.page_size
      searchData.role = this.searchData.role
      searchData.order_created_at = this.searchData.order_created_at
      searchData.username = this.searchData.username
      const res = await api.getUserKF(searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.tableLoading = false
        this.total = res.data.count
      }
    },
    add() {
      this.dialogVisible = true
      this.form.username = ''
      this.form.password = ''
      this.form.email = ''
    },
    addUser() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.role = this.form.role
        form.username = this.form.username
        form.password = this.form.password
        form.email = this.form.email
        if (valid) {
          api.postUserKF(form).then((res) => {
            if (res.code === 0) {
              this.dialogVisible = false
              this.init()
            }
          }).catch((err) => {
            this.$message.error(err.msg)
          })
        }
      })
    },
    edit(row) {
      // 修改  角色和状态 状态封禁1正常0
      this.modifyDialogVisible = true
      this.modifyForm = row
      this.modifyForm.password = null
    },
    editUser() {
      this.modifyForm.password = this.modifyForm.password === '' ? null : this.modifyForm.password
      if (this.modifyForm.password !== '' && this.modifyForm.password != null) {
        if (this.modifyForm.password.length < 6) {
          this.$message.error('密码不低于六位数')
          return
        }
      }
      api.putUserKF(this.modifyForm).then(res => {
        if (res.code === 0) {
          this.modifyDialogVisible = false
        }
      })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    del(row) {
      api.delUserKF(row).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
  }
}
</script>
