<template class="searcahss">
  <div>
    <div class="search-box">
      <div class="head">
        <a-row :gutter="30">
          <a-col :span="12">
            <div class="head-left">
              <a-col>
                <div class="head-left-logo">
                  <img src="../../assets/logoin-logo.svg">
                </div>
              </a-col>
              <div class="head-left-message">
                <div class="head-left-message-username">
                  <span>{{ this.agentList.username }}</span>
                </div>
                <div class="head-left-message-role">
                  <img src="../../assets/代理.svg">
                  <span v-if="this.agentList.role === 2">{{ $t('agent.agent') }}</span>
                </div>
                <div class="head-left-message-level">
                  <img src="../../assets/VIP.svg">
                  <span v-if="this.agentList.agent_level === 1">普通会员</span>
                  <span v-if="this.agentList.agent_level === 2">白银会员</span>
                  <span v-if="this.agentList.agent_level === 3">黄金会员</span>
                  <span v-if="this.agentList.agent_level === 4">钻石会员</span>
                </div>
                <div class="head-left-message-email">
                  {{ $t('agent.mailbox') }}：<span>{{ this.agentList.email === '' ? this.$t('agent.notSet') :this.agentList.email }}</span>
                </div>
              </div>
              <div class="head-left-flow" @click="purchaseFlow">
                <img src="../../assets/purchaseFlow.png">
              </div>
            </div>
          </a-col>
          <a-col>
            <a-col :span="12">
              <div class="head-right">
                <div class="head-right-flow">{{ $t('agent.surplusFlow') }} ：<span>{{ this.agentList.flow }}M</span></div>
                <div class="head-right-points">{{ $t('agent.IntegralRemaining') }} ：<span>{{ this.agentList.points }}</span></div>
              </div>
            </a-col>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="table-box">
      <a-modal v-model="afficheVisible" width="50%" :title="title" :ok-text="this.$t('agent.confirm')" :cancel-text="this.$t('agent.cancel')" @cancel="handleCancel" @ok="handleOk">
        <div class="affiche">
          {{ this.affiche }}
        </div>
      </a-modal>
      <a-row>
        <a-col :span="24">
          <a-tabs default-active-key="1" type="card" @change="callbackTabs">
            <a-tab-pane key="1" :tab=" this.$t('agent.IntegralRecord') ">
              <a-table :columns="columns" :row-key="record => record.id" :data-source="tableData" :bordered="true" :pagination="false">
                <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
                  <span>{{ $t(item.slotName) }}</span>
                </templete>
                <span slot="type" slot-scope="text, row">
                  <span v-if="row.type === 0">{{ $t('agent.topUp') }}</span>
                  <span v-if="row.type === 1">{{ $t('agent.consumption') }}</span>
                  <span v-if="row.type === 2">{{ $t('agent.purchase') }}</span>
                  <span v-if="row.type === 3">{{ $t('agent.ConsumerPurchase') }}</span>
                  <span v-if="row.type === 4">{{ $t('agent.ConsumerDialing') }}</span>
                </span>
                <span slot="created_at" slot-scope="text, row">
                  {{ new Date(row.created_at) | getTime }}
                </span>
              </a-table>
              <div class="page">
                <a-pagination v-if="IntegralVisible" v-model="IntegralVisible" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
                  <template slot="buildOptionText" slot-scope="props">
                    <span>{{ props.value }}条/页</span>
                  </template>
                </a-pagination>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" :tab=" this.$t('agent.TrafficRecords') ">
              <a-table :columns="columnsFlow" :row-key="record => record.id" :data-source="tableData" :bordered="true" :pagination="false">
                <templete v-for="(item, index) in columnsFlow" :key="index" :slot="item.slotName">
                  <span>{{ $t(item.slotName) }}</span>
                </templete>
                <span slot="type" slot-scope="text, row">
                  <span v-if="row.type === 0">{{ $t('agent.topUp') }}</span>
                  <span v-if="row.type === 1">{{ $t('agent.consumption') }}</span>
                  <span v-if="row.type === 2">{{ $t('agent.purchase') }}</span>
                  <span v-if="row.type === 3">{{ $t('agent.ConsumerPurchase') }}</span>
                  <span v-if="row.type === 4">{{ $t('agent.ConsumerDialing') }}</span>
                </span>
                <span slot="created_at" slot-scope="text, row">
                  {{ new Date(row.created_at) | getTime }}
                </span>
              </a-table>
              <div class="page">
                <a-pagination v-if="flowVisible" v-model="flowVisible" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :show-total="(trafficTotal, range) => `${range[0]}-${range[1]} 条，总数:${trafficTotal} 条`" :default-current="1" :current="trafficData.page" :total="trafficTotal" @change="handleCurrentChangeTraffic" @showSizeChange="handleSizeChangeTraffic">
                  <template slot="buildOptionText" slot-scope="props">
                    <span>{{ props.value }}条/页</span>
                  </template>
                </a-pagination>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" :tab=" this.$t('agent.RowNumberRecord') ">
              <a-table :columns="columnsIntegral" :row-key="record => record.id" :data-source="tableData" :bordered="true" :pagination="false">
                <templete v-for="(item, index) in columnsIntegral" :key="index" :slot="item.slotName">
                  <span>{{ $t(item.slotName) }}</span>
                </templete>
                <span slot="created_at" slot-scope="text, row">
                  {{ new Date(row.created_at) | getTime }}
                </span>
              </a-table>
              <div class="page">
                <a-pagination v-if="divisionVisible" v-model="divisionVisible" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :show-total="(divisionTotal, range) => `${range[0]}-${range[1]} 条，总数:${divisionTotal} 条`" :default-current="1" :current="divisionForm.page" :total="divisionTotal" @change="handleCurrentChangeDivision" @showSizeChange="handleSizeChangeDivision">
                  <template slot="buildOptionText" slot-scope="props">
                    <span>{{ props.value }}条/页</span>
                  </template>
                </a-pagination>
              </div>
            </a-tab-pane>
          <a-tab-pane key="4" tab="数据下载" >
            <a-button type="primary" style="margin-left:10px;" @click="downloadPort()">端口信息下载</a-button>
            <a-button type="primary" style="margin-left:10px;" @click="downloadFlow()">流量信息下载</a-button>
          </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>

    </div>
    <!-- 购买流量 -->
    <a-modal v-model="purchaseFlowVisible" :title="$t('agent.BuyTraffic')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="purchaseFlowApi">
      <a-form-model ref="form" layout="horizontal" :model="FlowForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item :label="$t('agent.flow')" prop="flow">
          <a-input v-model="FlowForm.flow" />
        </a-form-model-item>
      </a-form-model>
      <span slot="footer">
        <a-button style="margin-left:10px;" class="add-btn" type="success" @click="purchaseFlowVisible = false">{{$t('admin.cancel')}}</a-button>
        <a-button style="margin-left:10px;" type="primary" :loading="purchaseLoading" @click="purchaseFlowApi">{{$t('admin.confirm')}}</a-button>
      </span>
    </a-modal>

    <a-modal v-model="topUpVisible" title="积分充值" width="600px" ok-text="确认" cancel-text="取消" @ok="topUpsubmit()">
      <a-form :model="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="积分余额">
          <a-input v-model="form.allowance" read-only />
        </a-form-item>
        <a-form-item label="账号ID">
          <a-input v-model="form.accountId" />
        </a-form-item>
        <a-form-item label="积分数量">
          <a-input v-model="form.amount" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model="form.remarks" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model="downloadVisible" title="端口信息下载" width="500px" ok-text="确认" cancel-text="取消" @ok="downloadPortList">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="时间">
          <a-range-picker type="date" :placeholder="['开始时间', '结束时间']" format="YYYY-MM-DD" @change="onChangeDownloadPort" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal v-model="downloadFlowVisible" title="流量信息下载" width="500px" ok-text="确认" cancel-text="取消" @ok="downloadFlowList">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="时间">
          <a-range-picker type="date" :placeholder="['开始时间', '结束时间']" format="YYYY-MM-DD" @change="onChangeDownloadFlow" />
        </a-form-item>
      </a-form>
    </a-modal>
    <statement-duty />
  </div>
