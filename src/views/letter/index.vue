<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.name')">
          <a-input v-model="searchData.name" style="150px" :placeholder="this.$t('admin.name')" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="add">{{this.$t('admin.Add')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="port_discount" slot-scope="text, row ">
          {{ row.port_discount/100 }}%
        </span>
        <span slot="updated_at" slot-scope="text, row ">
          {{ new Date(row.updated_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" type="primary" @click="alterView(row)">{{$t('admin.ModifyInformation')}}</a-button>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" :title="this.$t('admin.VIPlevel')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addUser">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="$t('admin.gradeName')" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item :label="$t('admin.describe')" prop="describe">
            <a-input v-model="form.describe" />
          </a-form-model-item>
          <a-form-model-item :label="$t('admin.portOffer')" prop="describe">
            <a-input v-model="form.port_discount" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
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
  // title: '名称',
  slotName: 'admin.name',
  dataIndex: 'name',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'name', title:'admin.name' }
}, {
  // title: '描述',
  slotName: 'admin.describe',
  dataIndex: 'describe',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'describe', title:'admin.describe' }
}, {
  // title: '端口优惠价',
  slotName: 'admin.portOffer',
  dataIndex: 'port_discount',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'port_discount', title: 'admin.portOffer' }
},
{
  // title: '更新时间',
  slotName: 'admin.updateTime',
  dataIndex: 'updated_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'updated_at', title:'admin.updateTime' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '300px',
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
        name: null,
        role: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      tableData: [],
      dialogVisible: false,
      modifyDialogVisible: false,
      form: {
        id: null,
        username: '',
        password: '',
        email: '',
        role: null,
        name: null,
        describe: null,
        port_discount: ''
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
      if (this.searchData.name === '') {
        this.searchData.name = null
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
      const res = await api.getAgentLevel(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    onSubmit() {
      console.log('submit!')
    },
    add() {
      this.dialogVisible = true
    },
    alterView(row) {
      this.form.id = row.id
      this.form.port_discount = row.port_discount
      this.form.describe = row.describe
      this.form.name = row.name
      this.dialogVisible = true
    },
    addUser() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        if (this.form.id != null) {
          let form = {}
          form.id = this.form.id
          form.name = this.form.name
          form.describe = this.form.describe
          form.port_discount = Number(this.form.port_discount)
          if (valid) {
            api.putAgentLevel(form).then((res) => {
              if (res.code === 0) {
                this.dialogVisible = false
                this.form.id = null
                this.init()
              }
            })
          }
        } else {
          let form = {}
          form.name = this.form.name
          form.describe = this.form.describe
          form.port_discount = Number(this.form.port_discount)
          if (valid) {
            api.postAgentLevel(form).then((res) => {
              if (res.code === 0) {
                this.dialogVisible = false
                this.form.id = null
                this.init()
              }
            })
          }
        }
      })
    },
    async getUserId(id) {
      const uid = this.nowData.id
      const superiors_id = id
      await api.putUserInter({ id: uid, superiors_id })
      this.getTableData()
    },
    view(id) {
      this.$router.push({
        name: 'Device',
        query: {
          belong: id
        }
      })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    del(row) {
      api.deletefnAgentLevel(row).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>
