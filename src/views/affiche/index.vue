<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="this.$t('admin.announcement')">
          <a-input v-model="searchData.name" :placeholder="this.$t('admin.announcement')" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          <a-button type="primary" style="margin-left:10px;" @click="addAffiche">{{this.$t('admin.Add')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left: 8px" type="primary" @click="view(row)">{{$t('admin.preview')}}</a-button>
          <a-button style="margin-left: 8px" type="primary" @click="addAffiche(row)">{{$t('admin.revise')}}</a-button>
          <a-popconfirm :title="$t('admin.deleteOrNot')" :ok-text="$t('admin.Yes')" :cancel-text="$t('admin.No')" @confirm="handleDelete(row.id)">
            <a-button style="margin-left: 8px" type="danger">{{$t('admin.delete')}}</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="afficheListVisible" :title="afficheText" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="handleAffiche">
        <a-form :model="form">
          <a-form-item :label="$t('admin.announcement')">
            <a-input v-model="searchData.title" :placeholder="$t('admin.announcement')" allow-clear />
          </a-form-item>
          <a-form-item :label="$t('admin.officialNews')">
            <div style="height:230px; overflow-y:auto;">
              <a-textarea :placeholder="$t('admin.officialNews')" v-model="searchData.content" :rows="10" :cols="10" />
            </div>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model="dialogView" :title="$t('admin.preview')" width="50%" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="handleEdit">
        <div class="affiche">
          {{this.afficheList}}
        </div>
      </a-modal>
      <!-- <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
const columns = [{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title:'admin.creationTime' }
},
{
  title: '公告名称',
  dataIndex: 'title',
  width: '100',
  align: 'center'
},
{
  title: '公告信息',
  dataIndex: 'content',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '操作',
  dataIndex: 'action',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
import * as api from '@/api/index'
import axios from 'axios'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      type: 1,
      searchData: {
        title: null,
        content: null,
        id: null,
        created_at: null,
        updated_at: null,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      fileList: [],
      afficheList: null,
      affichedata: '',
      headers: {
        Authorization: ('Bearer ' + window.sessionStorage.getItem('token'))
      },
      resourceType: [{ label: '文本', value: 1 }, { label: '富文本', value: 2 }, { label: '视频', value: 3 }, { label: '图片', value: 5 }, { label: '名片', value: 6 }, { label: '个签', value: 7 }],
      action: process.env.VUE_APP_UPLOAD_RESOURCE_ADDRESS,
      columns: columns,
      tableData: [],
      form_rule: {
        fileName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
      },
      total: 0,
      size: 10,
      user_id: 0,
      afficheText: '添加公告信息',
      afficheListVisible: false,
      dialogVisible: false,
      dialogView: false,
      dataInfo: [],
      modifyDialogVisible: false,
      form: {
        fileName: '',
        text: [{ value: '' }]
      },
      modifyForm: {}
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.user_id = this.userInfo.data.i
    this.init()
  },
  methods: {
    async init() {
      this.form.fileName = ''
      this.searchData.created_at = null
      this.searchData.id = null
      this.searchData.updated_at = null
      this.searchData.page = 1
      this.searchData.page_size = 10
      this.searchData.order_created_at = true
      this.getTableData()
    },
    async getTableData() {
      const res = await api.getAdminPublish(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    // 新增公告信息
    addAffiche(row) {
      this.afficheListVisible = true
      if(row.id) {
        this.searchData.title = row.title
        this.searchData.content = row.content
        this.searchData.id = row.id
        this.searchData.created_at = row.created_at
        this.searchData.updated_at = row.updated_at
      } else {
        this.searchData.id = null
        this.searchData.title = null
        this.searchData.content = null
        this.searchData.created_at = null
        this.searchData.updated_at = null
      }
    },
    handleAffiche() {
      if(this.searchData.id) {
        this.afficheText = '修改公告信息'
        let searchData = {}
        searchData.title = this.searchData.title
        searchData.content = this.searchData.content
        searchData.id = this.searchData.id
        searchData.created_at = this.searchData.created_at
        searchData.updated_at = this.searchData.updated_at
        api.putAdminPublish(searchData).then((res) => {
          if(res.code === 0) {
            this.$message.success('修改成功')
            this.afficheListVisible = false
            this.searchData.title = null
            this.searchData.content = null
            this.init()
          }
        }).catch(err => {
          this.$message.error(err.msg)
        })
      } else {
        let searchData = {}
        searchData.title = this.searchData.title
        searchData.content = this.searchData.content
        this.afficheText = '添加公告信息'
        api.postAdminPublish(searchData).then(res => {
          if(res.code === 0) {
            this.searchData.title = null
            this.searchData.content = null
            this.afficheListVisible = false
            this.init()
          }
        }).catch(err => {
          this.$message.error(err.msg)
        })
      }
    },
    async handleEdit() {
      const res = await api.putUserInter(this.modifyForm)
      if (res.code === 0) {
        this.modifyDialogVisible = false
      }
    },
    async handleDelete(id) {
      // console.log(id)
      api.deletefnAdminPublish(id).then(res=> {
        if(res.code === 0) {
          this.init()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    beforeUpload(file) {
      // console.log(file)
      // this.fileList = [...this.fileList, file]
      this.fileList = [file]
      return false
    },
    view(data) {
      this.dialogView = true
      this.afficheList = data.content
      // this.dataInfo = data.data
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
