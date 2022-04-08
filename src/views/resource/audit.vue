<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.Approved')">
          <a-select v-model="searchData.status" style="width:213px" allow-clear>
            <a-select-option :value="1">{{this.$t('admin.No')}}</a-select-option>
            <a-select-option :value="2">{{this.$t('admin.Yes')}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="this.$t('admin.resourceType')">
          <a-select v-model="searchData.type" style="width:213px" allow-clear>
            <a-select-option :value="1">{{this.$t('admin.text')}}</a-select-option>
            <a-select-option :value="2">{{this.$t('admin.richText')}}</a-select-option>
            <a-select-option :value="3">{{this.$t('admin.video')}}</a-select-option>
            <a-select-option :value="6">{{this.$t('admin.businessCard')}}</a-select-option>
            <a-select-option :value="7">{{this.$t('admin.signature')}}</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="用户ID">
          <a-input v-model="searchData.user_id" style="100px" placeholder="请输入用户ID" allow-clear />
        </a-form-item>
        <a-form-item label="联系方式">
          <a-input v-model="searchData.contact" style="100px" placeholder="请输入联系方式" allow-clear />
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" icon="search" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="role" slot-scope="text, row ">
          {{ row.role | getRole }}
        </span>
        <span slot="type" slot-scope="text, row ">
          {{ row.type | getType }}
        </span>
        <span slot="status" slot-scope="text, row">
          {{ row.status === 1 ? $t('admin.pendingReview') : $t('admin.audited') }}
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" v-if="row.status === 1" type="primary" @click="auditResources(row)">{{$t('admin.review')}}</a-button>
          <a-button style="margin-left:10px" type="primary" @click="preview(row)">{{$t('admin.preview')}}</a-button>
          <!-- <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="delAdmin(row.id)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm> -->
        </span>
      </a-table>
      <!-- 预览 -->
      <a-modal v-model="previewVisible" :title="this.$t('admin.preview')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')">
        <div style="height:300px; overflow-y:auto;">
          <p>{{this.$t('admin.submitter')}}：{{previewUserId}}</p>
          <p>{{this.$t('admin.resource')}}：{{previewName}}</p>
          <p>{{this.$t('admin.resourceType')}}：{{previewType  | getType}}</p>
          <p v-for="(item, index) in previewData" :key="index">{{ item }}</p>
        </div>
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
import { Message } from 'element-ui'
import user from '@/components/user/user'
const columns = [
  {
    // title: '资源名称',
    slotName: 'admin.resource',
    dataIndex: 'name',
    width: '150px',
    ellipsis: true,
    align: 'center',
    scopedSlots: { customRender: 'name', title: 'admin.resource' }
  },
  {
    // title: '资源类型',
    slotName: 'admin.resourceType',
    dataIndex: 'type',
    width: '150px',
    align: 'center',
    scopedSlots: { customRender: 'type', title: 'admin.resourceType' }
  },
  {
    // title: '资源数据',
    slotName: 'admin.resourceContent',
    dataIndex: 'data',
    width: '100',
    align: 'center',
    scopedSlots: { customRender: 'data', title: 'admin.resourceContent' },
    ellipsis: true,
    customRender: (value, row, index) => {
      return value != null ? JSON.stringify(value) : value
    }
  },
  {
    // title: '创建时间',
    slotName: 'admin.creationTime',
    dataIndex: 'created_at',
    width: '200PX',
    align: 'center',
    scopedSlots: { customRender: 'created_at', title:'admin.creationTime' }
  },
  {
    // title: '审核',
    slotName: 'admin.review',
    dataIndex: 'status',
    width: '150PX',
    align: 'center',
    scopedSlots: { customRender: 'status', title:'admin.review' }
  },
  {
    // title: '操作',operate
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
      total: 0,
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
        contact: null,
        username: null,
        role: null,
        is_official: null,
        type: null,
        status: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      tableData: [],
      dialogVisible: false,
      previewData: '',
      previewUserId: null,
      previewType: null,
      previewName: null,
      previewVisible: false,
      modifyDialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        role: null
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
    },
    getType(value) {
      if (value === 1) return '文本'
      if (value === 2) return '富文本'
      if (value === 3) return '视频'
      if (value === 4) return '图片'
      if (value === 6) return '名片'
      if (value === 7) return '个签'
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
      //await api.getAdConfig()
    },
    async getTableData() {
      if (this.searchData.contact === '') {
        this.searchData.contact = null
      }
      if (this.searchData.user_id === '') {
        this.searchData.user_id = null
      }
      if(this.userInfo.data.r === 1) {
        let res = await api.getAdminResource(this.searchData)
        if (res && res.code === 0 && res.data) {
          this.tableData = res.data.data
          this.total = res.data.count
        }
      } else if (this.userInfo.data.r === 5) {
        let res = await api.getReviewResource(this.searchData)
        if (res && res.code === 0 && res.data) {
          this.tableData = res.data.data
          this.total = res.data.count
        }
        
      }
      
    },
    onSubmit() {
      console.log('submit!')
    },
    check(row) {
      this.dialogGroupId = true
      this.nowData = row
    },
    delAdmin(id) {
      const res = api.delAdminResource(id)
      if (res.code === 0) {
        this.getTableData()
      }
    },
    
    async getUserId(id) {
      const uid = this.nowData.id
      const superiors_id = id
      await api.putUserInter({ id: uid, superiors_id })
      this.getTableData()
    },
    // 资源审核
    auditResources(row) {
      let form = {}
      form.id = row.id
      form.status = 2
      if(this.userInfo.data.r === 1) {
        api.postAdminExamineResource(form).then((res) => {
          Message({
            type: 'success',
            message: '审核成功'
          })
          this.getTableData()
        }).catch((err) => {
          Message({
            type: 'error',
            message: err.msg
          })
        })
      } else if (this.userInfo.data.r === 5) {
        api.postReviewExamineResource(form).then((res) => {
          Message({
            type: 'success',
            message: '审核成功'
          })
          this.getTableData()
        }).catch((err) => {
          Message({
            type: 'error',
            message: err.msg
          })
        })
      }
      
    },
    preview(row) {
      // console.log(row)
      this.previewVisible = true
      this.previewName = row.name
      this.previewType = row.type
      this.previewData = row.data
      let id = row.user_id
      this.previewUserName(id)
    },
    previewUserName(id) {
      let form = {}
      form.page = 1
      form.page_size = 10
      form.id = id
      form.order_created_at = true
      /* api.getAdmin(form).then(res => {
        this.previewUserId = res.data.data[0].username
      }).catch(err => {
        console.log(err)
      }) */
      if(this.userInfo.data.r === 1) {
        api.getAdmin(form).then(res => {
          this.previewUserId = res.data.data[0].username
        }).catch(err => {
          // console.log(err)
        })
      } else if (this.userInfo.data.r === 5) {
        api.getReview(form).then(res => {
          this.previewUserId = res.data.data[0].username
        }).catch(err => {
          // console.log(err)
        })
      }
      
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
