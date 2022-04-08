<template class='searcahss'>
  <div>
    <div class="search-box">
      <div class="head">
        <a-row :gutter="30">
          <a-col :span="8">
            <div class="head-left">
              <a-col>
                <div class="head-left-logo">
                  <img src="../../assets/logoin-logo.svg">
                </div>
              </a-col>
              <div class="head-left-message">
                <div class="head-left-message-username">
                  <span>{{this.agentList.username}}</span>
                </div>
                <div class="head-left-message-role">
                  <img src="../../assets/代理.svg">
                  <span v-if="this.agentList.role === 3">{{$t('admin.supplier')}}</span>
                </div>
                <!-- <div class="head-left-message-level">
                  <img src="../../assets/VIP.svg">
                  <span v-if="this.agentList.agent_level === 1">一级VIP</span>
                  <span v-if="this.agentList.agent_level === 2">二级VIP</span>
                  <span v-if="this.agentList.agent_level === 3">三级VIP</span>
                  <span v-if="this.agentList.agent_level === 4">四级VIP</span>
                </div> -->
                <div class="head-left-message-email">
                  {{$t('admin.Mail')}}：<span >{{this.agentList.email === '' ? $t('admin.notSet'):this.agentList.email}}</span>
                </div>
              </div>
              <!-- <div class="head-left-flow" @click="purchaseFlow">
                <img src="../../assets/purchaseFlow.png">
              </div> -->
            </div>
          </a-col>
          <a-col :span="4">
            <div class="head-right">
              <a-row>
                <a-col :span="24">
                  <p class="sell">{{this.$t('dealer.soldToday')}}：<span class="amount">{{this.dealerList.today_sale}}</span></p>
                </a-col>
                <a-col :span="24">
                  <p class="sell">{{this.$t('dealer.soldLastMonth')}}：<span>{{this.dealerList.time_slice_count}}</span></p>
                </a-col>
                <a-col :span="24">
                  <p class="sell">{{this.$t('dealer.totalSold')}}：<span>{{this.dealerList.count_sale}}</span></p>
                </a-col>
              </a-row>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="head-right">
              <a-col :span="12">
                <div class="head-right-flow">
                  <a-col :span="10">{{this.$t('dealer.accountInventory')}}：</a-col>
                  <a-col :span="13"><div ref="account" class="account" style="width: 100%; height: 16vh;"></div></a-col>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="head-right-points">
                  <a-col :span="10">{{this.$t('dealer.remainingPoints')}}：</a-col>
                  <a-col :span="13"><div ref="integral" class="integral" style="width: 100%; height: 16vh;"></div></a-col>
                </div>
              </a-col>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 公告 -->
    <div class="table-box">
      <a-modal v-model="afficheVisible" width="50%" :title="title" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @cancel="handleCancel" @ok="handleOk">
        <div class="affiche">
          {{this.affiche}}
        </div>
      </a-modal>
      <a-row>
        <a-col :span="24">
          <a-tabs default-active-key="1" type="card" @change="callbackTabs">
            <a-tab-pane key="1" :tab="this.$t('admin.pointsRecord')">
              <a-table :columns="columns" :row-key="record => record.id" :data-source="tableData" :bordered="true" :pagination="false">
                <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
                  <span>{{ $t(item.slotName) }}</span>
                </templete>
                <span slot="created_at" slot-scope="text, row">
                  {{ new Date(row.created_at) | getTime }}
                </span>
                <span slot="type" slot-scope="text, row">
                  <span v-if="row.type === 0">{{$t('admin.recharge')}}</span>
                  <span v-if="row.type === 1">{{$t('admin.consumptionPortPurchase')}}</span>
                  <span v-if="row.type === 2">{{$t('admin.consumptionAccountPurchase')}}</span>
                  <span v-if="row.type === 3">{{$t('admin.consumptionTrafficPurchase')}}</span>
                  <span v-if="row.type === 4">{{$t('admin.consumptionDial')}}</span>
                </span>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
      <div class="page">
        <a-pagination :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
    <a-modal v-model="checkIntegralVisible" title="积分信息" width="600px" ok-text="确认" cancel-text="取消" @ok="init" @cancel='init' >
      <a-table :columns="columnsIntegral" :row-key="record => record.userid" :data-source="getIntegralData" :row-selection="{ selectedRowKeys: selectDataId, onChange: rowSelection }">
      </a-table>
    </a-modal>
    <statement-duty/>
  </div>
</template>

