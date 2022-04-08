<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.describe')">
          <a-input v-model="searchData.describe" :placeholder="this.$t('admin.describe')" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          <a-button type="primary" style="margin-left:10px;" @click="goodsUpload()">{{this.$t('dealer.productUpload')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
            <!-- <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" :row-selection="{ selectedRowKeys: selectPortDataId, onChange: rowSelectionPort }" class="tableLimit" :bordered="true" :pagination="false"> -->
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="avatar" slot-scope="text, row ">
          <a-avatar :src="row.avatar" />
          <p>{{ row.nickname }}</p>
        </span>
        <span slot="is_official" slot-scope="text, row">
          {{ row.is_official === false ? $t('admin.No') : $t('admin.Yes') }}
        </span>
        <span slot="price" slot-scope="text, row">
          {{ row.price}}{{$t('admin.integral')}}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left:10px" type="primary" @click="goodsUpload(row)">{{$t('admin.revise')}}</a-button>
          <!-- <a-popconfirm title="是否删除?" ok-text="是" cancel-text="否" @confirm="deletefn(row)">
            <a-button style="margin-left:10px" type="danger">删除</a-button>
          </a-popconfirm> -->
        </span>
        
      </a-table>

      <!-- 商品上传 -->
      <a-modal v-model="goodsVisible" :title="this.$t('dealer.productUpload')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="goodsSubmit">
        <a-form ref="form" :model="goodsForm" labelAlign='left' :label-col="{ span: 8 }" :wrapper-col="{ span: 24 }">
          <!-- <a-form-item label="唯一ID">
            <a-input v-model="goodsForm.user_id" />
          </a-form-item> -->                   
          <!-- <a-form-item label="是否自营账号">
            <a-input v-model="goodsForm.is_official" />
          </a-form-item> -->
          <a-form-item :label="$t('dealer.headerInformation')" prop="title">
            <a-input v-model="goodsForm.title" />
          </a-form-item>
          <a-form-item :label="$t('dealer.productDescription')">
            <a-input v-model="goodsForm.describe" prop="describe"/>
          </a-form-item>
          <a-form-item :label="$t('dealer.photoUrl')">
            <a-input v-model="goodsForm.avatar" prop="avatar"/>
          </a-form-item>
          <a-form-item :label="$t('admin.price')">
            <a-input v-model="goodsForm.price" prop="price"/>
          </a-form-item>
          <a-form-item :label="$t('admin.contactInformation')">
            <a-input v-model="goodsForm.contact" prop="contact"/>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 账号出售 -->
      <a-modal v-model="sellVisible" title="出售" width="500px" ok-text="确认" cancel-text="取消" @ok="sell">
        <a-form ref="form" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="出售人">
            <a-input v-model="form.username" />
          </a-form-item>
          <a-form-item label="价格">
            <a-input v-model="form.price" />
          </a-form-item>
          <a-form-item label="账号">
            <a-input v-model="form.quantity" />
          </a-form-item>
        </a-form>
      </a-modal>
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
const columns = [{
  // title: '头像',
  slotName: 'dealer.account',
  dataIndex: 'avatar',
  align: 'center',
  width: '80px',
  scopedSlots: { customRender: 'avatar', title:'dealer.account' }
},
{
  // title: '标题',
  slotName: 'dealer.headerInformation',
  dataIndex: 'title',
  width: '200px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'title', title:'dealer.headerInformation' }
},
{
  // title: '描述',
  slotName: 'admin.describe',
  dataIndex: 'describe',
  width: '200px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'describe', title:'admin.describe' }
},
{
  // title: '联系信息',
  slotName: 'admin.contactInformation',
  dataIndex: 'contact',
  width: '200px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'contact', title:'admin.contactInformation' }
},
{
  // title: '价格',
  slotName: 'admin.price',
  dataIndex: 'price',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'price', title:'admin.price' }
},
{
  // title: '是否自营',SelfEmployed
  slotName: 'admin.SelfEmployed',
  dataIndex: 'is_official',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'is_official', title:'admin.SelfEmployed' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  align: 'center',
  width: '120px',
  scopedSlots: { customRender: 'action', title:'admin.operate' }
}]
const runInfocolumns = [{

    title: '任务类型',
    dataIndex: 'type',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '昵称',
    dataIndex: 'nickname',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '目标用户',
    dataIndex: 'unique_id',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '地区',
    dataIndex: 'region',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '状态',
    dataIndex: 'status',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '创建时间',
    dataIndex: 'created_at',
    width: '60px',
    ellipsis: true,
    align: 'center'
}]
import * as api from '@/api/index'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        username: '',
        describe: null,
        page: 1,
        order_created_at: true
      },
      columns: [],
      runInfocolumns: [],
      form: {
        username: '',
        password: '',
        quantity: 0,
        userID: null,
        price: null
      },
      goodsForm: {
        user_id: null,
        is_official: false,
        title: null,
        describe: null,
        avatar: null,
        contact: null,
        price: null
      },
      user_id: null,
      modifyForm: {},
      tableData: [],
      total: 0,
      size: 10,
      selectPortDataId: [],
      selectPortData: [],
      goodsVisible: false,
      // 出售账号
      sellVisible: false,
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.user_id = this.userInfo.data.i
      this.page = 1
      this.columns = []
      this.runInfocolumns = []
      columns.forEach(item => {
        this.columns.push(item)
      })
      runInfocolumns.forEach(item => {
        this.runInfocolumns.push(item)
      })
      this.searchData.describe = this.searchData.describe || null
      this.getTableData()
    },
    getTableData() {
      let searchData = {}
      searchData.page = this.page
      searchData.size = this.size
      searchData.user_id = this.user_id
      searchData.describe = this.searchData.describe
      api.getDealerCommodityAccount(searchData).then((res) => {
        this.tableData = res.data.data
        this.total = res.data.count
      })
    },
    // 商品上传
    goodsUpload(row) {
      if(row) {
        this.goodsForm = row
      }
      this.goodsVisible = true
    },
    goodsSubmit() {
      let goodsForm = {}
      goodsForm.id = this.goodsForm.id
      goodsForm.user_id = this.user_id
      goodsForm.title = this.goodsForm.title
      goodsForm.describe = this.goodsForm.describe
      goodsForm.avatar = this.goodsForm.avatar
      goodsForm.contact = this.goodsForm.contact
      goodsForm.price = Number(this.goodsForm.price)
      api.postDealerCommodityAccount(goodsForm).then((res) =>{
        if(res.code === 0) {
          this.goodsVisible = false
          this.init()
        }
      })
    },
    deletefn(row) {
      api.putDealerCommodityAccount(id).then(res => {
        if (res.code === 0) {
          this.getTableData()
        }
      })
    },
    // 账号出售
    SellingAccount() {
      if(this.selectPortDataId.length === 0) {
        this.$message.error('请先选择要绑定的账号')
        return
      }
      this.sellVisible = true
    },
    async sell() {
      this.sellVisible = false
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

<style lang="scss">
</style>
