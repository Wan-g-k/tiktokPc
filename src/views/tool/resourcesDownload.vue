<template>
  <div>
    <a-form layout="inline" :model="searchData" class="demo-form-inline">
      <a-form-item :label="this.$t('user.searchContent')">
        <a-input v-model="searchData.keyword" :placeholder="this.$t('user.searchContent')" allow-clear />
      </a-form-item>
      <a-form-item>
				<a-button type="primary" @click="getResourcesTableData()">{{this.$t('admin.Inquire')}}</a-button>
				<a-button style="margin-left: 8px" type="primary" @click="videoDownload">{{this.$t('user.videoDownload')}}</a-button>
				<a-button style="margin-left: 8px" type="primary" @click="userDownload">{{this.$t('user.bloggerDownload')}}</a-button>
			</a-form-item>
		</a-form>
		<div class="table-box">
			<a-table :columns="columns" :data-source="tableData" :row-key="record => record.video_id" :scroll="{ x: 1200}" class="tableLimit" :row-selection="{selectedRowKeys: resourcesId ,onChange: rowSelectionValue}" :bordered="true" :pagination="false">
				<templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="userAvatar" slot-scope="text, row ">
          <a-avatar :src="row.userAvatar" />
          <p>{{ row.userNickname }}</p>
        </span>
				<span slot="action" slot-scope="text, row">
					<a-button type="primary" @click="userVisible(row)">{{$t('user.previewBlogger')}}</a-button>
					<a-button type="primary" style="margin-left: 10px" @click="videoVisible(row)">{{$t('user.previewVideo')}}</a-button>
				</span>
			</a-table>
			<p style="margin: 10px 0px 10px 50%; cursor:pointer;" v-if="has_more" @click="check">{{this.$t('user.seeMore')}}</p>
			<p style="margin: 10px 0px 10px 50%; cursor:pointer;" v-else-if="!has_more">{{this.$t('user.noMore')}}</p>
			<a-modal v-model="userMessageVisible" :title="this.$t('user.previewBloggerInformation')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')">
        <div style="height:200px; overflow-y:auto;">
          <p>{{this.$t('user.blogger')}}：{{userMessage.nickname}}</p>
					<p>{{this.$t('user.bloggerAvatar')}}：<a-avatar :src="userMessage.avatar" /></p>
					<p>{{this.$t('user.bloggerAddress')}}：{{userMessage.region}}</p>
					<p>{{this.$t('user.bloggerBusinessCardAddress')}}：<a :href='userMessage.share_url' :title="this.$t('user.bloggerBusinessAard')" target="_blank">{{userMessage.share_url}}</a></p>
        </div>
      </a-modal>
			<a-modal v-model="videoMessageVisible" :title="this.$t('user.previewVideoInformation')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')">
        <div style="height:300px; overflow-y:auto;">
          <p>{{this.$t('user.videoInformation')}}：{{videoMessage.desc}}</p>
					<p>{{this.$t('user.videoCover')}}</p>
          <img style="height:100px; width: 100px;border-radius: 10px" :src="videoMessage.cover">
					<p>{{this.$t('user.videoURL')}}：<a :href='videoMessage.share_url' :title="this.$t('user.bloggerBusinessAard')" target="_blank">{{videoMessage.share_url}}</a></p>
        </div>
      </a-modal>
		</div>
	</div>
</template>

