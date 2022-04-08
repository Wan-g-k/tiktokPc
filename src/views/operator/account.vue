<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('dealer.userNickname')">
          <a-input v-model="searchData.nickname" :placeholder="this.$t('dealer.userNickname')" allow-clear />
        </a-form-item>
        <!-- <a-form-item label="ID">
          <a-input v-model="searchData.id" placeholder="请输入ID" allow-clear />
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          <!-- <a-button type="primary" style="margin-left:10px;" @click="SellingAccount">账号出售</a-button> -->
          <a-button type="primary" style="margin-left:10px;" @click="divisionAccoun">{{this.$t('dealer.assignAccount')}}</a-button>
          <a-button type="danger" style="margin-left:10px;" @click="deleteUpdate">{{this.$t('dealer.batchDeletion')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <p v-if="this.selectPortDataId.length > 0">{{this.$t('dealer.accountSelected')}}：{{this.selectPortDataId.length}}</p>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :scroll="{ x: 1200}" :row-selection="{ selectedRowKeys: selectPortDataId, onChange: rowSelectionPort }" class="tableLimit" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="avatar" slot-scope="text, row ">
          <a-avatar :src="row.avatar" />
          <p>{{ row.nickname }}</p>
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" type="danger" @click="accountDelete(row.id)">{{$t('admin.delete')}}</a-button>
          <a-button style="margin-left: 10px; margin-top: 5px" type="primary" @click="tokenPage(row.id)">{{ $t('user.viewToken') }}</a-button>
        </span>
      </a-table>
      <!-- 公告 -->
      <a-modal v-model="afficheVisible" width="50%" :title="title" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @cancel="handleCancel" @ok="handleOk">
      <div class="affiche">
        {{this.affiche}}
      </div>
    </a-modal>
      <!-- 划分账号 -->
      <a-modal v-model="divisionVisible" :title="this.$t('dealer.assignAccount')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="divisionAccounSubmit">
        <a-form ref="form" :model="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
          <a-form-item label="代理商">
            <a-input v-model="form.username" @click="divisionView" readOnly />
          </a-form-item>
        </a-form>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="divisionVisible = false">{{this.$t('admin.cancel')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="divisionLoading" @click="divisionAccounSubmit">{{this.$t('admin.confirm')}}</a-button>
        </span>
      </a-modal>
      <!-- 代理商信息 -->
      <a-modal v-if="informationVisible" v-model="informationVisible" title="用户信息" width="700px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="informationSubmit">
        <a-form layout="inline" class="demo-form-inline">
          <a-form-item label="用户名">
            <a-input v-model="username" placeholder="请输入用户名" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="getSelectTableData">查询</a-button>
          </a-form-item>
        </a-form>
        <a-table :columns="columnsSelect" :row-key="record => record.id" :data-source="tableSelectData" :row-selection="{ selectedRowKeys: selectDataId, onChange: rowSelection,type:'radio' }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsSelect" :key="index" :slot="item.slotName">
            <span>{{$t(item.slotName)}}</span>
          </templete>
          <span slot="status" slot-scope="text, row">
            {{ row.status == 0 ? $t('admin.normal') : $t('admin.Ban') }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(agencyTotal, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${agencyTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="page" :total="agencyTotal" @change="agencyHandleCurrentChange" @showSizeChange="agencyHandleSizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>
      <!-- 查看账号token -->
      <a-modal v-if="tokenVisible" v-model="tokenVisible" :title="$t('user.accountToken')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="tokenVisible = false">
        <div style="height:450px; overflow-y:auto;">
          {{ tokenVal }}
        </div>
      </a-modal>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100', '200', '500', '1000']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [{
  // title: '头像',
  slotName: 'dealer.account',
  dataIndex: 'avatar',
  align: 'center',
  width: '100px',
  scopedSlots: { customRender: 'avatar', title: 'dealer.account' }
},
/* {
  title: 'ID',
  dataIndex: 'id',
  width: '100px',
  ellipsis: true,
  align: 'center',
}, */
{
  // title: '个签',
  slotName: 'admin.signature',
  dataIndex: 'signature',
  width: '200px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'signature', title: 'admin.signature' }
},
{
  // title: '帖子数量',
  slotName: 'dealer.numberOfPosts',
  dataIndex: 'posts_number',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'posts_number', title: 'dealer.numberOfPosts' }
},
{
  // title: '关注人数',
  slotName: 'dealer.followers',
  dataIndex: 'follow_number',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'follow_number', title: 'dealer.followers' }
},
{
  // title: '好友数量',
  slotName: 'dealer.numberOfFriends',
  dataIndex: 'friends_number',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'friends_number', title: 'dealer.numberOfFriends' }
},
{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '200px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '150px',
  align: 'center',
  // fixed: 'right',
  scopedSlots: { customRender: 'action', title: 'admin.operate' }
}
]
const columnsSelect = [
  {
    slotName: 'admin.username',
    dataIndex: 'username',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title: 'admin.username' }
  },
  {
    // title: '状态',
    slotName: 'admin.state',
    dataIndex: 'status',
    width: '100px',
    align: 'center',
    scopedSlots: { customRender: 'status', title: 'admin.state' }
  }
]
const runInfocolumns = [
  {
    title: '任务类型',
    dataIndex: 'type',
    width: '60px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: '60px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '目标用户',
    dataIndex: 'unique_id',
    width: '60px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '地区',
    dataIndex: 'region',
    width: '60px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '60px',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    width: '60px',
    ellipsis: true,
    align: 'center'
  }]
import * as api from '@/api/index'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        nickname: '',
        page: 1,
        size: 10,
        id: null,
        order_created_at: true
      },
      columns: [],
      page: 1,
      runInfocolumns: [],
      columnsSelect: [],
      selectDataId: [],
      selectData: [],
      form: {
        username: '',
        password: '',
        quantity: 0,
        userID: null,
        userUserID: null,
        price: null
      },
      user_id: null,
      modifyForm: {},
      tableData: [],
      tokenVal: '',
      tokenVisible: false,
      total: 0,
      size: 10,
      agencyTotal: 0,
      username: null,
      tableSelectData: [],
      selectPortDataId: [],
      selectPortData: [],
      // 出售账号
      sellVisible: false,
      // 划分账号
      divisionVisible: false,
      divisionLoading: false, // 划分账号 确定按钮
      informationVisible: false,
      afficheVisible: false,
      affiche: null,
      title: null
    }
  },
  async mounted() {
    this.getPublish()
    this.init()
  },
  methods: {
    async init() {
      this.user_id = this.$route.query.device_id || null
      this.searchData.nickname = this.searchData.nickname || null
      this.searchData.id = this.searchData.id || null
      this.page = 1
      this.searchData.page = 1
      this.columns = []
      this.selectDataId = []
      this.selectData = []
      this.selectPortDataId = []
      this.selectPortData = []
      this.columnsSelect = []
      this.runInfocolumns = []
      columns.forEach(item => {
        this.columns.push(item)
      })
      runInfocolumns.forEach(item => {
        this.runInfocolumns.push(item)
      })
      columnsSelect.forEach(item => {
        this.columnsSelect.push(item)
      })
      this.getTableData()
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
    getTableData() {
      let searchData = {}
      searchData.page = this.searchData.page
      searchData.page_size = this.searchData.size
      searchData.user_id = this.user_id
      searchData.id = this.searchData.id
      searchData.nickname = this.searchData.nickname
      searchData.order_created_at = this.searchData.order_created_at
      api.getDealerAcount(searchData).then((res) => {
        this.tableData = res.data.data
        this.total = res.data.count
      })
    },
    // 批量删除
    deleteUpdate() {
      if (this.selectPortDataId.length < 1) {
        this.$message.error('请先选择要删除的账号')
        return
      }
      let form = {}
      form.list = this.selectPortDataId
      api.postDealeryAccountDel(form).then(res => {
        if (res.code === 0) {
          this.selectPortDataId = []
          this.$message.success('删除成功')
          this.getTableData()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    // 单个删除
    accountDelete(id) {
      let form = {}
      let list = []
      list.push(id)
      form.list = list
      api.postDealeryAccountDel(form).then(res => {
        if (res.code === 0) {
          this.selectPortDataId = []
          this.$message.success('删除成功')
          this.getTableData()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    divisionView() {
      this.informationVisible = true
      this.username = null
    },
    // 用户信息
    getSelectTableData() {
      let searchData = {}
      searchData.page = this.page
      searchData.page_size = this.size
      searchData.username = this.username === '' ? '' : this.username
      api.getDealerUser(searchData).then((res) => {
        this.tableSelectData = res.data.data
        this.agencyTotal = res.data.count
      })
    },
    informationSubmit() {
      if (this.selectDataId.length !== 1) {
        this.$message.error('请选择一个账号')
        return
      }
      this.informationVisible = false
      this.form.username = this.selectData[0].username
      this.form.userUserID = this.selectDataId[0]
    },
    // 查看Token
    tokenPage(id) {
      const form = {}
      form.id = id
      api.getDealerToken(form).then(res => {
        if (res.code === 0) {
          this.tokenVal = res.data.token
          this.tokenVisible = true
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },

    // 划分账号
    divisionAccoun() {
      if (this.selectPortDataId.length === 0) {
        this.$message.error('请先选择要分配的账号')
        return
      }
      this.divisionVisible = true
      this.divisionLoading = false
      this.form.userUserID = null
      this.form.userID = this.selectPortDataId
      // this.getSelectTableData()
    },
    divisionAccounSubmit() {
      if (!this.form.userUserID) {
        this.$message.warning('请选择划分用户')
        return
      }
      this.divisionLoading = true
      if (this.divisionLoading) {
        let form = {}
        form.list = this.form.userID
        form.user_id = this.form.userUserID
        // console.log(form)
        api.postDealeryAccountAssign(form).then((res) => {
          if (res.code === 0) {
            this.divisionVisible = false
            this.divisionLoading = false
            this.init()
          }
        }).catch((err) => {
          Message({
            message: err.msg,
            type: 'error'
          })
        })
      }
    },
    // 选择用户
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

    // 查看账号
    view(row) {
      this.$router.push({
        name: 'account',
        query: {
          device_id: row.id
        }
      })
    },
    rowSelectionPort(selectedRowKeys, values) {
      this.selectPortDataId = []
      this.selectPortData = []
      selectedRowKeys.forEach(item => {
        this.selectPortDataId.push(item)
      })
      values.forEach(item => {
        this.selectPortData.push(item)
      })
    },
    agencyHandleCurrentChange(page) {
      this.page = page
      this.getSelectTableData()
    },
    agencyHandleSizeChange(page, s) {
      this.size = s
      this.page = 1
      this.getSelectTableData()
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.size = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
.affiche{
  white-space: pre-wrap;
  background: #FFCFAF1C 0% 0% no-repeat padding-box;
  border: 1px solid #FFC9A7A8;
  border-radius: 10px;
  opacity: 1;
  padding: 10px;
}
</style>
