<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('agent.username')">
          <a-input v-model="searchData.username" style="150px" :placeholder="this.$t('agent.username')" allow-clear />
        </a-form-item>
        <a-form-item :label="this.$t('agent.state')">
          <a-select v-model="searchData.status" :placeholder="this.$t('agent.selectState')" style="width:213px" allow-clear>
            <a-select-option :value="0">{{ $t('agent.normal') }}</a-select-option>
            <a-select-option :value="1">{{ $t('agent.banned') }}</a-select-option>
            <!-- <a-select-option :value="1">管理员</a-select-option>
            <a-select-option :value="2">代理商</a-select-option> -->
            <!-- <a-select-option :value="3">号商</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">{{ $t('agent.inquire') }}</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="add">{{ $t('agent.newlyIncreased') }}</a-button>
          <a-button style="margin-left:10px;" type="primary" icon="plus" @click="purchaseFlow">{{ $t('agent.BuyTraffic') }}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1200}" :bordered="true" :pagination="false">
            <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
              <span>{{ $t(item.slotName) }}</span>
            </templete>
            <span slot="status" slot-scope="text, row">
              {{ row.status == 0 ? $t('agent.normal') : $t('agent.banned') }}
            </span>
            <span slot="role" slot-scope="text, row ">
              {{ row.role | getRole }}
            </span>
            <span slot="created_at" slot-scope="text, row">
              {{ new Date(row.created_at) | getTime }}
            </span>
            <span slot="updated_at" slot-scope="text, row">
              {{ new Date(row.updated_at) | getTime }}
            </span>
            <div slot="remark" slot-scope="text, row">
              <a-input v-model="row.remark" style="text-align:center" @blur="handleInputBlur(row)" />
            </div>
            <span slot="action" slot-scope="text, row">
              <!-- <a-button style="margin-left:10px" @click="viewEarnings(row.id)">查看收益</a-button> -->
              <a-button style="margin-left:10px" type="primary" @click="view(row.id)">{{ $t('agent.netstat') }}</a-button>
              <a-button style="margin-left:10px" type="primary" @click="checkAgency(row.id)">{{ $t('agent.tellAmgrSchedule') }}</a-button>
              <a-button style="margin-left:10px" type="primary" @click="addTraffic(row.id)">{{ $t('agent.AddTraffic') }}</a-button>
              <a-button style="margin-left:10px" type="primary" @click="addPort(row.id)">{{ $t('agent.TheNewPort') }}</a-button>
              <!-- <a-button style="margin-left:10px" type="primary" @click="addDay(row.id)">新增端口(临时)</a-button> -->
              <a-button style="margin-left:10px" type="primary" @click="edit(row)">{{ $t('agent.edit') }}</a-button>
              <!-- <a-button style="margin-left:10px" @click="addIntegral(row.id)">添加积分</a-button> -->
              <!-- <a-button v-if="role == 1" :disabled="row.role != 0" style="margin-left:10px" type="primary" @click="check(row)">绑定代理商</a-button> -->
              <!-- <a-button v-if="role == 1" style="margin-left:10px" type="primary" @click="configAdv(row)">配置广告</a-button> -->
              <a-popconfirm :title="$t('agent.Isdelete')" :ok-text="$t('admin.Yes')" :cancel-text="$t('admin.No')" @confirm="del(row.id)">
                <a-button style="margin-left:10px" type="danger">{{ $t('agent.delete') }}</a-button>
              </a-popconfirm>
            </span>
          </a-table>
        </a-col>
      </a-row>
      <a-modal v-model="dialogVisible" :title="this.$t('agent.newUsers')" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="addUser">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
          <a-form-model-item :label="this.$t('agent.selectRole')" prop="role">
            <a-select v-model="form.role">
              <!-- <a-select-option v-if="role == 1" :value="1">管理员</a-select-option> -->
              <a-select-option :value="0">{{ $t('agent.user') }}</a-select-option>
              <!-- <a-select-option :value="2">代理商</a-select-option> -->
              <!-- <a-select-option :value="3">号商</a-select-option> -->
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('agent.username')" prop="username">
            <a-input v-model="form.username" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
          <!-- <a-form-model-item label="手机号" prop="handset">
            <a-input v-model="form.handset" />
          </a-form-model-item>
          <a-form-model-item label="验证码" prop="verification">
            <a-input-search
              placeholder="请输入验证码"
              :enter-button="enterVal"
              v-model="form.verification"
              @search="onSearchVerification"
            />
          </a-form-model-item>
          <a-form-model-item label="QQ">
            <a-input v-model="form.QQemail" />
          </a-form-model-item> -->

          <a-form-model-item :label="this.$t('agent.password')" prop="password">
            <a-input-password v-model="form.password" type="password" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
          <a-form-model-item :label="this.$t('agent.mailbox')">
            <a-input v-model="form.email" />
          </a-form-model-item>

        </a-form-model>
      </a-modal>

      <a-modal v-model="addPortVisible" :title="this.$t('agent.TheNewPort')" :ok-text="this.$t('agent.confirm')" width="400px" :cancel-text="this.$t('agent.cancel')" @ok="addPortApi">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="this.$t('agent.quantity')" prop="num">
            <a-input v-model="addPortForm.num" />
          </a-form-model-item>
          <a-form-model-item :label="this.$t('agent.time')">
            <a-select v-model="addPortForm.day" allow-clear>
              <a-select-option :value="1">{{ $t('agent.oneMonth') }}</a-select-option>
              <a-select-option :value="3">{{ $t('agent.quarter') }}</a-select-option>
              <a-select-option :value="6">{{ $t('agent.halfYear') }}</a-select-option>
              <a-select-option :value="12">{{ $t('agent.year') }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="addPortVisible = false">{{ $t('agent.cancel') }}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="addPortLoading" @click="addPortApi">{{ $t('agent.confirm') }}</a-button>
        </span>
      </a-modal>

      <a-modal v-model="addDayVisible" title="新增端口(临时)" ok-text="确认" width="400px" cancel-text="取消" @ok="addPortApiLS">
        <a-form-model ref="form" layout="horizontal" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="数量">
            <a-input v-model="addDayForm.num" />
          </a-form-model-item>
          <a-form-model-item label="时间">
            <a-input v-model="addDayForm.day" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 查看代理  @ok="addAgencyApit" -->
      <a-modal v-model="checkAgencyVisible" :title="$t('agent.tellAmgrSchedule')" :ok-text="$t('admin.addAgent')" :ok-button-props="OKbuttonDisplay"  :width="700" cancel-text="取消" @ok="addAgency">
        <a-table :columns="columnsAgency" :data-source="agencyData" :row-key="record => record.user_id" class="tableLimit" :bordered="true" :pagination="false" :scroll="{ x: 600}">
          <templete v-for="(item, index) in columnsAgency" :key="index" :slot="item.slotName">
            <span>{{ $t(item.slotName) }}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        </a-table>
      </a-modal>

      <!-- 购买流量 -->
      <a-modal v-model="purchaseFlowVisible" :title="this.$t('agent.BuyTraffic')" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="purchaseFlowApi">
        <a-form-model ref="form" layout="horizontal" :model="FlowForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('agent.flow')" prop="flow">
            <a-input v-model="FlowForm.flow" />
          </a-form-model-item>
        </a-form-model>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="purchaseFlowVisible = false">{{ $t('agent.cancel') }}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="purchaseLoading" @click="purchaseFlowApi">{{ $t('agent.confirm') }}</a-button>
        </span>
      </a-modal>
      <!-- 添加流量 -->
      <a-modal v-model="addTrafficVisible" :title="this.$t('agent.AddTraffic')" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="addTrafficApi">
        <a-form-model ref="form" layout="horizontal" :model="trafficForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('agent.flowM')" prop="flow">
            <a-input v-model="trafficForm.flow" />
          </a-form-model-item>
        </a-form-model>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="addTrafficVisible = false">{{ $t('agent.cancel') }}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="addTrafficLoading" @click="addTrafficApi">{{ $t('agent.confirm') }}</a-button>
        </span>
      </a-modal>
      <!-- 添加积分 -->
      <a-modal v-model="addIntegralVisible" title="添加积分" ok-text="确认" cancel-text="取消" @ok="addIntegralApi">
        <a-form-model ref="form" layout="horizontal" :model="integralForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="积分：" prop="flow">
            <a-input v-model="integralForm.points" />
          </a-form-model-item>
          <a-form-model-item label="备注：" prop="flow">
            <a-input v-model="integralForm.remarks" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <!-- 编辑用户 -->
      <a-modal v-model="modifyDialogVisible" :title="this.$t('agent.ModifyUser')" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @ok="editUser">
        <a-form-model ref="edit_form" layout="horizontal" :model="modifyForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 13 }">
          <a-form-model-item :label="this.$t('agent.selectRole')">
            <a-select v-model="modifyForm.role" :placeholder="this.$t('agent.selectRole')">
              <!-- <a-select-option v-if="role == 1" :value="1">管理员</a-select-option> -->
              <a-select-option :value="0">{{ $t('agent.user') }}</a-select-option>
              <!-- <a-select-option v-if="role == 1" :value="2">代理商</a-select-option> -->
              <!-- <a-select-option :value="3">号商</a-select-option> -->
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('agent.selectState')">
            <a-select v-model="modifyForm.status">
              <a-select-option :value="1">{{ $t('agent.banned') }}</a-select-option>
              <a-select-option :value="0">{{ $t('agent.normal') }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('agent.resetPasswrod')">
            <a-input-password v-model="modifyForm.password" type="password" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="dialogAdv" title="配置广告" ok-text="确认" cancel-text="取消" @ok="addAdv">
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
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
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
          <el-table-column property="totalMoney" label="总收入" width="150"></el-table-column>
          <el-table-column property="adRecordTotal" label="广告收入" width="200"></el-table-column>
          <el-table-column property="rewardTotal" label="返利收入"></el-table-column>
          <el-table-column property="cashAmount" label="已提现总金额"></el-table-column>
          <el-table-column property="notCashAmount" label="未提现金额"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/index'
import user from '@/components/user/user'
import { number } from 'echarts'
import { Message } from 'element-ui'
const columns = [{
  // title: '用户名',
  slotName: 'agent.username',
  dataIndex: 'username',
  width: 180,
  align: 'center',
  scopedSlots: { customRender: 'username', title: 'agent.username' }
}, {
  // title: '用户状态',
  slotName: 'agent.userState',
  dataIndex: 'status',
  width: 100,
  align: 'center',
  scopedSlots: { customRender: 'status', title: 'agent.userState' }
},
/* {
  title: '流量',
  dataIndex: 'flow',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'flow' }
}, */
{
  // title: '邮箱',
  slotName: 'agent.mailbox',
  dataIndex: 'email',
  width: 200,
  align: 'center',
  scopedSlots: { customRender: 'email', title: 'agent.mailbox' }
},
{
  // title: '备注',
  slotName: 'admin.remark',
  dataIndex: 'remark',
  width: 300,
  align: 'center',
  scopedSlots: { customRender: 'remark', title: 'admin.remark' }
},
{
  // title: '创建时间',
  slotName: 'agent.createTime',
  dataIndex: 'created_at',
  width: 140,
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'agent.createTime' }
},
{
  // title: '更新时间',
  slotName: 'agent.updateTime',
  dataIndex: 'updated_at',
  width: 130,
  align: 'center',
  scopedSlots: { customRender: 'updated_at', title: 'agent.updateTime' }
},
{
  // title: '操作',
  slotName: 'agent.operation',
  dataIndex: 'action',
  width: 600,
  align: 'center',
  fixed: 'right',
  scopedSlots: { customRender: 'action', title: 'agent.operation' }
}]
const columnsAgency = [
  {
    // title: '代理用户名',
    slotName: 'agent.ProxyUsername',
    dataIndex: 'username',
    width: '80px',
    align: 'center',
    scopedSlots: { customRender: 'username', title: 'agent.ProxyUsername' }
  },
  {
    // title: '代理密码',
    slotName: 'agent.ProxyPasswrod',
    dataIndex: 'password',
    width: '80px',
    align: 'center',
    scopedSlots: { customRender: 'password', title: 'agent.ProxyPasswrod' }
  },
  {
    // title: '创建时间',
    slotName: 'agent.createTime',
    dataIndex: 'created_at',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title: 'agent.createTime' }
  }
]
export default {
  components: {
    user
  },
  data() {
    const validatorHandset = (rule, value, callback) => {
      let isOk = true
      var myreg=/^[1][3,4,5,6.7,8,9][0-9]{9}$/
      console.log(value)
      if(!myreg.test(value)) {
        isOk = false
        callback(new Error('请输入正确的手机号码'))
      }
      if (isOk) callback()
    }
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
        status: 0,
        order_created_at: true
      },
      enterVal: '获取验证码',
      timeVal: 60,
      tableData: [],
      agencyData: [],
      dialogVisible: false,
      addPortVisible: false,
      addPortLoading: false,// 新增端口 确定按钮
      addDayVisible: false,
      purchaseLoading: false, //购买流量
      // 添加流量
      trafficForm: {
        user_id: 0,
        flow: 0
      },
      FlowForm: {
        flow: 0
      },
      addIntegralVisible: false,
      addTrafficVisible: false,
      addTrafficLoading: false, // 添加流量 确定按钮
      // 查看代理
      checkAgencyVisible: false,
      agencyId: null,
      modifyDialogVisible: false,
      purchaseFlowVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        handset: null,
        verification: null,
        QQemail: null,
        role: null
      },
      addPortForm:{
        user_id: null,
        num: null,
        day: 1
      },
      addDayForm:{
        user_id: null,
        num: null,
        day: 1
      },
      advForm: {
        api_key: '',
        affiliate_id: '',
        form_public_api_key: ''
      },
      // 添加积分
      integralForm: {
        user_id: 0,
        points: '',
        remarks: ''
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
        ],
        handset: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatorHandset, trigger: 'blur' }
        ],
        verification: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
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
      if (value === 3) return '号商'
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
      this.searchData.username = this.searchData.username === '' ? null : this.searchData.username
      if (this.role === 2) {
        this.searchData.role = 0
        this.searchData.superiors_id = this.userInfo.data.i
      }
      this.searchData.page = 1
      this.addDayForm.day = 1
      this.addPortForm.day = 1
      this.getTableData()
      //await api.getAdConfig()
    },
    async getTableData() {
      const res = await api.getAgent(this.searchData)
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
      this.form.username = ''
      this.form.password = ''
      this.form.email = ''
    },
    // 查看代理
    checkAgency(row) {
      this.checkAgencyVisible = true
      this.agencyId = row
      const data = {
        user_id: row
      }
      api.getAgencyProxy(data).then((res) => {
        if (res.code === 0) {
          this.agencyData = res.data.data
          if (this.agencyData.length === 0) {
            this.OKbuttonDisplay = {}
          } else {
            this.OKbuttonDisplay = { style: { display: 'none' } }
          }
        }
      })
    },
    addAgency() {
      console.log(this.agencyId)
      const data = {
        user_id: this.agencyId,
      }
      api.postAgency(data).then((res) => {
        if (res.code === 0) {
          this.checkAgencyVisible = false
          this.init()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 添加流量
    addTraffic(row) {
      this.trafficForm.user_id = row
      this.addTrafficVisible = true
    },
    
    addTrafficApi() {
      this.addTrafficLoading = true
      const data = {
        user_id: this.trafficForm.user_id,
        flow: Number(this.trafficForm.flow)
      }
      api.postAgencyAddFlow(data).then((res) => {
        if (res.code === 0) {
          this.addTrafficVisible = false
          this.addTrafficLoading = false
          this.init()
        }
      }).catch((err) => {
        Message({
          message: err.msg,
          type: 'error'
        })
      })
    },
    purchaseFlow() {
      this.purchaseFlowVisible = true
    },
    purchaseFlowApi() {
      this.purchaseLoading = true
      const data = {
        flow: Number(this.FlowForm.flow)
      }
      api.postAgencyBuy(data).then((res) => {
        if (res.code === 0) {
          this.purchaseFlowVisible = false
          this.purchaseLoading = false
          this.init()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 修改备注
    async handleInputBlur(row) {
      let form = {}
      form.id = row.id
      form.remark = row.remark
      await api.putAgentUserInter(form)
      this.init()
    },
    // 添加积分
    addIntegral(row) {
      this.integralForm.user_id = row
      this.addIntegralVisible = true
    },
    addIntegralApi() {
      const data = {
        user_id: this.integralForm.user_id,
        points: Number(this.integralForm.points),
        remarks: this.integralForm.remarks
      }
      api.postPointsRecord(data).then((res) => {
        if (res.code === 0) {
          this.addTrafficVisible = false
          this.init()
        } else {
          message.error(res.data.message)
        }
      })
    },
    // 获取验证码
    onSearchVerification() {
      let myreg=/^[1][3,4,5,6.7,8,9][0-9]{9}$/
      if(!myreg.test(this.form.handset) ) {
        this.$message.error('请输入正确手机号码')
        return
      }
      let setVal = setInterval(() =>{
        this.timeVal--
        this.enterVal = this.timeVal+'s'
        if(this.timeVal === 0) {
        clearInterval(setVal)
        this.enterVal = '获取验证码'
        this.timeVal = 60
      } else if(this.form.verification != '') {
        clearInterval(setVal)
        this.enterVal = '获取验证码'
        this.timeVal = 60
      }
      },1000)
      
    },
    // 新增用户
    addUser() {
      this.form.username = this.form.username.trim()
      this.form.password = this.form.password === '' ? null : this.form.password
      if (this.form.password !== '' && this.form.password != null) {
        if (this.form.password.length < 6) {
          this.$message.error('密码不低于六位数')
          return
        }
      }
      this.$refs['form'].validate(async valid => {
        if (valid) {
          api.addAgentInter(this.form).then((res) => {
            if (res.code === 0) {
              this.$message.success('新增成功')
              this.dialogVisible = false
              this.init()
            }
          }).catch(err => {
            this.$message.error(err.msg)
          })
        }
      })
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
      api.putAgentUserInter(this.modifyForm).then(res => {
        if (res.code === 0) {
          this.modifyDialogVisible = false
        }
      })
    },
    view(id) {
      this.$router.push({
        name: 'agentDevice',
        query: {
          belong: id
        }
      })
    },
    addPort(id) {
      this.addPortVisible = true
      this.addPortForm.user_id = id
    },
    addPortApi() {
      this.addPortLoading = true
      var postData = {
        user_id: this.addPortForm.user_id,
        num: Number(this.addPortForm.num),
        day: this.addPortForm.day
      }
      api.postAgentPort(postData).then(res => {
        if (res.code === 0) {
          this.addPortVisible = false
          this.addPortLoading = false
          this.getTableData()
        }
      }).catch((err) => {
        Message({
          message: err.msg,
          type: 'error'
        })
      })
    },
    // 添加端口 (临时)
    addDay(id) {
      this.addDayVisible = true
      this.addDayForm.user_id = id
    },
    addPortApiLS() {
      console.log(this.addPortForm)
      var postData = {
        user_id: this.addDayForm.user_id,
        num: Number(this.addDayForm.num),
        day: Number(this.addDayForm.day)
      }
      api.postAgentPortAddDay(postData).then(res => {
        if (res.code === 0) {
          this.addDayVisible = false
          this.init()
          // this.getTableData()
        }
      }).catch((err) => {
        Message({
          message: err.msg,
          type: 'error'
        })
      })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    del(row) {
      api.delAgentUserInter(row).then(res => {
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
        console.log(res.data)
      }
    }
  }
}
</script>
