<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="$t('admin.resource')">
          <a-input v-model="searchData.name" :placeholder="$t('admin.resource')" allow-clear />
        </a-form-item>
        <a-form-item :label="$t('admin.resourceType')">
          <a-select v-model="searchData.type" style="width:150px" @change="init">
            <a-select-option :value="1">文本</a-select-option>
            <!-- <a-select-option :value="2">富文本</a-select-option> -->
            <!-- <a-select-option :value="3">{{$t('admin.video')}}</a-select-option> -->
            <!-- <a-select-option :value="4">语音</a-select-option> -->
            <a-select-option :value="5">头像</a-select-option>
            <!-- <a-select-option :value="6">{{$t('admin.businessCard')}}</a-select-option> -->
            <a-select-option :value="7">{{ $t('admin.signature') }}</a-select-option>
            <!-- <a-select-option :value="8">{{$t('admin.textLink')}}</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">{{this.$t('admin.Inquire')}}</a-button>
          <a-button type="primary" style="margin-left:10px;" @click="add">{{this.$t('admin.Add')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :loading="tableLoading" :row-key="record => record.id" :scroll="{ x: 1200}" class="tableLimit" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{ $t(item.slotName) }}</span>
        </templete>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="status" slot-scope="text, row">
          {{ row.status === 1 ? $t('admin.pendingReview') : $t('admin.audited')}}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button style="margin-left: 8px" type="primary" @click="view(row)">{{$t('admin.preview')}}</a-button>
          <a-popconfirm :title="$t('admin.deleteOrNot')" :ok-text="$t('admin.Yes')" :cancel-text="$t('admin.No')" @confirm="handleDelete(row.id)">
            <a-button style="margin-left: 8px" type="danger">{{$t('admin.delete')}}</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" :title="$t('user.addResources')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="handleAdd">
        <a-form :model="form" :label-col="{ span: 4 }" :rules="form_rule" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="$t('user.privateMessageType')">
            <a-select v-model="searchData.type">
              <a-select-option v-for="(item, index) in resourceType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-item :label="$t('admin.resource')" prop='fileName'>
            <a-input v-model="form.fileName" />
          </a-form-item>
          <a-form-item :label="$t('admin.resourceContent')" v-if="searchData.type != 3 && searchData.type != 6">
            <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
              <a-button>
                <a-icon type="upload"/> {{$t('user.upload')}}
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item :label="$t('admin.resourceContent')" v-if="searchData.type === 3">
            <a-input v-model="fileList" @click="parsingClick" readOnly/>
          </a-form-item>
          <a-form-item :label="$t('admin.resourceContent')" v-if="searchData.type === 6 ">
            <a-input v-if="!fileListVisible" v-model="fileList" @click="parsingClick" readOnly/>
            <p v-if="fileListVisible">{{$t('user.parsedSuccessfully')}}</p>
          </a-form-item>
        </a-form>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="dialogVisible = false">{{$t('admin.cancel')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="dialogLoading" @click="handleAdd">{{$t('admin.confirm')}}</a-button>
        </span>
      </a-modal>
      <a-modal v-model="nameCardVisible" :title="$t('user.analyzeBusinessCards')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="550px" @ok="handleNameCard">
        <a-form-model ref="nameCardFrom" :model="nameCardFrom" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="$t('user.enterURL')" prop="url">
            <a-spin :spinning="nameCardSpinning" tip="Loading..."/>
            <a-input v-model="nameCardFrom.url" oninput="value=value.replace(/\s/g,'')"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('user.pictureURL')+'1:'">
            <a-spin :spinning="nameCardSpinning" tip="Loading..."/>
            <a-input v-model="nameCardFrom.pictureUrl1" oninput="value=value.replace(/\s/g,'')"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('user.pictureURL')+'2:'" >
            <a-spin :spinning="nameCardSpinning" tip="Loading..."/>
            <a-input v-model="nameCardFrom.pictureUrl2" oninput="value=value.replace(/\s/g,'')"/>
          </a-form-model-item>
          <a-form-model-item :label="$t('user.pictureURL')+'3:'">
            <a-spin :spinning="nameCardSpinning" tip="Loading..."/>
            <a-input v-model="nameCardFrom.pictureUrl3" oninput="value=value.replace(/\s/g,'')"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="videoVisible" :title="$t('user.videoAnalysis')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="550px" @ok="handleVideo">
        <a-form-model ref="videoFrom" :model="videoFrom" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="$t('user.enterURL')" prop="avatar">
            <a-spin :spinning="videoSpinning" tip="Loading..."/>
            <a-input v-if="!videoSpinning" v-model="videoFrom.url" oninput="value=value.replace(/\s/g,'')"/>
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <a-modal v-model="bookTextVisible" title="外链文本新增" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="550px" @ok="handleBookText">
        <a-form-model ref="bookTextFrom" :model="bookTextFrom" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="输入地址" prop="url">
            <a-input v-model="bookTextFrom.url" oninput="value=value.replace(/\s/g,'')"/>
          </a-form-model-item>
          <a-form-model-item label="输入文字" prop="text">
            <a-textarea
              v-model="bookTextFrom.text"
              placeholder="请输入文字"
              :auto-size="{ minRows: 3, maxRows: 15 }"
            />
            <!-- <a-input v-model="bookTextFrom.text" /> -->
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <a-modal v-model="dialogView" :title="$t('admin.preview')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="handleEdit">
        <div style="height:200px; overflow-y:auto;">
          <p v-for="(item, index) in dataInfo" :key="index">{{ item }}</p>
        </div>
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
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
},
{
  // title: '资源名称',
  slotName: 'admin.resource',
  dataIndex: 'name',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'name', title: 'admin.resource' }
},
{
  // title: '审核状态',
  slotName: 'admin.state',
  dataIndex: 'status',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'status', title: 'admin.state' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '300px',
  fixed: 'right',
  align: 'center',
  scopedSlots: { customRender: 'action', title: 'admin.operate' }
}]
import * as api from '@/api/index'