</template>

<script>
import * as api from '@/api/index'
import statementDuty from '../../components/statement/index.vue'
import axios from 'axios' // 引入axios
const columns = [
  {
    // title: '操作类型',
    slotName: 'agent.handleType',
    dataIndex: 'type',
    width: '220px',
    align: 'center',
    scopedSlots: { customRender: 'type', title: 'agent.handleType' }
  },
  {
    // title: '被操作用户',
    slotName: 'agent.OperatedUser',
    dataIndex: 'target_username',
    width: '150px',
    align: 'center',
    scopedSlots: { customRender: 'target_username', title: 'agent.OperatedUser' }
  },
  {
    // title: '操作内容',
    slotName: 'agent.OperationalContext',
    dataIndex: 'content',
    width: '300px',
    align: 'center',
    scopedSlots: { customRender: 'content', title: 'agent.OperationalContext' }
  },
  {
    // title: '积分',
    slotName: 'agent.integral',
    dataIndex: 'quantity',
    width: '80px',
    align: 'center',
    scopedSlots: { customRender: 'content', title: 'agent.integral' }
  },
  {
    // title: '时间',
    slotName: 'agent.time',
    dataIndex: 'created_at',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title: 'agent.time' }
  },
  {
    // title: '备注',
    slotName: 'agent.remark',
    dataIndex: 'remarks',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'remarks', title: 'agent.remark' }
  }
]
const columnsFlow = [
  {
    // title: '操作类型',
    slotName: 'agent.handleType',
    dataIndex: 'type',
    width: '220px',
    align: 'center',
    scopedSlots: { customRender: 'type', title: 'agent.handleType' }
  },
  {
    // title: '被操作用户',
    slotName: 'agent.OperatedUser',
    dataIndex: 'username',
    width: '150px',
    align: 'center',
    scopedSlots: { customRender: 'username', title: 'agent.OperatedUser' }
  },
  {
    // title: '操作内容',
    slotName: 'agent.OperationalContext',
    dataIndex: 'content',
    width: '300px',
    align: 'center',
    scopedSlots: { customRender: 'content', title: 'agent.OperationalContext' }
  },
  {
    // title: '流量',
    slotName: 'agent.flowM',
    dataIndex: 'quantity',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'quantity', title: 'agent.flowM' }
  },
  {
    slotName: 'agent.time',
    dataIndex: 'created_at',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title: 'agent.time' }
  },
  {
    // title: '备注',
    slotName: 'agent.remark',
    dataIndex: 'remarks',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'remarks', title: 'agent.remark' }
  }
]
const columnsIntegral = [
  {
    // title: '目标用户',
    slotName: 'agent.targetUser',
    dataIndex: 'target_username',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'target_username', title: 'agent.targetUser' }
  },
  {
    // title: '账号数量',
    slotName: 'agent.AccountNumber',
    dataIndex: 'quantity',
    width: '150px',
    align: 'center',
    scopedSlots: { customRender: 'quantity', title: 'agent.AccountNumber' }
  },
  {
    // title: '备注',
    slotName: 'agent.remark',
    dataIndex: 'remarks',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'remarks', title: 'agent.remark' }
  },
  {
    // title: '时间',
    slotName: 'agent.time',
    dataIndex: 'created_at',
    width: '200px',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title: 'agent.time' }
  }
]
export default {
  components: {
    statementDuty
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      columns: [],
      columnsIntegral: [],
      tableData: [],
      agentList: {
        agent_level: 0,
        points: 0
      },
      columnsFlow: columnsFlow,
      IntegralVisible: false,
      flowVisible: false,
      divisionVisible: false,
      purchaseLoading: false,
      searchData: {
        _like_r_username: null,
        username: null,
        role: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      trafficData: {
        _like_r_username: null,
        username: null,
        role: null,
        type: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      divisionForm: {
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      user_id: null,
      form: {
        allowance: 3000,
        accountId: 12,
        amount: 2000,
        remarks: ''
      },
      FlowForm: {
        flow: 0
      },
      total: 0,
      trafficTotal: 0,
      divisionTotal: 0,
      query: {
        account_name: '',
        account_number: null,
        account_id: null
      },
      selectDataId: [],
      selectData: [],
      purchaseFlowVisible: false,
      checkIntegralVisible: false, // 查看积分记录
      topUpVisible: false, // 充值积分
      afficheVisible: false,
      affiche: null,
      title: null,
      start_time: '',
      end_time: '',
      flow_start_time: '',
      flow_end_time: '',
      downloadVisible: false,
      downloadFlowVisible: false
    }
  },
  mounted() {
    this.getPublish()
    this.init()
  },
  methods: {
    init() {
      this.user_id = this.userInfo.data.i
      this.checkIntegralVisible = false
      this.columns = []
      columns.forEach(item => {
        this.columns.push(item)
      })
      this.columnsIntegral = []
      columnsIntegral.forEach(item => {
        this.columnsIntegral.push(item)
      })

      this.getTableData()
      this.getUserData()
    },
    // 积分记录
    getTableData() {
      this.IntegralVisible = true
      this.flowVisible = false
      this.divisionVisible = false
      const searchData = {}
      searchData.page = this.searchData.page
      searchData.page_size = this.searchData.page_size
      searchData.order_created_at = this.searchData.order_created_at
      searchData.user_id = this.user_id
      api.getAgentPointsRecord(searchData).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.total = res.data.count
        } else {
          message.error(res.data.message)
        }
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

    getPublish() {
      api.getPublish().then(res => {
        if (res.code === 0 && res.data.data.length > 0) {
          this.affiche = res.data.data[0].content
          this.title = res.data.data[0].title
          this.afficheVisible = JSON.parse(window.sessionStorage.getItem('visible'))
        }
      })
    },
    handleOk() {
      this.afficheVisible = false
      window.sessionStorage.setItem('visible', this.afficheVisible)
    },
    handleCancel() {
      this.afficheVisible = false
      window.sessionStorage.setItem('visible', this.afficheVisible)
    },
    // 流量记录
    getTableTrafficData() {
      const trafficData = {}
      trafficData.type = this.trafficData.type
      trafficData.page = this.trafficData.page
      trafficData.username = this.trafficData.username
      trafficData.page_size = this.trafficData.page_size
      trafficData.order_created_at = this.trafficData.order_created_at
      trafficData.admin_target = this.user_id
      api.getAgentRecordGet(trafficData).then((res) => {
        if (res.code === 0) {
          // console.log(res)
          this.tableData = res.data.Data
          this.trafficTotal = res.data.count
        } else {
          message.error(res.data.message)
        }
      })
    },
    handleCurrentChangeTraffic(page) {
      this.trafficData.page = page
      this.getTableTrafficData()
    },
    handleSizeChangeTraffic(p, s) {
      this.trafficData.page = 1
      this.trafficData.page_size = s
      this.getTableTrafficData()
    },
    // 用户信息
    getUserData() {
      const searchData = {}
      searchData.id = this.user_id
      api.getAgent(searchData).then((res) => {
        if (res.code === 0) {
          this.agentList = res.data.data[0]
        } else {
          message.error(res.data.message)
        }
      })
    },
    // 划号记录
    divisionTableData() {
      const form = {}
      form.page = this.divisionForm.page
      form.page_size = this.divisionForm.page_size
      form.order_created_at = this.divisionForm.order_created_at
      form.admin_target = this.user_id
      api.getAgentAssignAccountRecord(form).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.divisionTotal = res.data.count
        }
      }).catch(err => {
        this.$message.error('请重新刷新页面')
      })
    },
    handleCurrentChangeDivision(page) {
      this.divisionForm.page = page
      this.divisionTableData()
    },
    handleSizeChangeDivision(p, s) {
      this.divisionForm.page = 1
      this.divisionForm.page_size = s
      this.divisionTableData()
    },

    // 下载端口信息
    downloadPort() {
      this.downloadVisible = true
    },
    onChangeDownloadPort(date, dateString) {
      let start_time = ''
      let end_time = ''
      start_time = dateString[0]
      end_time = dateString[1]
      this.start_time = new Date(start_time).toISOString()
      this.end_time = new Date(end_time).toISOString()
    },
    downloadPortList() {
      axios({
        url: `${process.env.VUE_APP_BASE_API}/api/v1/agent/pointsRecord/exportPort`,
        method: 'post',
        data: {
          start_time: this.start_time,
          end_time: this.end_time
        }
      }).then(res => {
        const blob = new Blob(['\ufeff' + res.data])
        const fileName = 'export_data.csv'
        const link = document.createElement('a')
        link.download = fileName
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
        this.downloadVisible = false
      })
    },

    // 下载流量信息
    downloadFlow() {
      this.downloadFlowVisible = true
    },
    onChangeDownloadFlow(date, dateString) {
      let start_time = ''
      let end_time = ''
      start_time = dateString[0]
      end_time = dateString[1]
      this.flow_start_time = new Date(start_time).toISOString()
      this.flow_end_time = new Date(end_time).toISOString()
    },
    downloadFlowList() {
      axios({
        url: `${process.env.VUE_APP_BASE_API}/api/v1/agent/pointsRecord/exportFlow`,
        method: 'post',
        data: {
          start_time: this.flow_start_time,
          end_time: this.flow_end_time
        }
      }).then(res => {
        const blob = new Blob(['\ufeff' + res.data])
        const fileName = 'export_flow_data.csv'
        const link = document.createElement('a')
        link.download = fileName
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(link.href)
        document.body.removeChild(link)
        this.downloadFlowVisible = false
      })
    },
    // 记录切换
    callbackTabs(key) {
      if (key === '1') {
        this.IntegralVisible = true
        this.flowVisible = false
        this.divisionVisible = false
        this.searchData.page = 1
        this.searchData.page_size = 10
        this.getTableData()
      } else if (key === '2') {
        this.IntegralVisible = false
        this.flowVisible = true
        this.divisionVisible = false
        this.trafficData.page = 1
        this.trafficData.page_size = 10
        this.getTableTrafficData()
      } else {
        this.IntegralVisible = false
        this.flowVisible = false
        this.divisionVisible = true
        this.divisionForm.page = 1
        this.divisionForm.page_size = 10
        this.divisionTableData()
      }
    },
    rowSelection(selectedRowKeys, values) {
      this.selectDataId = []
      this.selectData = []
      selectedRowKeys.forEach(item => {
        this.selectDataId.push(item)
      })
      values.forEach(item => {
        this.selectData.push(item)
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
          message.error(res.data.message)
        }
      })
    },

    // 充值积分 显示
    topUpView() {
      this.topUpVisible = true
    },
    // 充值积分 提交
    topUpsubmit() {
      this.topUpVisible = false
    }
  }
}
</script>