<script>
const columns = [{
  // title: '博主',
  slotName: 'user.blogger',
  dataIndex: 'userAvatar',
  align: 'center',
  width: '200px',
  scopedSlots: { customRender: 'userAvatar', title: 'user.blogger' }
},
{
  // title: '视频简介',
  slotName: 'user.videoInformation',
  dataIndex: 'search_desc',
  ellipsis: true,
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'search_desc', title: 'user.videoInformation' }
},
{
  // title: '视频地址',
  slotName: 'user.videoURL',
  dataIndex: 'share_url',
  ellipsis: true,
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'share_url', title: 'user.videoURL' }
},
{
  // title: '视频上传时间',
  slotName: 'user.videoUploadTime',
  dataIndex: 'video_time',
  ellipsis: true,
  width: '300px',
  align: 'center',
  scopedSlots: { customRender: 'video_time', title: 'user.videoUploadTime' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  width: '250px',
  fixed: 'right',
  align: 'center',
  scopedSlots: { customRender: 'action', title: 'admin.operate' }
}]
import * as api from '@/api/index'
export default {
  data() {
    return {
      columns: columns,
      searchData: {
        keyword: '',
        offset: 0
      },
      total: 0,
      tableData: [],
      fileList: [],
      fileDataList: [],
      resourcesId: [],
      resourcesValue: [],
      videoMessage: {},
      userMessage: {},
      has_more: false,
      videoMessageVisible: false,
      userMessageVisible: false,
      list: [123 + '\r\n' + 123 + '\r\n' + 123 + '\r\n' + 123 + '\r\n']
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.searchData.keyword = ''
      this.searchData.offset = 0
    },
    getResourcesTableData() {
      let form = {}
      form.keyword = this.searchData.keyword
      form.offset = this.searchData.offset
      api.postUserSearch(form).then(res => {
        if (res.code === 0) {
          this.searchData.offset = res.data.cursor
          this.has_more = res.data.has_more
          this.tableData = res.data.data.map(item => {
            return { ...item,
              userAvatar: item.aweme_info.author.avatar_thumb.url_list[0],
              cover: item.aweme_info.video.cover.url_list[0],
              userNickname: item.aweme_info.author.nickname,
              video_time: new Date(item.aweme_info.create_time * 1000).toLocaleString().replace(/:\d{1,2}$/, ' '),
              videoID: item.aweme_info.aweme_id,
              userSec_uid: item.aweme_info.author.sec_uid,
              share_url: item.aweme_info.share_url,
              search_desc: item.aweme_info.search_desc,
              userUid: item.aweme_info.author.uid,
              userUnique_id: item.aweme_info.author.unique_id }
          })
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    rowSelectionValue(selectedRowKeys, value) {
      this.resourcesId = []
      this.resourcesValue = []
      selectedRowKeys.forEach(item => {
        this.resourcesId.push(item)
      })
      value.forEach(item => {
        this.resourcesValue.push(item)
      })
    },
    //  下载视频地址
    videoDownload() {
      let videoTextList = this.resourcesValue.map(item => {
        return item.videoID
      })
      let videoText = Array.from(new Set(videoTextList))
      let str = videoText.toString()
      let strList = str.replace(/,/g, '\r\n')
      let list = []
      list.push(strList)
      let videoIDText = list
      this.downloadTxt(videoIDText, '视频信息')
    },
    //  下载博主地址
    userDownload() {
      let userTextList = this.resourcesValue.map(item => {
        return item.userUid + '|' + item.userSec_uid
      })
      let userText = Array.from(new Set(userTextList))
      let str = userText.toString()
      let strList = str.replace(/,/g, '\r\n')
      let list = []
      list.push(strList)
      let userIDText = list
      this.downloadTxt(userIDText, '名片信息')
    },
    check() {
      let form = {}
      form.keyword = this.searchData.keyword
      form.offset = this.searchData.offset
      api.postUserSearch(form).then(res => {
        if (res.code === 0) {
          this.searchData.offset = res.data.cursor
          this.has_more = res.data.has_more
          let tableData = res.data.data.map(item => {
            return { ...item,
              userAvatar: item.aweme_info.author.avatar_thumb.url_list[0],
              cover: item.aweme_info.video.cover.url_list[0],
              userNickname: item.aweme_info.author.nickname,
              video_time: new Date(item.aweme_info.create_time * 1000).toLocaleString().replace(/:\d{1,2}$/, ' '),
              videoID: item.aweme_info.aweme_id,
              userSec_uid: item.aweme_info.author.sec_uid,
              share_url: item.aweme_info.share_url,
              search_desc: item.aweme_info.search_desc,
              userUid: item.aweme_info.author.uid,
              userUnique_id: item.aweme_info.author.unique_id }
          })
          let tableDataas = this.tableData.concat(tableData)
          this.tableData = tableDataas
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    downloadTxt(text, fileName) {
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', fileName)
      element.style.display = 'none'
      element.click()
    },
    userVisible(row) {
      this.userMessageVisible = true
      let userMessage = {}
      this.userMessage = {}
      userMessage.avatar = row.userAvatar
      userMessage.nickname = row.userNickname
      userMessage.sec_uid = row.userSec_uid
      userMessage.share_url = row.share_url
      userMessage.uid = row.userUid
      userMessage.unique_id = row.userUnique_id
      this.userMessage = userMessage
    },
    videoVisible(row) {
      this.videoMessageVisible = true
      let videoMessage = {}
      this.videoMessage = {}
      videoMessage.cover = row.cover
      videoMessage.create_time = row.video_time
      videoMessage.desc = row.search_desc
      videoMessage.share_url = row.share_url
      videoMessage.video_id = row.video_id
      this.videoMessage = videoMessage
    }
  }
}
</script>
