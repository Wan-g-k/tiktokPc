export const columns = [{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  align: 'center',
  ellipsis: true,
  width: 150,
  scopedSlots: {
    customRender: 'created_at',
    title: 'admin.creationTime'
  },
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
},
/* {
  title: '创建人',
  dataIndex: 'belong_name',
  align: 'center',
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  ellipsis: true,
  role: [1]
}, */
/* {
  title: '组名',
  dataIndex: 'group_name',
  align: 'center',
  ellipsis: true,
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14]
}, */
{
  // title: '账号ID',
  slotName: 'user.portID',
  dataIndex: 'executive',
  align: 'center',
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14],
  ellipsis: true,
  width: 100,
  scopedSlots: { customRender: 'executive', title: 'user.portID' },
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
/* {
  title: '账号',
  dataIndex: 'account_username',
  align: 'center',
  ellipsis: true,
  type: [7]
}, */
/* {
  title: '密码',
  dataIndex: 'account_password',
  ellipsis: true,
  align: 'center',
  ellipsis: true,
  type: [7]
}, */
/* {
  title: '包ID',
  dataIndex: 'executive_bundle',
  align: 'center',
  ellipsis: true,
  type: [8]
}, */
{
  // title: '发送数量',
  slotName: 'user.quantitySent',
  dataIndex: 'task_execute',
  align: 'center',
  ellipsis: true,
  width: 100,
  scopedSlots: { customRender: 'task_execute', title:'user.quantitySent' },
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14]
},
{
  // title: '发送失败',
  slotName: 'user.failedSend',
  dataIndex: 'task_fail',
  align: 'center',
  ellipsis: true,
  width: 100,
  scopedSlots: { customRender: 'task_fail', title:'user.failedSend' },
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14]
},
{
  // title: '发送成功',
  slotName: 'user.sentSuccessfully',
  dataIndex: 'task_success',
  align: 'center',
  ellipsis: true,
  width: 100,
  scopedSlots: { customRender: 'task_success', title:'user.sentSuccessfully' },
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14]
},
/* {
  // title: '间隔时间',
  slotName: 'user.intervals',
  dataIndex: 'intervals',
  align: 'center',
  ellipsis: true,
  scopedSlots: { customRender: 'intervals', title:'user.intervals' },
  type: [4, 6]
}, */
{
  // title: '目标总数',
  slotName: 'admin.total',
  dataIndex: 'follow_total',
  align: 'center',
  ellipsis: true,
  scopedSlots: { customRender: 'follow_total', title:'admin.total' },
  type: [4, 6]
},
{
  // title: '开始下标',
  slotName: 'user.sendSubscript',
  dataIndex: 'follow_index',
  align: 'center',
  ellipsis: true,
  scopedSlots: { customRender: 'follow_index', title:'user.sendSubscript' },
  type: [4, 6]
},
{
  title: '帖子ID',
  dataIndex: 'follow_note_id',
  align: 'center',
  ellipsis: true,
  type: [4, 14]
},
{
  title: '用户UID',
  dataIndex: 'follow_user_id',
  align: 'center',
  ellipsis: true,
  type: [5, 6, 14]
},
{
  title: '用户secID',
  dataIndex: 'follow_user_sec_id',
  align: 'center',
  ellipsis: true,
  type: [5, 6, 14]
},
{
  title: 'TK用户',
  dataIndex: 'tiktok_user',
  ellipsis: true,
  width: '100',
  align: 'center',
  type: [1],
  scopedSlots: {
    customRender: 'tiktok'
  }
},
/* {
  title: '协议信息',
  dataIndex: 'proxy_info',
  ellipsis: true,
  align: 'center',
  type: [3, 9, 10, 11, 12, 13]
}, */
/* {
  // title: '文本信息',
  slotName: 'user.textMessage',
  dataIndex: 'text',
  ellipsis: true,
  exchange: 2,
  width: 500,
  align: 'center',
  scopedSlots: {
    customRender: 'text', title: 'user.textMessage'
  },
  type: [2, 3, 9, 10, 11, 12, 13],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
}, */
{
  // title: '富文本',
  slotName: 'admin.richText',
  dataIndex: 'card',
  align: 'center',
  ellipsis: true,
  width: 150,
  // exchange: 3,
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13],
  scopedSlots: {
    customRender: 'card', title: 'admin.richText'
  },
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
/* {
  // title: '图片链接地址',
  slotName: 'user.pictureURL',
  dataIndex: 'image',
  align: 'center',
  ellipsis: true,
  width: 100,
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13],
  scopedSlots: {
    customRender: 'image', title: 'user.pictureURL'
  },
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
}, */
{
  // title: '名片',
  slotName: 'admin.businessCard',
  dataIndex: 'name_card',
  // exchange: 5,
  align: 'center',
  ellipsis: true,
  width: 150,
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  scopedSlots: {
    customRender: 'name_card', title: 'admin.businessCard'
  },
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  // title: '文本',
  slotName: 'admin.text',
  dataIndex: 'text',
  align: 'center',
  // exchange: 5,
  ellipsis: true,
  width: 150,
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  scopedSlots: {
    customRender: 'text', title: 'admin.text'
  },
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
/* {
  // title: '文本',
  slotName: 'admin.text',
  dataIndex: 'text',
  align: 'center',
  exchange: 1,
  ellipsis: true,
  type: [2],
  scopedSlots: {
    customRender: 'text', title:'admin.text'
  },
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
}, */
/* {
  // title: '间隔时间',
  slotName: 'user.intervals',
  dataIndex: 'intervals',
  align: 'center',
  exchange: 5,
  ellipsis: true,
  scopedSlots: {
    customRender: 'intervals', title:'user.intervals'
  },
  type: [2]
}, */
{
  // title: '视频连接地址',
  slotName: 'user.videoURL',
  dataIndex: 'video',
  ellipsis: true,
  // exchange: 1,
  align: 'center',
  width: 150,
  scopedSlots: {
    customRender: 'video', title: 'user.videoURL'
  },
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  // title: '备注',
  slotName: 'admin.remark',
  dataIndex: 'remark',
  align: 'center',
  ellipsis: true,
  width: 150,
  scopedSlots: {
    customRender: 'remark', title: 'admin.remark'
  },
  type: [1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13]
},
{
  // title: '地区',
  slotName: 'user.area',
  dataIndex: 'region',
  align: 'center',
  // exchange: 5,
  width: 70,
  ellipsis: true,
  scopedSlots: {
    customRender: 'region', title: 'user.area'
  },
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
},
{
  title: '关键词',
  dataIndex: 'keywords',
  align: 'center',
  ellipsis: true,
  type: [14],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '标签',
  dataIndex: 'tags',
  align: 'center',
  ellipsis: true,
  type: [14],
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  // title: '任务间隔最小时间',
  slotName: 'user.minimumTimeBetweenTasks',
  dataIndex: 'min',
  width: 100,
  align: 'center',
  scopedSlots: { customRender: 'min', title: 'user.minimumTimeBetweenTasks' },
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
},
{
  // title: '任务间隔最大时间',
  slotName: 'user.maximumTimeBetweenTasks',
  dataIndex: 'max',
  width: 100,
  align: 'center',
  scopedSlots: { customRender: 'max', title:'user.maximumTimeBetweenTasks' },
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'option',
  width: 330,
  align: 'center',
  fixed: 'right',
  scopedSlots: {
    customRender: 'action', title: 'admin.operate'
  },
  type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
}]
import group from '@/components/group/index'
import tag from '@/components/tags/index'
import proxy from '../component/proxy.vue'
import pack from '@/components/pack/pack.vue'
import resource from '@/components/resource/index'
import * as api from '@/api/index'
export default {
  components: {
    group,
    tag,
    proxy,
    pack,
    resource
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      total: 0,
      dialogVisible: false,
      dialogGroupId: false,
      disalogProxy: false,
      dialogPack: true,
      dialogResource: false,
      tableData: [],
      x: 1500,
      exchangeType: [
        { label: this.$t('admin.video'), value: 1 },
        { label: this.$t('admin.text'), value: 2 },
        { label: '富文本', value: 3 },
        // { label: '富文本V2', value: 6 },
        // { label: '图片', value: 4 },
        { label: this.$t('admin.businessCard'), value: 5 }],
      proxy_index: 0,
      form: {
        executive_group: '',
        executive_group_name: '',
        executives: '',
        number: 10,
        intervals: 10,
        max: 10,
        min: 3,
        follow_total: 10,
        follow_index: 1,
        follow_note_id: '',
        follow_user_id: '',
        follow_user_sec_id: '',
        follow_region: '',
        remark: '',
        tags: '',
        video: [{ value: '' }],
        text: [{ value: '' }],
        rich_text: [{ value: '' }],
        image: [{ value: '' }],
        name_card: [{ value: '' }],
        gender: [{ value: '' }],
        proxy_info: [{ value: '' }],
        keywords: [{ value: '' }],
        resourceName: ''
      }
    }
  },
  watch: {
    'form.executive_group_name': {
      handler(newValue, oldValue) {
        if (newValue === '') {
          this.form.executive_group = ''
        }
      },
      deep: true
    }
  },
  async mounted() {
    await api.getEnum()
    this.role = this.userInfo.data.r
    if (this.$route.query && this.$route.query.account_id) {
      this.form.executives = this.$route.query.account_id
      this.dialogVisible = true
    }
  },
  methods: {
    init() {
      this.searchData.page = 1
      this.order_created_at = true
      this.getTableData()
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    view(row) {
      this.$router.push({
        name: 'TaskDetail',
        query: {
          id: row.id
        }
      })
    },
    setProxyInfo(index) {
      this.proxy_index = index
      this.disalogProxy = true
    },
    getProxy(value) {
      this.form.proxy_info[this.proxy_index].value = value
      this.disalogProxy = false
    },
    pause(row) {

    },
    async create(row) {
      this.resetForm()
      const res = await api.getTask({ id: row.id })
      if (res.code === 0 && res.data && res.data.data && res.data.data[0]) {
        const data = res.data.data[0]
        this.form.type = data.type
        if (data.executive_group != null) {
          this.form.executive_group = data.executive_group
          this.form.executive_group_name = data.group_name
        }
        this.form.executives = data.executive
        this.form.tags = data.tags?.join(',')
        this.form.follow_index = data.follow_index
        this.form.follow_note_id = data.follow_note_id
        this.form.follow_region = data.follow_region
        this.form.follow_total = data.follow_total
        this.form.follow_user_id = data.follow_user_id
        this.form.follow_user_sec_id = data.follow_user_sec_id
        // this.form.intervals = data.intervals
        this.form.max = data.max
        this.form.min = data.min
        this.form.send_end_cursor = data.send_end_cursor
        this.form.send_start_cursor = data.send_start_cursor
        // this.form.text = data.text
        if(this.type === 2) {
          this.form.text = data.text
        }
        if(data.text) {
          this.resources = false
        }
        if(this.type === 5) {
          this.form.card_text = data.text
          if (data.text) {
            this.form.card_text = []
            data.text.forEach(item => this.form.card_text.push(item))
          }
        }
        if(this.type === 1) {
          this.form.video_text = data.text
          if (data.text) {
            this.form.video_text = []
            data.text.forEach(item => this.form.video_text.push(item))
          }
        }
        // this.form.number = data.number
        this.form.remark = data.remark
        this.dialogVisible = true
        if (data.video) {
          this.form.video = []
          data.video.forEach(item => this.form.video.push({ value: item }))
        }
        /* if (data.text) {
          this.form.text = []
          data.text.forEach(item => this.form.text.push({ value: item }))
        } */
        if (data.rich_text) {
          this.form.rich_text = []
          data.rich_text.forEach(item => this.form.rich_text.push({ value: item }))
        }
        if (data.image) {
          this.form.image = []
          data.image.forEach(item => this.form.image.push({ value: item }))
        }
        if (data.name_card) {
          this.form.name_card = []
          data.name_card.forEach(item => this.form.name_card.push({ value: item }))
        }
        if (data.proxy_info) {
          this.form.proxy_info = []
          data.proxy_info.forEach(item => this.form.proxy_info.push({ value: item }))
        }
        if (data.keywords) {
          this.form.keywords = []
          data.keywords.forEach(item => this.form.keywords.push({ value: item }))
        }
      } else {
        this.$message.error('无法创建')
        return
      }
    },
    closeProxy() {
      this.disalogProxy = false
    },
    async stop(id) {
      await api.stopTask({ id })
    },
    handleSizeChange(p, size) {
      this.searchData.page_size = size
      this.init()
    },
    getGroupId(id, name) {
      this.dialogGroupId = false
      this.form.executive_group = id
      this.form.executive_group_name = name
    },
    async postTask(params) {
      let executive = null
      if (this.form.executives != null && this.form.executives !== '') {
        var executivesStr = '' + this.form.executives
        if (executivesStr.indexOf(",") >= 0){
          executive = this.form.executives
        }else{
          executive = [this.form.executives]
        }
        
      }
      executive = executive == null ? null : executive.map(item => Number(item))
      const executive_group = this.form.executive_group === '' ? null : Number(this.form.executive_group)
      const remark = this.form.remark === '' ? null : this.form.remark
      if (this.form.executive_group === '' && this.form.executives === '') {
        this.$message.error('执行任务的组ID和执行任务的账号ID至少有一个')
        return true
      }
      const res = await api.postTask({
        belong: this.userInfo.data.i,
        executive,
        remark,
        executive_group,
        ...params
      })
      if (res.code === 0) {
        this.dialogVisible = false
        this.loading = false
        this.selectedRowNameCard = []
        this.selectedRowVideo = []
        this.$message.success('提交成功')
        this.type = 5
        this.init()
      }
    },
    resetForm() {
      this.form.executive_group = ''
      // this.form.executives = ''
      this.form.executive_group_name = ''
      // this.form.number = 10
      // this.form.intervals = 10
      this.form.max = 10
      this.form.min = 3
      this.form.follow_total = 10
      this.form.follow_index = 1
      this.form.follow_note_id = ''
      this.form.follow_user_id = ''
      this.form.follow_user_sec_id = ''
      this.form.follow_region = ''
      this.form.remark = ''
      this.form.tags = ''
      this.form.video = [{ value: '' }] 
      this.form.text = [{ value: '' }]
      this.form.card_text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
      this.form.gender = [{ value: '' }]
      this.form.proxy_info = [{ value: '' }]
      this.form.keywords = [{ value: '' }]
      this.form.resourceName = ''
    },
    computeArr(arr) {
      if (arr.length === 1 && arr[0].value === '') {
        return null
      } else {
        // eslint-disable-next-line prefer-const
        let array = []
        arr.forEach(item => {
          array.push(item.value)
        })
        return array
      }
    },
    async del(id) {
      const res = await api.delTask(id)
      if (res.code === 0) {
        this.getTableData()
      }
    }
  }
}