<style lang="scss">
.ant-calendar-picker {
  min-width: 0 !important;
}

.head-left {
  display: flex;
  box-shadow: 0px 3px 10px #00000029;
  background: #fff;
  border-radius: 15px;
  padding: 1.6vh 2vw 1.3vh 1vw;
  height: 17vh;
  .head-left-logo{
    img{
      width: 6vw;
      height: 6vw;
    }
  }
  .head-left-message{
    margin: 0vw 0vw 1vw 2vw;
    .head-left-message-username{
      span{
        font-size: 1.5vw;
        color: #000;
        font-weight: 600;
      }

    }
    .head-left-message-role{
      background: #f1f1f1;
      border-radius: 1vw;
      color: #3598F1;
      margin-bottom: .5vw;
      width: 10vw;
      font-size: .8vw;
      img{
        margin-left: .5vw;
        margin-right: .5vw;
        width: 1vw;
        height: 1vw;
      }
    }
    .head-left-message-level{
      background: #f1f1f1;
      border-radius: 1vw;
      color: #3598F1;
      width: 10vw;
      margin-bottom: .5vw;
      font-size: .8vw;
      img{
        margin-left: .5vw;
        margin-right: .5vw;
        width: 1vw;
        height: 1vw;
      }
    }
    .head-left-message-email{
      color: #9B9B9B;
      border-radius: 1vw;
      padding-left: .5vw;
    }
  }
  .head-left-flow {
    width: 10vw;
    height: 3vw;
    margin-left: 3vw;
    margin-top: 3vh;
    cursor: pointer;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
.head-right{
  display: flex;
  box-shadow: 0px 3px 10px #00000029;
  background: #fff;
  border-radius: 15px;
  padding: 1.6vh 2vw 1.3vh 1vw;
  height: 17vh;
  .head-right-flow{
    font-size: 1.2vw;
    font-weight: 700;
    color: #3598F1;
    width: 50%;
    text-align: center;
    margin: 4.6vh 0px;
    span{
      color: #000;
    }
  }
  .head-right-points{
    font-size: 1.2vw;
    font-weight: 700;
    color: #FF9900;
    width: 50%;
    text-align: center;
    margin: 4.6vh 0px;
    span{
      color: #000;
    }
  }
}
.affiche{
  white-space: pre-wrap;
  background: #FFCFAF1C 0% 0% no-repeat padding-box;
  border: 1px solid #FFC9A7A8;
  border-radius: 10px;
  opacity: 1;
  padding: 10px;
}
</style>
