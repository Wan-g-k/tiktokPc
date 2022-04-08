<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.pleaseChoose')">
          <a-select v-model="keyValue" :placeholder="this.$t('admin.pleaseChoose')" style="width:213px" allow-clear>
            <a-select-option :value="'port_price'">{{ $t('admin.portPrice') }}</a-select-option>
            <a-select-option :value="'flow_price'">{{$t('admin.trafficPrice') }}</a-select-option>
            <a-select-option :value="'bh_price'">{{ $t('admin.dealerFee') }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">查询</a-button>
          <!-- <a-button style="margin-left:10px;" type="primary" icon="plus" @click="addPort">{{this.$t('admin.portPrice')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="addFlow">{{this.$t('admin.trafficPrice')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="addPoundage">{{this.$t('admin.dealerFee')}}</a-button> -->
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{ $t(item.slotName) }}</span>
        </templete>
        <span v-if="row.key === 'port_price'" slot="key" slot-scope="text, row">
          <!-- 端口价格 -->
          {{ $t('admin.portPrice') }}
        </span>
        <span v-else-if="row.key === 'flow_price'" slot="key" slot-scope="text, row">
          <!-- 流量价格 -->
          {{ $t('admin.trafficPrice') }}
        </span>
        <span v-else-if="row.key === 'bh_price'" slot="key" slot-scope="text, row">
          <!-- 号商手续费 -->
          {{ $t('admin.dealerFee') }}
        </span>
        <span slot="created_at" slot-scope="text, row ">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="del(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
      <!-- 端口价格 -->
      <a-modal v-model="dialogVisible" :title="this.$t('admin.portPrice')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addPortprice">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="this.$t('admin.portPrice')">
            <a-input v-model="form.portPriceValue" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 流量价格 -->
      <a-modal v-model="flowVisible" :title="this.$t('admin.trafficPrice')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addFlowprice">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="this.$t('admin.trafficPrice')">
            <a-input v-model="form.flowPriceValue" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 号商手续费 -->
      <a-modal v-model="poundageVisible" :title="this.$t('admin.dealerFee')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addPoundagePrice">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="this.$t('admin.dealerFee')">
            <a-input v-model="form.bhPriceValue" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <!-- <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div> -->
      <user v-if="dialogGroupId" :role="searchRole" @getGroupId="getUserId" @cancelGetGroupId="dialogGroupId = false" />
    </div>
  </div>
</template>
<script>
import * as api from '@/api/index'
import user from '@/components/user/user'
const columns = [{
  // title: '名称',
  slotName: 'admin.projectName',
  dataIndex: 'key',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'key', title: 'admin.projectName' }
}, {
  // title: '价格',
  slotName: 'admin.price',
  dataIndex: 'val',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'val', title: 'admin.price' }
}]
export default {
  components: {
    user
  },
  data() {
    return {
      earningsRecordData: [],
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      total: 20,
      size: 10,
      columns: [],
      dialogGroupId: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
      keyValue: 'port_price',
      searchData: {
        username: null,
        role: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      tableData: [],
      dialogVisible: false,
      flowVisible: false,
      poundageVisible: false,
      modifyDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        role: null,
        name: null,
        describe: null,
        port_discount: '',
        port_price: 'port_price',
        flow_price: 'flow_price',
        bh_price: 'bh_price',
        portPriceValue: null,
        flowPriceValue: null,
        bhPriceValue: null
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
    },
    async getTableData() {
      let key = this.keyValue
      const res = await api.getAccountingConfig(key)
      if (res && res.code === 0 && res.data) {
        this.tableData = Array(res.data)
        this.total = res.data.count
      }
    },
    addPort() {
      this.dialogVisible = true
    },
    addPortprice() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.key = this.form.port_price
        form.val = this.form.portPriceValue
        if (valid) {
          api.postAdminConfig(form).then((res) => {
            if (res.code === 0) {
              this.dialogVisible = false
              this.init()
            }
          })
        }
      })
    },
    addFlow() {
      this.flowVisible = true
    },
    addFlowprice() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.key = this.form.flow_price
        form.val = this.form.flowPriceValue
        if (valid) {
          api.postAdminConfig(form).then((res) => {
            if (res.code === 0) {
              this.flowVisible = false
              this.init()
            }
          })
        }
      })
    },
    addPoundage() {
      this.poundageVisible = true
    },
    addPoundagePrice() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.key = this.form.bh_price
        form.val = this.form.bhPriceValue
        if (valid) {
          api.postAdminConfig(form).then((res) => {
            if (res.code === 0) {
              this.poundageVisible = false
              this.init()
            }
          })
        }
      })
    },
    async getUserId(id) {
      const uid = this.nowData.id
      const superiors_id = id
      await api.putUserInter({ id: uid, superiors_id })
      this.getTableData()
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
