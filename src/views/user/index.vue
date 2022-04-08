<template class="searcahss">
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.username')">
          <a-input v-model="searchData.username" style="150px" :placeholder="this.$t('admin.username')" allow-clear />
        </a-form-item>
        <a-form-item v-if="role == 1" :label="this.$t('admin.role')">
          <a-select v-model="searchData.role" :placeholder="this.$t('admin.role')" style="width:213px" allow-clear>
            <a-select-option :value="0">{{ this.$t('admin.user') }}</a-select-option>
            <!-- <a-select-option :value="1">管理员</a-select-option> -->
            <a-select-option :value="2">{{ this.$t('admin.agent') }}</a-select-option>
            <a-select-option :value="3">{{ this.$t('admin.supplier') }}</a-select-option>
            <a-select-option :value="4">{{ this.$t('admin.customerService') }}</a-select-option>
            <a-select-option :value="5">审核员</a-select-option>
            <!-- <a-select-option :value="6">会计</a-select-option> -->
          </a-select>
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
          <span>{{ $t(item.slotName) }}</span>
        </templete>
        <span slot="status" slot-scope="text, row">
          {{ row.status == 0 ? $t('admin.normal') : $t('admin.Ban') }}
        </span>
        <span slot="agent_level" slot-scope="text, row">
          {{ row.agent_level | getLevel }}
        </span>
        <span slot="role" slot-scope="text, row ">
          {{ row.role | getRole }}
        </span>
        <span slot="action" slot-scope="text, row">
          <!-- <a-button style="margin-left:10px" @click="viewEarnings(row.id)">查看收益</a-button> -->

          <a-button v-if="role === 1" type="primary" @click="checkSystem(row.id)">{{ $t('admin.pointsRecord') }}</a-button>
          <a-button style="margin-left:10px" type="primary" @click="addTraffic(row.id)">{{ $t('admin.addPoints') }}</a-button>
          <!-- <a-button style="margin-left:10px" @click="addPort(row.id)">新增端口</a-button> -->
          <a-button style="margin-left:10px" type="primary" @click="edit(row)">{{ $t('admin.edit') }}</a-button>
          <a-button style="margin-left:10px" type="primary" @click="editLevel(row)">{{ $t('admin.modifyLevel') }}</a-button>
          <a-button style="margin-left:10px" type="primary" @click="alterAgent(row)">{{ $t('admin.modifyAgent') }}</a-button>
          <!-- <a-button v-if="role == 1" :disabled="row.role != 0" style="margin-left:10px" type="primary" @click="check(row)">绑定代理商</a-button> -->
          <!-- <a-button v-if="role == 1" style="margin-left:10px" type="primary" @click="configAdv(row)">配置广告</a-button> -->
          <a-popconfirm :title="$t('admin.deleteUsers')" ok-text="Yes" cancel-text="No" @confirm="del(row.id)">
            <a-button style="margin-left:10px" type="danger">{{ $t('admin.deleteUsers') }}</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" :title="this.$t('admin.newUsers')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addUser">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('admin.role')" prop="role">
            <a-select v-model="form.role" :placeholder="this.$t('admin.role')">
              <a-select-option v-if="role == 1" :value="1">{{ $t('admin.administrator') }}</a-select-option>
              <!-- <a-select-option :value="0">用户</a-select-option> -->
              <a-select-option :value="2">{{ $t('admin.agent') }}</a-select-option>
              <a-select-option :value="3">{{ $t('admin.supplier') }}</a-select-option>
              <a-select-option :value="5">审核员</a-select-option>
              <!-- <a-select-option :value="6">会计</a-select-option> -->
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="form.role === 2" :label="this.$t('admin.VIPlevel')">
            <a-select @change="(value,option) => {levelId(value,option)} " :placeholder="this.$t('admin.grade')" >
              <a-select-option v-for="item in levelList" :key="item.id" :value="item.id" :label="item.name">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.username')" prop="username">
            <a-input v-model="form.username" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.password')" prop="password">
            <a-input-password v-model="form.password" type="password" oninput="value=value.replace(/[^\w\/]/ig,'')" />
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.Mail')">
            <a-input v-model="form.email" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-modal v-model="addPortVisible" :title="this.$t('admin.newPort')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addPortApi">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('admin.quantity')" prop="num">
            <a-input v-model="addPortForm.num" />
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.heaven')">
            <a-input v-model="addPortForm.day" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 查看积分记录  @ok="addAgencyApit" -->
      <a-modal v-model="checkAgencyVisible" :title="this.$t('admin.pointsRecord')" :ok-text="this.$t('admin.confirm')" :ok-button-props="OKbuttonDisplay"  :width="700" :cancel-text="this.$t('admin.cancel')" @ok="addAgency">
        <a-table :columns="columnsAgency" :data-source="agencyData" :row-key="record => record.user_id" class="tableLimit" :bordered="true" :pagination="false" :scroll="{ x: 600}">
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
      </a-modal>

      <!-- 添加积分 -->
      <a-modal v-model="addTrafficVisible" :title="this.$t('admin.addPoints')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addTrafficApi">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="$t('admin.integral')+':'" prop="flow">
            <a-input v-model="form.points" />
          </a-form-model-item>
          <a-form-model-item :label="$t('admin.remark')+':'" prop="flow">
            <a-input v-model="form.remarks" />
          </a-form-model-item>
        </a-form-model>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="addTrafficVisible = false">{{this.$t('admin.cancel')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="addTrafficLoading" @click="addTrafficApi">{{this.$t('admin.confirm')}}</a-button>
        </span>
      </a-modal>
      <!-- VIP等级 -->
      <a-modal v-model="agentLevelVisible" :title="this.$t('admin.levelSetting')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="addAgentLevel">
        <a-form-model ref="form" layout="horizontal" :model="agentLevelForm" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="this.$t('admin.grade')">
            <a-input v-model="agentLevelForm.name" />
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.describe')">
            <a-input v-model="agentLevelForm.describe" />
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.portOffer')">
            <a-input v-model="agentLevelForm.port_discount" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-modal v-model="modifyDialogVisible" :title="this.$t('admin.modifyUser')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="editUser">
        <a-form-model ref="edit_form" layout="horizontal" :model="modifyForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('admin.role')">
            <a-select v-model="modifyForm.role" :placeholder="this.$t('admin.role')">
              <a-select-option v-if="role == 1" :value="1">{{ $t('admin.administrator') }}</a-select-option>
              <a-select-option v-if="role == 1" :value="0">{{ $t('admin.user') }}</a-select-option>
              <a-select-option v-if="role == 1" :value="2">{{ $t('admin.agent') }}</a-select-option>
              <a-select-option v-if="role == 1" :value="3">{{ $t('admin.supplier') }}</a-select-option>
              <a-select-option v-if="role == 1" :value="4">{{ $t('admin.customerService') }}</a-select-option>
              <a-select-option v-if="role == 1" :value="5">审核员</a-select-option>
              <!-- <a-select-option v-if="role == 1" :value="6">会计</a-select-option> -->
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
      <a-modal v-model="levelVisible" :title="this.$t('admin.modifyLevel')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="levelUser">
        <a-form-model ref="edit_form" layout="horizontal" :model="levelForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
          <a-form-model-item :label="this.$t('admin.VIPlevel')">
            <a-select @change="(value,option) => {levelAlter(value,option)} " :placeholder="this.$t('admin.grade')" >
              <a-select-option v-for="item in levelList" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 修改代理商 -->
      <a-modal v-model="alterAgentVisible" :title="this.$t('admin.modifyAgent')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok='alterAgentSubmit'>
        <a-form-model ref="edit_form" layout="horizontal" :model="alterAgentForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-form-model-item :label="this.$t('admin.agent')">
            <a-input v-model="alterAgentForm.AgentName" @click="gainAgent" readOnly/>
          </a-form-model-item>
          <a-form-model-item :label="this.$t('admin.user')">
            <a-input v-model="alterAgentForm.userName" readOnly/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <!-- 代理商ID -->
      <a-modal v-model="agentDataVisible" :title="this.$t('admin.agent')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" :width="700" @ok='agentDataOK'>
        <a-table :columns="columnsAgent" :data-source="agentData" :row-key="record => record.id" class="tableLimit" :row-selection="{onChange:onSelectChange,type:'radio'}" :bordered="true" :pagination="false" :scroll="{ x: 600}">
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
          <span slot="status" slot-scope="text, row">
            {{ row.status == 0 ? $t('admin.normal') : $t('admin.Ban') }}
          </span>
          <span slot="agent_level" slot-scope="text, row">
            {{ row.agent_level | getLevel }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]}，${$t('admin.total')}:${agencyTotal}`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="agencyObj.page" :total="agencyTotal" @change="agencyCurrentChange" @showSizeChange="agencySizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
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
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]}，${$t('admin.total')}:${total}`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
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
// import { number } from 'echarts'
const columns = [{
  slotName: 'admin.username',
  dataIndex: 'username',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'username', title: 'admin.username' }
},
{
  // title: '状态',
  slotName: 'admin.state',
  dataIndex: 'status',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'status', title: 'admin.state' }
}, {
  // title: '角色',
  slotName: 'admin.role',
  dataIndex: 'role',
  width: '200px',
  align: 'center',
  role: [1],
  scopedSlots: { customRender: 'role', title: 'admin.role' }
},
{
  // title: '等级',
  slotName: 'admin.grade',
  dataIndex: 'agent_level',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'agent_level', title: 'admin.grade' }
},
{
  // title: '邮箱',
  slotName: 'admin.Mail',
  dataIndex: 'email',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'email', title: 'admin.Mail' }
},
{
  // title: '积分',
  slotName: 'admin.integral',
  dataIndex: 'points',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'points', title: 'admin.integral' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '700px',
  align: 'center',
  fixed: 'right',
  scopedSlots: { customRender: 'action', title: 'admin.operate' }
}
]
const columnsAgent = [{
  // title: '用户名',
  slotName: 'admin.username',
  dataIndex: 'username',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'username', title: 'admin.username' }
},
{
  // title: '等级',
  slotName: 'admin.grade',
  dataIndex: 'agent_level',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'agent_level', title: 'admin.grade' }
},
{
  // title: '积分',
  slotName: 'admin.integral',
  dataIndex: 'points',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'points', title: 'admin.integral' }
},
{
  // title: '状态',
  slotName: 'admin.state',
  dataIndex: 'status',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'status', title: 'admin.state' }
},
{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
}
]
const columnsAgency = [
  {
    // title: '代理用户名',
    slotName: 'admin.proxyUsername',
    dataIndex: 'username',
    width: '80px',
    align: 'center',
    scopedSlots: { customRender: 'username', title: 'admin.proxyUsername' }
  },
  {
    // title: '代理密码',
    slotName: 'admin.proxypassword',
    dataIndex: 'password',
    width: '80px',
    align: 'center',
    scopedSlots: { customRender: 'password', title: 'admin.proxypassword' }
  },
  {
    // title: '创建时间',
    slotName: 'admin.creationTime',
    dataIndex: 'created_at',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
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
      columnsAgent: columnsAgent,
      columnsAgency: [],
      dialogGroupId: false,
      dialogAdv: false,
      searchRole: 2,
      pagination: {},
      role: 0,
      nowData: {},
      OKbuttonDisplay: { style: { display: 'none' }},
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
      agencyObj: {
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      agencyTotal: 0,
      dialogVisible: false,
      addPortVisible: false,
      // 添加积分
      trafficForm: {
        user_id: 0,
        flow: 0
      },
      addTrafficVisible: false,
      addTrafficLoading: false, // 添加积分确定按钮
      // 查看代理
      checkAgencyVisible: false,
      // VIP等级
      levelVisible: false,
      // 修改代理商
      alterAgentVisible: false,
      agentDataVisible: false,
      agentData: [],
      alterAgentForm: {
        AgentName: '',
        AgentId: '',
        userName: '',
        userId: ''
      },
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
      addPortForm: {
        user_id: null,
        num: null,
        day: null
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
      levelForm: { agent_level: null }
    }
  },
  // eslint-disable-next-line vue/order-in-components
  filters: {
    getRole(value) {
      if (value === 0) return '用户'
      if (value === 1) return '管理员'
      if (value === 2) return '代理商'
      if (value === 3) return '号商'
      if (value === 4) return '客服'
      if (value === 5) return '审核员'
      // if (value === 6) return '会计'
    },
    getLevel(value) {
      if (value === 1) return '普通会员'
      if (value === 2) return '白银会员'
      if (value === 3) return '黄金会员'
      if (value === 4) return '钻石会员'
      // if (value === 5) return '五级VIP'
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
      this.getAgentLevelData()
      // await api.getAdConfig()
    },
    async getTableData() {
      let searchData = {}
      if (this.searchData.username === '') {
        this.searchData.username = null
      }
      searchData.page = this.searchData.page
      searchData.page_size = this.searchData.page_size
      searchData.role = this.searchData.role
      searchData.order_created_at = this.searchData.order_created_at
      searchData.username = this.searchData.username
      const res = await api.getAdmin(searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    // 查询端口等级
    getAgentLevelData() {
      api.getAgentLevel().then((res) => {
        if (res.code === 0) {
          this.levelList = res.data.data.map(item => {
            return { id: item.id, name: item.name }
          })
        }
      })
    },
    levelId(value) {
      this.form.level_id = value
    },
    levelAlter(value) {
      this.levelForm.agent_level = value
    },
    addAgentLevel() {
      let formas = {}
      formas = {
        name: this.agentLevelForm.name,
        describe: Number(this.agentLevelForm.describe),
        port_discount: Number(this.agentLevelForm.port_discount)
      }
      api.postAgentLevel(formas).then((res) => {
        if (res.code === 0) {
          this.agentLevelVisible = false
          this.agentLevelForm.name = null
          this.agentLevelForm.describe = null
          this.agentLevelForm.port_discount = null
          this.init()
        }
      })
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
    // 修改代理商
    alterAgent(res) {
      this.alterAgentVisible = true
      this.alterAgentForm.userName = res.username
      this.alterAgentForm.userId = res.id
    },
    // 获取代理商ID
    gainAgent() {
      this.agentDataVisible = true
      let agencyObj = {}
      agencyObj.page = this.agencyObj.page
      agencyObj.page_size = this.agencyObj.page_size
      agencyObj.role = 2
      agencyObj.order_created_at = this.agencyObj.order_created_at
      api.getAdmin(agencyObj).then(res => {
        if (res && res.code === 0 && res.data) {
          this.agentData = res.data.data
          this.agencyTotal = res.data.count
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    // 翻页
    agencyCurrentChange(page) {
      this.agencyObj.page = page
      this.gainAgent()
    },
    // 翻页
    agencySizeChange(p, s) {
      this.agencyObj.page = p
      this.agencyObj.page_size = s
      this.gainAgent()
    },
    onSelectChange(selectedRowKeys, value) {
      this.alterAgentForm.AgentName = value[0].username
      this.alterAgentForm.AgentId = value[0].id
    },
    agentDataOK() {
      this.agentDataVisible = false
      console.log(this.alterAgentForm)
    },
    // 提交 修改代理
    alterAgentSubmit() {
      let form = {}
      form.agent_id = this.alterAgentForm.AgentId
      form.user_id = this.alterAgentForm.userId
      api.putAdminUserAgent(form).then(res => {
        if (res.code === 0) {
          this.alterAgentVisible = false
          console.log(res)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    // 查看积分记录
    checkAgency(row) {
      this.checkAgencyVisible = true
      console.log(row)
      this.agencyId = row
      const data = {
        id: row
      }
      api.getPointsRecord(data).then((res) => {
        console.log(res)
      })
    },
    addAgency() {
      console.log(this.agencyId)
      const data = {
        user_id: this.agencyId
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
    // 添加积分
    addTraffic(id) {
      this.form.user_id = id
      this.addTrafficVisible = true
    },
    addTrafficApi() {
      this.addTrafficLoading = true
      const data = {
        user_id: this.form.user_id,
        points: Number(this.form.points),
        remarks: this.form.remarks
      }
      api.postPointsRecord(data).then((res) => {
        if (res.code === 0) {
          this.addTrafficLoading = false
          this.addTrafficVisible = false
          this.getTableData()
        }
      })
    },
    addUser() {
      this.form.username = this.form.username.trim()
      this.$refs['form'].validate(async valid => {
        let form = {}
        form.role = this.form.role
        form.username = this.form.username
        form.password = this.form.password
        form.email = this.form.email
        form.level_id = this.form.level_id
        if (valid) {
          api.addUserInter(form).then((res) => {
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
    editLevel(row) {
      this.levelForm = row
      this.levelVisible = true
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
    // VIP等级
    levelUser() {
      let levelForm = {}
      levelForm.level_id = this.levelForm.agent_level
      levelForm.user_id = this.levelForm.id
      api.postAgentLevelSet(levelForm).then(res => {
        if (res.code === 0) {
          this.levelVisible = false
          this.init()
        }
      })
    },
    checkSystem(id) {
      this.$router.push({
        name: 'system',
        query: {
          belong: id
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
    addPort(id) {
      this.addPortVisible = true
      this.addPortForm.user_id = id
    },
    addPortApi() {
      var postData = {
        user_id: parseInt(this.addPortForm.user_id),
        num: parseInt(this.addPortForm.num),
        day: parseInt(this.addPortForm.day)
      }
      api.postDevice(postData).then(res => {
        if (res.code === 0) {
          this.addPortVisible = false
          this.getTableData()
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
        console.log(res.data)
      }
    }
  }
}
</script>
