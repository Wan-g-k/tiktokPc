<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item v-if="role == 1" :label="this.$t('admin.type')">
          <a-select v-model="searchData.type" style="width:213px" allow-clear>
            <a-select-option :value="0">{{$t('admin.recharge')}}</a-select-option>
            <a-select-option :value="1">{{$t('admin.consumptionPortPurchase')}}</a-select-option>
            <a-select-option :value="2">{{$t('admin.consumptionAccountPurchase')}}</a-select-option>
            <a-select-option :value="3">{{$t('admin.consumptionTrafficPurchase')}}</a-select-option>
            <a-select-option :value="4">{{$t('admin.consumptionDial')}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="this.$t('admin.time')">
          <a-range-picker type="date" format="YYYY-MM-DD" @change="onChangePicker" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-left:10px;width:88px" @click="getTableData()">{{this.$t('admin.Inquire')}}</a-button> 
          <a-button type="primary" style="margin-left:10px;" @click="downloadPort()">{{this.$t('admin.PortInformationDownload')}}</a-button> 
          <a-button type="primary" style="margin-left:10px;" @click="downloadFlow()">{{this.$t('admin.TrafficInformationDownload')}}</a-button> 
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table v-if="role == 1" :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false" :scroll="{ x: 1500}">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="id" slot-scope="text, record">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ record.port_no }}</span>
            </template>
            <span>{{ record.id }}</span>
          </a-tooltip>
        </span>
        <span slot="type" slot-scope="text, row">
          <span v-if="row.type === 0">{{$t('admin.recharge')}}</span>
          <span v-if="row.type === 1">{{$t('admin.consumptionPortPurchase')}}</span>
          <span v-if="row.type === 2">{{$t('admin.consumptionAccountPurchase')}}</span>
          <span v-if="row.type === 3">{{$t('admin.consumptionTrafficPurchase')}}</span>
          <span v-if="row.type === 4">{{$t('admin.consumptionDial')}}</span>
        </span>
      </a-table>
      <div class="page">
        <a-pagination :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>

      <a-modal v-model="downloadVisible" :title="this.$t('admin.PortInformationDownload')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="downloadPortList">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <a-form-item :label="this.$t('admin.time')">
            <a-range-picker type="date" format="YYYY-MM-DD" @change="onChangeDownloadPort" />
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model="downloadFlowVisible" :title="this.$t('admin.TrafficInformationDownload')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="downloadFlowList">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <a-form-item :label="this.$t('admin.time')">
            <a-range-picker type="date" format="YYYY-MM-DD" @change="onChangeDownloadFlow" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'
import axios from 'axios' // 引入axios
const locale = {
  'lang': {
    'now': '当前',
    'select time': '选择日期',
    'Ok': '确认'
  }
}
const columns = [
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'type',
  width: '220px',
  align: 'center',
  scopedSlots: { customRender: 'type', title:'admin.operate' }
},
{
  // title: '操作员',
  slotName: 'admin.operator',
  dataIndex: 'target_username',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'target_username', title:'admin.operator' }
},
{
  // title: '操作对象',
  slotName: 'admin.operationTarget',
  dataIndex: 'username',
  width: '150px',
  align: 'center',
  scopedSlots: { customRender: 'username', title:'admin.operationTarget' }
},
{
  // title: '操作内容',
  slotName: 'admin.operationContent',
  dataIndex: 'content',
  width: '300px',
  align: 'center',
  scopedSlots: { customRender: 'content', title:'admin.operationContent' }
},
{
  // title: '时间',
  slotName: 'admin.time',
  dataIndex: 'created_at',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title:'admin.time' }
},
{
  // title: '数量',
  slotName: 'admin.quantity',
  dataIndex: 'quantity',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'quantity', title:'admin.quantity' }
},
{
  // title: '备注',
  slotName: 'admin.remark',
  dataIndex: 'remarks',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'remarks', title:'admin.remark' }
},
]
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
}
]
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      searchData: {
        port_no: null,
        page: 1,
        page_size: 10,
        type: null,
        order_id: true,
        name: null,
        belong: null,
        superiors_belong: null,
        order_created_at: true,
        before_created_at: null,
        after_created_at: null,
        user_id: null
      },
      agencyID: 0,
      locale: locale,
      mode1: 'time',
      columns: [],
      columnsAgency: [],
      tableData: [],
      agencyData: [],
      total: 0,
      size: 10,
      start_time: '',
      end_time: '',
      flow_start_time: '',
      flow_end_time: '',
      checkAgencyVisible: false,
      OKbuttonDisplay:{ style: { display: 'none' } },
      dialogVisible: false,
      dialogGroupId: false,
      downloadVisible: false,
      downloadFlowVisible: false,
      time: null,
      selectDataId: [],
      id: null,
      form: {
        id: '',
        port_no: '',
        day: 30,
        belong: '',
        expire_at: null
      },
      modifyForm: {
        port_no: '',
        available: true,
        belong: ''
      },
      searchRole: null,
      nowData: {},
      row: {},
    }
  },
  async mounted() {
    this.$route.query.belong
    this.id = this.$route.query.belong
    this.role = this.userInfo.data.r
    this.columns = []
    this.columnsAgency = []
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      if (this.role !== 1 && item.index && item.index === 10) {
        item.width = '200px'
      }
      if (this.role === 1 && item.index && item.index === 10) {
        item.fixed = 'right'
      }
      this.columns.push(item)
    })
    columnsAgency.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      if (this.role !== 1 && item.index && item.index === 10) {
        item.width = '200px'
      }
      if (this.role === 1 && item.index && item.index === 10) {
        item.fixed = 'right'
      }
      this.columnsAgency.push(item)
    })
    this.init()
  },
  methods: {
    async init() {
      this.searchData.page = 1
      this.searchData.user_id = this.id
      this.searchData.type = this.searchData.type
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getPointsRecord(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
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
        url:`${process.env.VUE_APP_BASE_API}/api/v1/admin/pointsRecord/exportPort`,
        method: 'post',
        data: {
          start_time: this.start_time,
          end_time: this.end_time
        }
      }).then(res => {
        const blob = new Blob(['\ufeff'+res.data])
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
        url:`${process.env.VUE_APP_BASE_API}/api/v1/admin/pointsRecord/exportFlow`,
        method: 'post',
        data: {
          start_time: this.flow_start_time,
          end_time: this.flow_end_time
        }
      }).then(res => {
        const blob = new Blob(['\ufeff'+res.data])
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
    // 时间选择
    onChangePicker(date, dateString) {
      let before = dateString[1]
      let after = dateString[0]
      if(before !== '' ||  after !== '') {
        this.searchData.before_created_at = new Date(before).toISOString()
        this.searchData.after_created_at = new Date(after).toISOString()
      } else {
        this.searchData.before_created_at = null
        this.searchData.after_created_at = null
      }
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
  }
}
</script>

<style lang="scss">
.ant-calendar-picker {
  min-width: 0 !important;
}
</style>
