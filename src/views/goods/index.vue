<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.SelfEmployed')">
          <a-select v-model="searchData.is_official" style="width:213px" allow-clear>
            <a-select-option :value="false">{{$t('admin.No')}}</a-select-option>
            <a-select-option :value="true">{{$t('admin.Yes')}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="this.$t('admin.userID')">
          <a-input v-model="searchData.user_id" style="100px" :placeholder="this.$t('admin.userID')" allow-clear />
        </a-form-item>
        <a-form-item :label="this.$t('admin.contactInformation')">
          <a-input v-model="searchData.contact" style="100px" :placeholder="this.$t('admin.contactInformation')" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          <!-- <a-button style="margin-left:10px;" type="primary" icon="plus" @click="add">新增</a-button> -->
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="role" slot-scope="text, row ">
          {{ row.role | getRole }}
        </span>
        <span slot="is_official" slot-scope="text, row">
          {{ row.is_official === false ? $t('admin.No') : $t('admin.Yes') }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" v-if="row.is_official === false" type="primary" @click="submitSetOfficial(row)">{{$t('admin.officialAccount')}}</a-button>
          <a-button style="margin-left:10px" v-else-if="row.is_official === true" type="primary" @click="submitSetOfficial(row)">{{$t('admin.unofficialAccount')}}</a-button>
        </span>
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <user v-if="dialogGroupId" :role="searchRole" @getGroupId="getUserId" @cancelGetGroupId="dialogGroupId = false" />
    </div>
  </div>
</template>
<script>
import * as api from '@/api/index'
import user from '@/components/user/user'
const columns = [{
  // title: '用户ID',
  slotName: 'admin.userID',
  dataIndex: 'user_id',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'username', title:'admin.userID' }
}, {
  // title: '自营账号',
  slotName: 'admin.SelfEmployed',
  dataIndex: 'is_official',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'is_official', title:'admin.SelfEmployed' }
}, {
  // title: '标题',
  slotName: 'admin.title',
  dataIndex: 'title',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'title', title:'admin.title' }
},
{
  // title: '描述',
  slotName: 'admin.describe',
  dataIndex: 'describe',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'describe', title:'admin.describe' }
},
{
  // title: '联系信息',
  slotName: 'admin.contactInformation',
  dataIndex: 'contact',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'contact', title:'admin.contactInformation' }
},
{
  // title: '价格',
  slotName: 'admin.price',
  dataIndex: 'price',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'price', title:'admin.price' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '250px',
  align: 'center',
  fixed: 'right',
  scopedSlots: { customRender: 'action', title:'admin.operate' }
}
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
      dialogGroupId: false,
      dialogAdv: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
      searchData: {
        _like_r_username: null,
        contact: null,
        username: null,
        role: null,
        is_official: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      tableData: [],
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        role: null
      },
      advForm: {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      },
      form_rule: {
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 100, message: '密码最少六位数', trigger: 'blur' }
        ]
      },
      modifyForm: { role: null, status: 0, rate: 0, password: null }
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
  mounted() {
    this.role = this.userInfo.data.r
    this.columns = []
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columns.push(item)
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
      //await api.getAdConfig()
    },
    async getTableData() {
      if (this.searchData.contact === '') {
        this.searchData.contact = null
      }
      if (this.searchData.user_id === '') {
        this.searchData.user_id = null
      }
      const res = await api.getAdminCommodityAccount(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    add() {
      this.dialogVisible = true
    },
    check(row) {
      this.dialogGroupId = true
      this.nowData = row
    },
    async getUserId(id) {
      const uid = this.nowData.id
      const superiors_id = id
      await api.putUserInter({ id: uid, superiors_id })
      this.getTableData()
    },
    async addAdv() {
      if (this.advForm.affiliate_id !== '') {
        this.advForm.affiliate_id = Number(this.advForm.affiliate_id)
      }
      const user_id = this.nowData.id
      const res = await api.postAdConfig({ user_id, ...this.advForm })
      if (res.code === 0) {
        this.dialogAdv = false
      }
    },
    submitSetOfficial(row) {
      api.putSetOfficial(row).then((res) => {
        this.init()
        // console.log(res)
      })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
  }
}
</script>