<script>
import * as api from '@/api/index'
import statementDuty from '../../components/statement/index.vue'
const columns = [{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: 150,
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
},
{
  // title: '操作类型',
  slotName: 'admin.type',
  dataIndex: 'type',
  width: '220px',
  align: 'center',
  scopedSlots: { customRender: 'type', title: 'admin.type' }
},
{
  // title: '操作用户',
  slotName: 'admin.operator',
  dataIndex: 'target_username',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'target_username', title: 'admin.operator' }
},
{
  // title: '操作内容',
  slotName: 'admin.operationContent',
  dataIndex: 'content',
  width: '300px',
  align: 'center',
  scopedSlots: { customRender: 'content', title: 'admin.operationContent' }
},
{
  // title: '积分',
  slotName: 'admin.integral',
  dataIndex: 'quantity',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'content', title: 'admin.integral' }
},
{
  // title: '备注',
  slotName: 'admin.remark',
  dataIndex: 'remarks',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'remarks', title: 'admin.remark' }
}
]
const columnsFlow = [{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: 150,
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
},
{
  title: '操作类型',
  dataIndex: 'type',
  width: '220px',
  align: 'center',
  scopedSlots: { customRender: 'type' }
},
{
  title: '操作用户',
  dataIndex: 'username',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'username' }
},
{
  title: '操作内容',
  dataIndex: 'content',
  width: '300px',
  align: 'center',
  scopedSlots: { customRender: 'content' }
},
{
  title: '积分',
  dataIndex: 'quantity',
  width: '80px',
  align: 'center'
},
{
  title: '备注',
  dataIndex: 'remarks',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'remarks' }
}
]
const columnsIntegral = [
  {
    title: '项目名称',
    dataIndex: 'Integral_name',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'Integral_name' }
  },
  {
    title: '积分明细',
    dataIndex: 'account_details',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'account_details' }
  },
  {
    title: '时间',
    dataIndex: 'account_time',
    width: '60px',
    align: 'center',
    scopedSlots: { customRender: 'account_time' }
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
      getIntegralData: [
        {
          userid: 0,
          account_id: 0,
          Integral_name: '端口新开扣除',
          account_details: 3000,
          account_time: '2021-10-13 19:25:49'
        },
        {
          userid: 1,
          account_id: 1,
          Integral_name: '端口续费扣除',
          account_details: 1000,
          account_time: '2021-10-10 19:25:49'
        },
        {
          userid: 2,
          account_id: 2,
          Integral_name: '端口续费扣除',
          account_details: 2000,
          account_time: '2021-09-25 19:25:49'
        },
        {
          userid: 3,
          account_id: 3,
          Integral_name: '端口新开扣除',
          account_details: 1000,
          account_time: '2021-08-26 19:25:49'
        }
      ],
      agentList: {
        agent_level: 0,
        points: 0,
        email: '',
        username: ''
      },
      dealerList: {
        account_stock: 0,
        count_sale: 0,
        point_count: 0,
        second_point: 0,
        today_sale: 0
      },
      columnsFlow: columnsFlow,
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
      title: null
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
      this.getQuerySale()
      this.getTableData()
      this.getUserData()
    },
    getTableData() {
      let searchData = {}
      searchData.page = this.searchData.page
      searchData.page_size = this.searchData.page_size
      searchData.order_created_at = this.searchData.order_created_at
      searchData.user_id = this.user_id
      api.getDealerPointsRecord(searchData).then((res) => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.total = res.data.count
        } else {
          this.message.error(res.data.message)
        }
      })
    },
    getQuerySale() {
      let newData = new Date()
      let FullYear = newData.getFullYear()
      let Month = newData.getMonth() + 1
      let start = ''
      let end = ''
      if (Month === 1) {
        start = FullYear - 1 + '-' + 12 + '-' + '01'
        end = FullYear + '-' + '0' + Month + '-' + '01'
      } else if (Month < 10) {
        let Months = Month - 1
        start = FullYear + '-' + '0' + Months + '-' + '01'
        end = FullYear + '-' + '0' + Month + '-' + '01'
      } else if(Month === 10) {
        let Months = Month - 1
        start = FullYear + '-' + '0' + Months + '-' + '01'
        end = FullYear + '-' + Month + '-' + '01'
      } else {
        let Months = Month - 1
        start = FullYear + '-' + Months + '-' + '01'
        end = FullYear + '-' + Month + '-' + '01'
      }
      let form = {}
      form.user_id = this.user_id
      form.start = start
      form.end = end
      api.getDealerQuerySale(form).then(res => {
        if (res.code === 0) {
          this.dealerList = res.data
          this.getEchartsData()
        }
      })
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
    getEchartsData() {
      const accounts = this.$refs.account
      const integral = this.$refs.integral
      if (accounts) {
        let myAccount = this.$echarts.init(accounts)
        let option = {
          tooltip: {
            trigger: 'item',
            show: false
          },
          title: {
            text: this.dealerList.account_stock,
            top: '45%',
            left: 'center',
            textStyle: {
              color: '#3598F1',
              fontSize: 22
            }
          },
          legend: {
            show: false
          },
          series: [
            {
              type: 'pie',
              radius: ['60%', '80%'],
              hoverAnimation: false,
              avoidLabelOverlap: false,
              selectedMode: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              itemStyle: {
                normal: {
                  color: '#3598F1'
                }
              },
              data: [
                { value: this.dealerList.account_stock }
              ]
            }
          ]
        }
        myAccount.setOption(option)
        window.addEventListener('resize', function() {
          myAccount.resize()
        })
      }
      if (integral) {
        let myIntegral = this.$echarts.init(integral)
        let option = {
          legend: {
            top: '1%',
            left: 'center'
          },
          series: [
            {
              type: 'gauge',
              startAngle: 90,
              endAngle: -270,
              radius: '80%',
              pointer: {
                show: false
              },
              progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                  borderWidth: 1,
                  color: '#FFA86D',
                  borderColor: '#464646'
                }
              },
              axisLine: {
                lineStyle: {
                  color: [[1, '#3598F1']],
                  width: 13
                }
              },
              splitLine: {
                show: false,
                distance: 0,
                length: 2
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false,
                distance: 50
              },
              data: [
                {
                  value: (this.dealerList.second_point/this.dealerList.point_count*100).toFixed(0)
                }
              ],
              detail: {
                // width: 100,
                // height: 14,
                valueAnimation: false,
                offsetCenter: ['0%', '0%'],
                fontSize: 22,
                color: 'auto',
                formatter: `${this.dealerList.second_point}`
              }
            }
          ]
        }
        myIntegral.setOption(option)
        window.addEventListener('resize', function() {
          myIntegral.resize()
        })
      }
    },
    handleOk() {
      this.afficheVisible = false
      window.sessionStorage.setItem('visible', this.afficheVisible)
    },
    handleCancel() {
      this.afficheVisible = false
      window.sessionStorage.setItem('visible', this.afficheVisible)
    },
    getTableTrafficData() {
      let trafficData = {}
      trafficData.type = this.trafficData.type
      trafficData.page = this.trafficData.page
      trafficData.username = this.trafficData.username
      trafficData.page_size = this.trafficData.page_size
      trafficData.order_created_at = this.trafficData.order_created_at
      api.getAgentRecordGet(trafficData).then((res) => {
        if (res.code === 0) {
          console.log(res)
          this.tableData = res.data.Data
          this.total = res.data.count
        } else {
          this.message.error(res.data.message)
        }
      })
    },
    getUserData() {
      let searchData = {}
      searchData.id = this.user_id
      api.getDealer(searchData).then((res) => {
        if (res.code === 0) {
          this.agentList = res.data.data[0]
        } else {
          this.message.error(res.data.message)
        }
      })
    },
    // 记录切换
    callbackTabs(key) {
      if (key === '1') {
        this.searchData.page = 1
        this.searchData.page_size = 10
        this.getTableData()
      } else {
        this.trafficData.page = 1
        this.trafficData.page_size = 10
        this.getTableTrafficData()
      }
      console.log(key)
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
      const data = {
        flow: Number(this.FlowForm.flow)
      }
      api.postAgencyBuy(data).then((res) => {
        if (res.code === 0) {
          this.purchaseFlowVisible = false
          this.init()
        } else {
          this.message.error(res.data.message)
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
    // 查看积分记录
    checkIntegralView() {
      this.checkIntegralVisible = true
      this.columnsIntegral = []
      columnsIntegral.forEach(item => {
        this.columnsIntegral.push(item)
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
  height: 15vh;
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
        font-size: 1.6vw;
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
      width: 13vw;
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
  height: 15vh;
  .head-right-flow{
    font-size: 1.2vw;
    font-weight: 700;
    color: #3598F1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .head-right-points{
    font-size: 1.2vw;
    font-weight: 700;
    color: #FF9900;
    display: flex;
    align-items: center;
    justify-content: center;
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
.sell{
  font-size: 1vw;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 1vw;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  span{
    font-size: 1.2vw;
    font-weight: 600;
  }
  .amount{
    color: #207967;
  }
}
</style>