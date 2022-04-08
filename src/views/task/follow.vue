<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item :label="$t('user.concernType')">
          <a-select v-model="searchData.type" style="width:150px" @change="changeSelect">
            <!-- <a-select-option :value="1">关注 用户的粉丝</a-select-option> -->
            <!-- <a-select-option :value="5">关注 单个用户</a-select-option>
            <a-select-option :value="1">关注 TIKTOK用户</a-select-option> -->
            <a-select-option :value="3">{{this.$t('user.followTKUsers')}}</a-select-option>
            <!-- <a-select-option :value="2">关注 帖子下的用户</a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init">{{this.$t('admin.Inquire')}}</a-button>
          <!-- <a-button style="margin-left:10px;" type="primary" @click="dialogVisible = true">新增</a-button> -->
          <a-button style="margin-left:10px;" type="primary"  @click="Attention()">{{this.$t('user.concern')}}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- <div>点击刷新：查看实时数据</div> -->
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :loading="tableLoading" :row-key="record => record.id" :scroll="{ x:1200 }" class="tableLimit" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="executive" slot-scope="text, row">
          {{ row.executive}}{{ row.executive}}
        </span>
        <span slot="tiktok" slot-scope="text, row">
          {{ row.tiktok_user }}
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button @click="view(row)">{{$t('user.check')}}</a-button>
          <a-button style="margin-left: 8px;" @click="Refresh(row.id)">刷新</a-button>
          <a-button v-if="searchData.type != 1" style="margin-left:8px" type="primary" @click="create(row)">{{ $t('user.create') }}</a-button>
          <!-- <a-button style="margin-left: 8px;background:#E6A23C;color:white" @click="stop(row.id)">停止</a-button> -->
          <a-popconfirm :title="$t('admin.deleteOrNot')" :ok-text="$t('admin.Yes')" :cancel-text="$t('admin.No')" @confirm="del(row.id)">
            <a-button style="margin-left: 8px" type="danger">{{ $t('admin.delete') }}</a-button>
          </a-popconfirm>
          <!-- <a-button type="primary" style="margin-left: 8px;" @click="pause(row)">暂停</a-button> -->
        </span>
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :total="total" :current="searchData.page" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <a-modal v-model="dialogVisible" :title="$t('admin.Add')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="500px" @ok="addTask">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <!-- <a-form-model-item label="关注类型">
            <a-select v-model="form.type" placeholder="选择关注类型" @change="changeFormSelect">
              <a-select-option :value="1">关注 用户的粉丝</a-select-option>
              <a-select-option :value="2">关注 帖子下的用户</a-select-option>
              <a-select-option :value="3">关注 TIKTOK用户</a-select-option>
            </a-select>
          </a-form-model-item> -->
          <!-- <a-form-model-item label="任务分组">
            <a-input v-model="form.executive_group_name" @click="dialogGroupId = true" />
          </a-form-model-item> -->
          <a-form-model-item :label="$t('user.taskPort')">
            <a-input v-model="form.executives" @click="dialogGroupId = true" readOnly/>
          </a-form-model-item>
          <a-form-model-item :label="$t('user.intervals')">
            <a-input-number style="width: 165px;" v-model="form.min" :min="0" :max="100"/> ---- <a-input-number style="width: 165px;" v-model="form.max" :min="0" :max="100"/>
            <!-- <a-input v-model="form.intervals" placeholder="间隔时间" /> -->
          </a-form-model-item>
          <!-- <a-form-model-item v-if="form.type == 1 || form.type == 2" :label="numberText[form.type]">
            <a-input v-model="form.follow_total" placeholder="目标总数" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 1 || form.type == 2" label="开始下标">
            <a-input v-model="form.follow_index" placeholder="开始下标" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 2" label="视频链接">
            <a-input-search placeholder="例:https://www.tiktok.com/@yua_mikami/video/7004832688272100610" enter-button @search="onSearchVideo" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 2" label="帖子ID">
            <a-input v-model="form.follow_note_id" placeholder="帖子ID" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 1" label="用户链接">
            <a-input-search placeholder="例:https://vm.tiktok.com/ZSJwYMKcR/" enter-button @search="onSearchUser" />
          </a-form-model-item>

          <a-form-model-item v-if="form.type == 1" label="用户UID">
            <a-input v-model="form.follow_user_id" placeholder="用户UID" />
          </a-form-model-item>
          <a-form-model-item v-if="form.type == 1" label="用户secUid">
            <a-input v-model="form.follow_user_sec_id" placeholder="用户secUid" />
          </a-form-model-item> -->
          <a-form-model-item label="代理区域">
            <!-- <a-input v-model="form.proxy_region" oninput="value=value.replace(/\s/g,'')" placeholder="代理区域" /> -->
            <a-select v-model="form.proxy_region">
              <a-select-option v-for="(item, index) in proxy_region" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('user.area')">
            <a-input v-model="form.follow_region" oninput="value=value.replace(/\s/g,'')" :placeholder="$t('user.area')" />
          </a-form-model-item>

          <a-form-model-item :label="$t('admin.quantity')">
            <a-input v-model="form.follow_user_num" :placeholder="$t('admin.quantity')" oninput="value=value.replace(/\D/g,'')"/>
          </a-form-model-item>

          <a-form-model-item :label="$t('admin.remark')">
            <a-input v-model="form.remark" :placeholder="$t('admin.remark')" />
          </a-form-model-item>
        </a-form-model>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="dialogVisible = false">{{$t('admin.cancel')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="loading" @click="addTask">{{$t('admin.confirm')}}</a-button>
        </span>
      </a-modal>
      <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
      <!-- <pack :dialog-pack="dialogPack" /> -->
    </div>
  </div>
</template>

<script>
import mixin from './mixin/mixin'
// import { columns } from './mixin/mixin'
import * as api from '@/api/index'
import { message } from 'ant-design-vue'
// 防抖动
function debounce(func, wait=1500){
 let timeout;
 return function(event){
  clearTimeout(timeout)
  timeout = setTimeout(()=>{
   func.call(this, event)
  },wait)
 }
}
const columns = [{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title:'admin.creationTime' }
},
{
  // title: '端口',
  slotName: 'user.taskPort',
  dataIndex: 'executive',
  width: '80px',
  align: 'center',
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  },
  scopedSlots: { customRender: 'executive', title:'user.taskPort' }
},
{
  // title: '任务间隔最小时间',
  slotName: 'user.minimumTimeBetweenTasks',
  dataIndex: 'min',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'min', title:'user.minimumTimeBetweenTasks' }
},
{
  // title: '任务间隔最大时间',
  slotName: 'user.maximumTimeBetweenTasks',
  dataIndex: 'max',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'max', title:'user.maximumTimeBetweenTasks' }
},
{
  // title: '发送数量',
  slotName: 'user.quantitySent',
  dataIndex: 'task_execute',
  align: 'center',
  width: '100px',
  scopedSlots: { customRender: 'max', title:'user.quantitySent' }
},
{
  // title: '发送失败',
  slotName: 'user.failedSend',
  dataIndex: 'task_fail',
  align: 'center',
  width: '100px',
  scopedSlots: { customRender: 'max', title:'user.failedSend' }
},
{
  // title: '发送成功',
  slotName: 'user.sentSuccessfully',
  dataIndex: 'task_success',
  align: 'center',
  width: '100px',
  scopedSlots: { customRender: 'max', title:'user.sentSuccessfully' }
},
{
  // title: '备注',
  slotName: 'admin.remark',
  dataIndex: 'remark',
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'remark', title:'admin.remark' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '180px',
  align: 'center',
  scopedSlots: { customRender: 'action', title:'admin.operate' }
},
]
export default {
  mixins: [mixin],
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        page: 1,
        page_size: 10,
        type: 3,
        order_created_at: true
      },
      columns: [],
      tableLoading: false,
      loading: false,
      numberText: {
        6: '单个账号关注总数',
        5: '目标总数',
        4: '单个账号关注总数'
      },
      proxy_region: [
        { label: 'BR+ip:311155', value: 'BR' },
        { label: 'FR+ip:72877', value: 'FR' },
        { label: 'PK+ip:52106', value: 'PK' },
        { label: 'SA+ip:46973', value: 'SA' },
        { label: 'US+ip:42044', value: 'US' },
        { label: 'EC+ip:38207', value: 'EC' },
        { label: 'MY+ip:37913', value: 'MY' },
        { label: 'RU+ip:36454', value: 'RU' },
        { label: 'MX+ip:33768', value: 'MX' },
        { label: 'UA+ip:33696', value: 'UA' },
        { label: 'MA+ip:32206', value: 'MA' },
        { label: 'PH+ip:30748', value: 'PH' },
        { label: 'CA+ip:25115', value: 'CA' },
        { label: 'ES+ip:22480', value: 'ES' },
        { label: 'IT+ip:19447', value: 'IT' },
        { label: 'VN+ip:17955', value: 'VN' },
        { label: 'AR+ip:16978', value: 'AR' },
        { label: 'ID+ip:15997', value: 'ID' },
        { label: 'GB+ip:14884', value: 'GB' },
        { label: 'TH+ip:13081', value: 'TH' },
        { label: 'BD+ip:12389', value: 'BD' },
        { label: 'SG+ip:11911', value: 'SG' },
        { label: 'UZ+ip:11632', value: 'UZ' },
        { label: 'KZ+ip:10856', value: 'KZ' },
        { label: 'DE+ip:10694', value: 'DE' },
        { label: 'IN+ip:10413', value: 'IN' }
      ],
      role: 0,
      form: {
        type: 6,
        executive_group: '',
        executives: '',
        remark: '',
        video: [{ value: '' }],
        follow_user_id: '',
        follow_user_sec_id: '',
        follow_note_id: '',
        follow_user_num: 10,
        // intervals: 3,
        min: 3,
        max: 10,
        region: '',
        follow_region: '',
        proxy_region: ''
      },
      form_rule: {}
    }
  },
  created() {
    const role = JSON.parse(window.sessionStorage.getItem('userInfo')).data.r
    if (role === 2) {
      this.$router.push({ name: 'User' })
    }
  },
  mounted() {
    this.changeSelect(6)
    this.form.type = 3
    this.columns = []
    this.role = this.userInfo.data.r
    columns.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columns.push(item)
    })
    // this.init()
  },
  methods: {
    async getTableData() {
      this.tableLoading = true
      this.searchData.type = 3
      const res = await api.getTask(this.searchData)
      if (res && res.code === 0 && res.data) {
        this.tableLoading = false
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    changeFormSelect(value) {
      this.resetForm()
    },
    changeSelect(value) {
      /* this.columns = []
      columns.forEach(item => {
        if (!item.type.includes(value)) {
          return
        }
        if (item.role) {
          if (!item.role.includes(this.role)) {
            return
          }
        }
        this.columns.push(item)
      }) */
      this.init()
    },
    Refresh(id) {
      this.tableLoading = true
      api.putUserTaskRefresh(id).then(res => {
        if(res.code === 0) {
          this.init()
        }
        // console.log(res)
      })
    },
    onSearchUser(value, event) {
      // 解析用户的ID和uid
      if (value !== '') {
        api.postAnalyzeUserLink({ url: value }).then((res) => {
          if (res.code === 0) {
            if (this.form.type === 1) {
              this.form.follow_user_id = res.data.uid
              this.form.follow_user_sec_id = res.data.sec_uid
            }
            if (this.form.type === 2) {
              this.form.follow_note_id = res.data.video_id
            }
          } else {
            message.error('链接解析失败')
          }
        })
      }
    },
    onSearchVideo(value, event) {
      // 解析用户的ID和uid
      if (value !== '') {
        api.postAnalyzeVideoLink({ url: value }).then((res) => {
          if (res.code === 0) {
            if (this.form.type === 1) {
              this.form.follow_user_id = res.data.uid
              this.form.follow_user_sec_id = res.data.sec_uid
            }
            if (this.form.type === 2) {
              this.form.follow_note_id = res.data.video_id
            }
          } else {
            message.error('链接解析失败')
          }
        })
      }
    },
    getGroupId(ids) {
      this.form.executives = ids
      /* if (this.form.executives !== '') {
        this.form.executives = this.form.executives + ',' + ids
      } else {
        this.form.executives = ids
      } */
    },
    // addTask:debounce(function(e){
    addTask() {
      this.loading = true
      const form = {}
      form.type = 3
      form.belong = Number(this.userInfo.data.i)
      form.executive = this.form.executives
      form.remark = this.form.remark
      form.follow_user_num = Number(this.form.follow_user_num)
      form.region = this.form.follow_region === '' ? null : this.form.follow_region
      form.proxy_region = this.form.proxy_region === '' ? null : this.form.proxy_region
      // form.intervals = Number(this.form.intervals)
      form.max = Number(this.form.max)
      form.min = Number(this.form.min)
      api.postTask(form).then(res => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.loading = false
          this.getTableData()
        }
      })
    },
    /* async addTask() {
      const form = {}
      form.type = 3
      form.belong = Number(this.userInfo.data.i)
      form.executive = this.form.executives
      form.remark = this.form.remark
      form.follow_user_num = Number(this.form.follow_user_num)
      form.intervals = Number(this.form.intervals)
      console.log(this.form.executives)
      // switch (this.form.type) {
      //   case 1:
      //     form.type = 1
      //     form.follow_user_id =  this.form.follow_user_id
      //     form.follow_user_sec_id = this.form.follow_user_sec_id
      //     form.intervals = this.form.intervals === '' ? 0 : Number(this.form.intervals)
      //     form.region = this.form.follow_region === '' ? null : this.form.follow_region
      //     form.remark = this.form.remark === '' ? null : this.form.remark
      //     break
      //   case 2:
      //     form.type = 2
      //     form.intervals = this.form.intervals === '' ? 0 : Number(this.form.intervals)
      //     form.region = this.form.follow_region === '' ? null : this.form.follow_region
      //     form.remark = this.form.remark === '' ? null : this.form.remark
      //     form.follow_note_id = this.form.follow_note_id
      //     break
      // }
      const res = await api.postTask(form)
      if (res.code === 0) {
        this.dialogVisible = false
        this.getTableData()
      }
    }, */

    // 关注
    Attention() {
      this.dialogVisible = true
      this.form.remark = ''
      this.form.executives = ''
      this.form.follow_user_num = 10
      // this.form.intervals = 3
      this.form.Max = 3
      this.form.Max = 10
    },
    validateForm() {
      switch (this.form.type) {
        case 4:
          if (this.form.follow_note_id === '') {
            this.$message.error('帖子id需要填写')
            return true
          }
          if (this.form.follow_total % 20 !== 0) {
            this.$message.error('单个账号关注总数需为20的倍数')
            return true
          }
          break
        case 5:
          if (this.form.follow_user_id === '' && this.form.follow_user_sec_id === '') {
            this.$message.error('用户的id和secUid必需填写一项')
            return true
          }
          break
        case 6:
          if (this.form.follow_user_id === '' && this.form.follow_user_sec_id === '') {
            this.$message.error('用户的id和secUid必需填写一项')
            return true
          }
          if (this.form.follow_total % 20 !== 0) {
            this.$message.error('单个账号关注总数需为20的倍数')
            return true
          }
          break
      }
      return true
    }
  }
}
</script>

<style lang="scss">
</style>
