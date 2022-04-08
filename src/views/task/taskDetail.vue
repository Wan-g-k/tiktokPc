<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>{{this.$t('user.taskManagement')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{this.$t('user.taskInformation')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :loading="tableLoading" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="status" slot-scope="text, row">
          <span :title="row.status === $t('user.failureRiskControl') ? $t('user.messageIntercepted') : row.status">
            {{row.status === $t('user.failureRiskControl') ? $t('user.messageIntercepted') : row.status}}
          </span>
        </span>
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
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
const columns = [{
  // title: '日志时间',
  slotName: 'user.logTime',
  dataIndex: 'created_at',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title:'user.logTime' }
},
{
  // title: '任务ID',
  slotName: 'user.taskID',
  dataIndex: 'task_id',
  align: 'center',
  scopedSlots: { customRender: 'task_id', title:'user.taskID' }
},
{
  // title: '目标账号',
  slotName: 'user.targetAccount',
  dataIndex: 'nickname',
  align: 'center',
  scopedSlots: { customRender: 'nickname', title:'user.targetAccount' }
},
{
  // title: '目标用户',
  slotName: 'user.targetUsers',
  dataIndex: 'unique_id',
  align: 'center',
  scopedSlots: { customRender: 'unique_id', title:'user.targetUsers' }
},
{
  // title: '地区',
  slotName: 'user.area',
  dataIndex: 'region',
  align: 'center',
  scopedSlots: { customRender: 'region', title:'user.area' }
},
{
  // title: '是否成功',
  slotName: 'user.whetherSucceed',
  dataIndex: 'status',
  width: '600px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'status', title:'user.whetherSucceed' }
}]
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        page: 1,
        order_created_at: true,
        task_id: ''
      },
      columns: columns,
      tableData: [],
      total: 0,
      size: 10,
      dialogVisible: false,
      tableLoading: true,
      modifyDialogVisible: false,
      form: {},
      modifyForm: {}
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.searchData.task_id = this.$route.query.id
      this.searchData.page = 1
      this.getTableData()
    },
    async getTableData() {
      this.tableLoading = true
      const res = await api.getAccountRecordUser(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableLoading = false
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box {
  margin-top: 30px;
}
</style>