export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      type: 1,
      searchData: {
        name: '',
        type: 1,
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      fileList: [],
      headers: {
        Authorization: ('Bearer ' + window.sessionStorage.getItem('token'))
      },
      resourceType: [
        { label: '文本', value: 1 },
        // { label: '富文本', value: 2 },
        // { label: this.$t('admin.video'), value: 3 },
        { label: '头像', value: 5 },
        // { label: this.$t('admin.businessCard'), value: 6 },
        { label: this.$t('admin.signature'), value: 7 }
        // { label: this.$t('admin.textLink'), value: 8 }
      ],
      action: process.env.VUE_APP_UPLOAD_RESOURCE_ADDRESS,
      columns: columns,
      tableData: [],
      form_rule: {
        fileName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入名片地址', trigger: 'blur' }
        ],
        send_url: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        send_text: [
          { required: true, message: '请输入文字', trigger: 'blur' }
        ]
        /* pictureUrl1: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确地址', trigger: 'blur' }
        ],
        pictureUrl2: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确地址', trigger: 'blur' }
        ],
        pictureUrl3: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确地址', trigger: 'blur' }
        ], */
      },
      total: 0,
      size: 10,
      user_id: 0,
      dialogVisible: false,
      dialogLoading: false, // 新增资源 确定按钮
      dialogView: false,
      dataInfo: [],
      modifyDialogVisible: false,
      form: {
        fileName: '',
        text: [{ value: '' }]
      },
      modifyForm: {},
      videoVisible: false,
      nameCardVisible: false,
      bookTextVisible: false,
      nameCardSpinning: false,
      videoSpinning: false,
      fileListVisible: false,
      tableLoading: false,
      videoFrom: {
        url: ''
      },
      bookTextFrom: {
        url: '',
        text: ''
      },
      bookTextData: [],
      nameCardFrom: {
        url: '',
        send_image: '',
        pictureUrl1: '',
        pictureUrl2: '',
        pictureUrl3: ''
      }
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
      this.searchData.name = this.searchData.name || null
      this.searchData.page = 1
      this.resourceTypeData()
      this.getTableData()
    },
    resourceTypeData() {
      api.getEnum().then(res => {
        if (res.code === 0) {
          console.log(res)
        }
      })
    },
    async getTableData() {
      this.tableLoading = true
      const res = await api.getResourceUser(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableData = res.data.data
        this.tableLoading = false
        this.total = res.data.count
      }
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    add() {
      this.dialogVisible = true
      this.bookTextData = []
    },
    async handleAdd() {
      const { fileList } = this
      if (fileList.length === 0) {
        this.$message.error('请先上传资源')
        return
      }
      if (this.form.fileName === '' || null) {
        this.$message.error('请先添加资源名称')
        return
      }
      this.dialogLoading = true
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
        formData.append('name', this.form.fileName)
        formData.append('user_id', this.user_id)
        formData.append('type', this.searchData.type)
      })
      this.uploading = true
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      api.postResourceUser(formData, config).then((res) => {
        this.fileList = []
        this.uploading = false
        this.$message.success('上传成功')
        this.dialogVisible = false
        this.nameCardSpinning = false
        this.videoSpinning = false
        this.fileListVisible = false
        this.dialogLoading = false
        this.getTableData()
      }).catch((err) => {
        this.$message.error(err.msg)
      })
    },
    edit(row) {
      this.modifyDialogVisible = true
      this.modifyForm = row
    },
    async handleEdit() {
      const res = await api.putUserInter(this.modifyForm)
      if (res.code === 0) {
        this.modifyDialogVisible = false
      }
    },
    async handleDelete(id) {
      console.log(id)
      const res = await api.delResourceUser(id)
      if (res.code === 0) {
        this.getTableData()
      }
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    handleChange(file) {
      if (file.file.status === 'done') {
        this.$message.success(`${file.file.name} 上传成功`)
      } else if (file.file.status === 'error') {
        this.$message.error(`${file.file.name} 上传失败.`)
      }
    },
    handleRemove(file) {
      // console.log(file)
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      // console.log(file)
      // this.fileList = [...this.fileList, file]
      this.fileList = [file]
      return false
    },
    view(data) {
      this.dialogView = true
      this.dataInfo = data.data
    },
    // 资源内容
    parsingClick() {
      if (this.searchData.type === 3) {
        this.tiktokParseVideo()
      } else if (this.searchData.type === 6) {
        this.tiktokParseNameCard()
      }
      /* if (this.searchData.type === 8) {
        this.tiktokParseBookText()
      } */
    },
    // 解析视频
    tiktokParseVideo() {
      this.videoVisible = true
      this.videoFrom.url = ''
    },
    handleVideo() {
      this.videoSpinning = true
      api.postTiktokParseVideo({ url: this.videoFrom.url }).then((res) => {
        if (res.code === 0) {
          this.videoSpinning = false
          this.videoVisible = false
          this.fileList = []
          let datas = JSON.stringify(res.data)
          let fileData = new File([datas], 'video.txt', { type: 'text/plain' })
          this.fileList.push(fileData)
          this.fileListVisible = true
        } else {
          this.videoSpinning = false
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
        this.videoSpinning = false
      })
    },
    // 解析名片
    tiktokParseNameCard() {
      this.nameCardVisible = true
      this.nameCardFrom.url = ''
      this.nameCardFrom.send_image = ''
      this.nameCardFrom.pictureUrl1 = ''
      this.nameCardFrom.pictureUrl2 = ''
      this.nameCardFrom.pictureUrl3 = ''
      /* this.nameCardFrom.send_url = ''
      this.nameCardFrom.send_text = '' */
    },
    handleNameCard() {
      // this.nameCardSpinning = true
      console.log(this.nameCardFrom)
      let list = []
      let URL = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
      // URL.test(this.nameCardFrom.pictureUrl1)
      // console.log(URL.test(this.nameCardFrom.pictureUrl1))
      if (this.nameCardFrom.pictureUrl1 !== '' || this.nameCardFrom.pictureUrl2 !== '' || this.nameCardFrom.pictureUrl3 !== '') {
        if (URL.test(this.nameCardFrom.pictureUrl1)) {
        // 成功
        } else {
          // 失败
          this.$message.error('请填写正确的图片地址1的地址')
        }
        if (URL.test(this.nameCardFrom.pictureUrl2)) {
        // 成功
        } else {
          // 失败
          this.$message.error('请填写正确的图片地址2的地址')
        }
        if (URL.test(this.nameCardFrom.pictureUrl3)) {
        // 成功
        } else {
          // 失败
          this.$message.error('请填写正确的图片地址3的地址')
        }
      }
      list.push(this.nameCardFrom.pictureUrl1, this.nameCardFrom.pictureUrl2, this.nameCardFrom.pictureUrl3)
      if (this.nameCardFrom.pictureUrl1 === '' || this.nameCardFrom.pictureUrl2 === '' || this.nameCardFrom.pictureUrl3 === '') {
        list = []
      }
      let form = {}
      form.url = this.nameCardFrom.url
      form.send_image = list
      // form.send_url = this.nameCardFrom.send_url
      // form.send_text = this.nameCardFrom.send_text
      api.postTiktokParseNameCardUser(form).then((res) => {
        if (res.code === 0) {
          this.nameCardSpinning = false
          this.nameCardVisible = false
          this.fileList = []
          let datas = JSON.stringify(res.data)
          let fileData = new File([datas], 'nameCard.txt', { type: 'text/plain' })
          this.fileList.push(fileData)
          this.fileListVisible = true
        } else {
          this.nameCardSpinning = false
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
        this.nameCardSpinning = false
      })
    },
    tiktokParseBookText() {
      this.bookTextVisible = true
    },
    handleBookText() {
      this.fileList = []
      let bookTextItem = this.bookTextFrom
      let bookTextData = this.bookTextData
      bookTextData.push(bookTextItem)
      let bookTextDataList = JSON.stringify(bookTextData)
      let fileData = new File([bookTextDataList], 'bookText.txt', { type: 'text/plain' })
      this.fileList.push(fileData)
      this.bookTextVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>
