<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <!-- <a-form-item label="号商ID">
          <a-input v-model="searchData.user_id" style="100px" placeholder="请输入号商ID" allow-clear />
        </a-form-item> -->
        <a-form-item :label="this.$t('agent.selfSupport')">
          <a-input v-model="searchData.contact" style="150px" :placeholder="this.$t('agent.enterInformation')" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">{{ $t('agent.inquire') }}</a-button>
          <a-button type="primary" icon="search" style="margin-left: 10px" @click="buyRecord()">{{ $t('agent.purchaseHistory') }}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :row-class-name="tableClass"
        :row-key="record => record.id"
        class="tableLimit"
        :scroll="{ x: 1200}"
        :bordered="true"
        :pagination="false"
      >
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{ $t(item.slotName) }}</span>
        </templete>
        <span slot="avatar" slot-scope="text, row ">
          <a-badge v-if="row.id == bundle_id" color="#87d068">
            <a-avatar :src="row.avatar" />
          </a-badge>
          <a-avatar v-else :src="row.avatar" />
        </span>
        <span slot="role" slot-scope="text, row ">
          {{ row.role | getRole }}
        </span>
        <span slot="is_official" slot-scope="text, row">
          {{ row.is_official === false ?'否':'是' }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button v-if="row.is_official === true" style="margin-left: 10px" type="primary" @click="buyAccount(row)">{{ $t('agent.buy') }}</a-button>
          <a-button v-else-if="row.is_official === false " style="margin-left: 10px" disabled type="primary">{{ $t('agent.buy') }}</a-button>
          <a-button style="margin-left: 10px" type="primary" @click="inventoryAccount(row)">{{ $t('agent.quantityStock') }}</a-button>
        </span>
      </a-table>

      <a-modal v-model="buyVisible" :title="$t('agent.PurchaseAccount')" :ok-text="this.$t('agent.confirm')" width="400px" :cancel-text="this.$t('agent.cancel')" @ok="buyAccountSubmit">
        <a-form-model ref="form" layout="horizontal" :model="accountForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <!-- <a-form-model-item label="商品ID">
            <a-input v-model="accountForm.commodity_id" readOnly/>
          </a-form-model-item> -->
          <a-form-model-item :label="this.$t('agent.quantity')">
            <a-input v-model="accountForm.quantity" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <!-- 库存信息 -->
      <a-modal v-model="inventoryVisible" :title="this.$t('agent.inventory')" width="400px" :ok-text="this.$t('agent.confirm')" :footer="null" :cancel-text="this.$t('agent.cancel')">
        <span>{{ $t('agent.quantityStock') + '：' }}{{ inventory.stock }}个</span>
        <!-- <a-form-model layout="horizontal" :model="inventory" :label-col="{ span: 0 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item prop="stock">
            <a-input v-model="inventory.stock" readOnly/>
          </a-form-model-item>
        </a-form-model> -->
      </a-modal>

      <!-- 购买记录 -->
      <a-modal v-model="buyRecordVisible" :title="$t('agent.purchaseHistory')" width="900px" :footer="null" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')">
        <a-table :columns="columnSrecord" :data-source="srecordTableData" :row-key="record => record.id" class="tableLimit" :bordered="true">
          <templete v-for="(item, index) in columnSrecord" :key="index" :slot="item.slotName">
            <span>{{ $t(item.slotName) }}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
      </a-modal>

      <!-- 选择账号 -->
      <a-modal v-model="chooseAccountVisible" title="选择账号" width="800px" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="buyAccountSubmit">
        <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :scroll="{ x: 1500}" class="tableLimit" :bordered="true" :pagination="false">
          <span slot="role" slot-scope="text, row ">
            {{ row.role | getRole }}
          </span>
          <span slot="is_official" slot-scope="text, row">
            {{ row.is_official === false ?'否':'是' }}
          </span>
        </a-table>
      </a-modal>

      <a-modal v-model="dialogVisible" title="新增用户" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="addUser">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择角色" prop="role">
            <a-select v-model="form.role" placeholder="请选择角色">
              <a-select-option v-if="role == 1" :value="1">管理员</a-select-option>
              <a-select-option :value="0">用户</a-select-option>
              <a-select-option :value="2">代理商</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="用户名" prop="username">
            <a-input v-model="form.username" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
          <a-form-model-item label="密码" prop="password">
            <a-input-password v-model="form.password" type="password" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
          <a-form-model-item label="邮箱">
            <a-input v-model="form.email" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="modifyDialogVisible" title="修改用户" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="editUser">
        <a-form-model ref="edit_form" layout="horizontal" :model="modifyForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="选择角色">
            <a-select v-model="modifyForm.role" placeholder="请选择角色">
              <a-select-option v-if="role == 1" :value="1">管理员</a-select-option>
              <a-select-option :value="0">用户</a-select-option>
              <a-select-option v-if="role == 1" :value="2">代理商</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('agent.state')">
            <a-select v-model="modifyForm.status" placeholder="请选择状态">
              <a-select-option :value="1">{{ $t('agent.banned') }}</a-select-option>
              <a-select-option :value="0">{{ $t('agent.normal') }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('agent.resetPasswrod')">
            <a-input-password v-model="modifyForm.password" type="password" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="dialogAdv" title="配置广告" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="addAdv">
        <a-form-model ref="adv_form" layout="horizontal" :model="advForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item label="api_key">
            <a-input v-model="advForm.api_key" />
          </a-form-model-item>
          <a-form-model-item label="affiliate_id">
            <a-input v-model="advForm.affiliate_id" />
          </a-form-model-item>
          <a-form-model-item label="form_public_api_key">
            <a-input v-model="advForm.form_public_api_key" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <user v-if="dialogGroupId" :role="searchRole" @getGroupId="getUserId" @cancelGetGroupId="dialogGroupId = false" />
    </div>
    <div>
      <el-dialog title="收益记录" :visible.sync="dialogTableVisible">
        <el-table :data="earningsRecordData">
          <el-table-column property="totalMoney" label="总收入" width="150" />
          <el-table-column property="adRecordTotal" label="广告收入" width="200" />
          <el-table-column property="rewardTotal" label="返利收入" />
          <el-table-column property="cashAmount" label="已提现总金额" />
          <el-table-column property="notCashAmount" label="未提现金额" />
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/index'
import user from '@/components/user/user'
const columns = [
/*   {
  title: '号商ID',
  dataIndex: 'user_id',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'username' }
}, */
  /* {
  title: '账号ID',
  dataIndex: 'id',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'username' }
}, */
  {
    // title: '头像',
    slotName: 'agent.profilePhoto',
    dataIndex: 'avatar',
    align: 'center',
    width: '200px',
    scopedSlots: { customRender: 'avatar', title: 'agent.profilePhoto' }
  },
  {
    // title: '标题',
    slotName: 'agent.title',
    dataIndex: 'title',
    width: '300px',
    align: 'center',
    scopedSlots: { customRender: 'title', title: 'agent.title' }
  },
  {
    slotName: 'agent.describe',
    dataIndex: 'describe',
    width: '100',
    align: 'center',
    scopedSlots: { customRender: 'describe', title: 'agent.describe' }
  },
  {
    // title: '联系信息',
    slotName: 'agent.contactInformation',
    dataIndex: 'contact',
    width: '100',
    align: 'center',
    scopedSlots: { customRender: 'contact', title: 'agent.contactInformation' }
  },
  {
    // title: '价格',
    slotName: 'agent.price',
    dataIndex: 'price',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'price', title: 'agent.price' }
  },
  {
    // title: '自营账号',
    slotName: 'agent.ProprietaryAccount',
    dataIndex: 'is_official',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'is_official', title: 'agent.ProprietaryAccount' }
  },
  {
    // title: '操作',
    slotName: 'agent.operation',
    dataIndex: 'action',
    width: '300px',
    align: 'center',
    fixed: 'right',
    scopedSlots: { customRender: 'action', title: 'agent.operation' }
  }
]
const columnSrecord = [
  {
    // title: '出售人',
    slotName: 'agent.vendor',
    dataIndex: 'sell_username',
    width: '180px',
    align: 'center',
    scopedSlots: { customRender: 'sell_username', title: 'agent.vendor' }
  },
  /* {
  title: '出售账号ID',
  dataIndex: 'sell_id',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'sell_id' }
}, */
  {
    // title: '数量',
    slotName: 'agent.quantity',
    dataIndex: 'quantity',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'quantity', title: 'agent.quantity' }
  }, {
    // title: '总计价格',
    slotName: 'agent.totalPrices',
    dataIndex: 'total_price',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'total_price', title: 'agent.totalPrices' }
  },
  {
    // title: '单个价格',
    slotName: 'agent.unitPrice',
    dataIndex: 'unit_price',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'unit_price', title: 'agent.unitPrice' }
  },
  {
    // title: '购买时间',
    slotName: 'agent.timeBuying',
    dataIndex: 'created_at',
    width: '100',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title: 'agent.timeBuying' }
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
      columnSrecord: [],
      srecordTableData: [],
      dialogGroupId: false,
      dialogAdv: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
      searchData: {
        _like_r_username: null,
        username: null,
        role: null,
        page: 1,
        page_size: 10,
        user_id: null,
        order_created_at: true
      },
      tableData: [],
      buyVisible: false,
      inventoryVisible: false,
      dialogVisible: false,
      modifyDialogVisible: false,
      chooseAccountVisible: false,
      buyRecordVisible: false,
      rowList: null,
      form: {
        username: '',
        password: '',
        email: '',
        role: null
      },
      accountForm: {
        commodity_id: null,
        quantity: null
      },
      advForm: {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      },
      inventory: {
        stock: 0
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
    this.columnSrecord = []
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columns.push(item)
    })
    columnSrecord.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columnSrecord.push(item)
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
      this.searchData.contact = this.searchData.contact || null
      this.searchData.user_id = this.searchData.user_id || null

      this.searchData.page = 1
      this.getTableData()
      // await api.getAdConfig()
    },
    async getTableData() {
      const res = await api.getAgentCommodityAccount(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    onSubmit() {
      // console.log('submit!')
    },
    tableClass(record, index) {
      if (record.is_official === false) {
        return 'backClass'
      }
    },
    add() {
      this.dialogVisible = true
    },
    addUser() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        if (valid) {
          api.addUserInter(this.form).then((res) => {
            if (res.code === 0) {
              this.dialogVisible = false
              this.init()
            }
          })
        }
      })
    },
    // 查看库存
    inventoryAccount(row) {
      this.inventoryVisible = true
      const form = {}
      form.id = row.id
      api.postAgentCommodityAccountStock(form).then((res) => {
        if (res.code === 0) {
          this.inventory.stock = res.data.stock
        }
      })
      // console.log(this.inventory.stock)
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
    edit(row) {
      // 修改  角色和状态 状态封禁1正常0
      this.modifyDialogVisible = true
      this.modifyForm = row
      this.modifyForm.password = null
    },
    // 购买账号
    buyAccount(row) {
      this.buyVisible = true
      this.rowList = row
      this.accountForm.commodity_id = row.id
    },
    buyRecord() {
      this.buyRecordVisible = true
      const id = this.userInfo.data.i
      const formas = {
        buy_id: id
      }

      api.getAgentCommodityAccountOrder(formas).then((res) => {
        if (res.code === 0) {
          this.srecordTableData = res.data.data
        }
      })
    },
    chooseAccount() {
      this.chooseAccountVisible = true
    },
    buyAccountSubmit() {
      const accountForm = {}
      accountForm.commodity_id = this.accountForm.commodity_id
      accountForm.quantity = Number(this.accountForm.quantity)
      api.postAgentCommodityAccountBuy(accountForm).then((res) => {
        this.buyVisible = false
        this.init()
      })
    },

    async configAdv(row) {
      const res = await api.getAdConfig({ user_id: row.id })
      this.nowData = row
      this.advForm = {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      }
      if (res.code === 0 && res.data && res.data.data && res.data.data.length > 0) {
        const data = res.data.data[0]
        this.advForm = {
          api_key: data.api_key,
          affiliate_id: data.affiliate_id,
          form_public_api_key: data.form_public_api_key
        }
      }
      this.dialogAdv = true
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
    editUser() {
      this.modifyForm.password = this.modifyForm.password === '' ? null : this.modifyForm.password
      if (this.modifyForm.password !== '' && this.modifyForm.password != null) {
        if (this.modifyForm.password.length < 6) {
          this.$message.error('密码不低于六位数')
          return
        }
      }
      api.putUserInter(this.modifyForm).then(res => {
        if (res.code === 0) {
          this.modifyDialogVisible = false
        }
      })
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
      api.delUserInter(row).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    async viewEarnings(id) {
      this.dialogTableVisible = true
      const res = await api.getIncome({ 'id': id })
      if (res.code === 0) {
        var recordData = {
          'totalMoney': res.data.total / 100,
          'adRecordTotal': res.data.adRecord.total / 100,
          'rewardTotal': res.data.reward.total / 100,
          'cashAmount': res.data.complete / 100,
          'notCashAmount': (res.data.total - res.data.complete) / 100
        }
        this.earningsRecordData = [recordData]
        // console.log(res.data)
      }
    }
  }
}
</script>
<style>
  .backClass{
    background: #eee;
    /* color: #eee; */
  }
</style>
