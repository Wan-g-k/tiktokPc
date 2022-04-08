<template>
  <div>
    <a-upload-dragger
      :file-list="fileList"
      :remove="handleRemove" :before-upload="beforeUpload"
    >
      <p v-if="!uploadVisible" class="ant-upload-drag-icon">
        <a-icon type="cloud-upload" />
      </p>
      <p v-if="uploadVisible" class="ant-upload-drag-icon">
        <a-spin size="large" />
      </p>
      <p v-if="!uploadVisible" class="ant-upload-text">
        <!-- 单击或拖动文件到此区域上传 -->
        {{this.$t('user.dragFile')}}
      </p>
      <p v-if="uploadVisible" class="ant-upload-text">
        <!-- 文件正在上传请稍后。。。 -->
        {{this.$t('user.fileUpload')}}
      </p>
    </a-upload-dragger>
    <!-- <a-button type="primary" @click="upload">文件上传</a-button>
    <a-modal v-model="uploadVisible" title="文件上传" ok-text="确认" cancel-text="取消" @ok='submitMwssage'>
      <a-form-model layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item label="用户名称">
          <a-input v-model="form.name" readOnly/>
        </a-form-model-item>
        <a-form-model-item label="文件内容">
          <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
              <a-button>
                <a-icon type="upload" /> 上传
              </a-button>
            </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-modal> -->
  </div>
</template>

<script>
import * as api from '@/api/index'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      uploadVisible: false,
      form_rule: {
        name: [
          { required: true, message: '请输入文件名称', trigger: 'blur' },
        ]
      },
      form: {
        name: null,
        messageList:null
      },
      fileList: [],
      fileDataList: []
    }
  },
  mounted() {

  },
  methods:{
    upload() {
      this.uploadVisible = true
      this.form.name = window.sessionStorage.getItem('userName')
    },
    submitMwssage() {
      this.form.name = window.sessionStorage.getItem('userName')
      if(!this.form.messageList) {
        this.$message.error('请重新选择文件')
        return false
      }
      if(this.form.messageList) {
        let messageList = this.form.messageList
        let index = 0
        let newArray = []
        while(index < messageList.length) {
            newArray.push(messageList.slice(index, index += 200))
        }
        // console.log(newArray)
        newArray.map(item => {
          if(this.form.name) {
            let form = {}
            form.username = this.form.name
            form.list = item
            api.postUserUploadData(form).then(res => {
              if(res.code === 0) {
              }
            }).catch(err => {
              this.$message.error(err.msg)
              return
            })
          }
        })
        this.uploadVisible = false
        this.fileList = []
        this.$message.success('上传成功，正在处理中。。。。')
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
      let thes = this
      thes.uploadVisible = true
      thes.fileList = [file]
      thes.form.name = window.sessionStorage.getItem('userName')
      let reader = new FileReader()
      let extension = file.name.substring(file.name.lastIndexOf('.')+1)
      let size = file.size / 1024 / 1024;
      thes.form.messageList = null
      if(extension != 'xls' && extension != 'xlsx') {
        thes.$message.warning('只能上传.xlsx或xls的文件')
        return
      }
      if(size > 20) {
        thes.$message.warning('文件大小不得超过20M')
        return
      }
      reader.onload = (e) => {
        let fileList =e.target.result
        let fileEXL = XLSX.read(fileList,{type: 'binary', cellDates: true})
        let workSheet = fileEXL.Sheets[fileEXL.SheetNames[0]]
        let data = XLSX.utils.sheet_to_json(workSheet)
        thes.form.messageList = data.map(item => {
          if(item.sec_uid && item.国家) {
            return {avatar: '', nickname: item.用户名, uid: item.粉丝_uid.toString(), unique_id: item.用户名,
              sec_uid: item.sec_uid, posts_number: 0, follow_number: 0, friends_number: Number(item.粉丝数),
              signature: '', region: item.国家}
          }
          if(item.secUid && item.region) {
            return {avatar: item.headImg, nickname: item.nickname, uid: item.uid.toString(), unique_id: item.unique_id,
              sec_uid: item.secUid, posts_number: Number(item.postNum), follow_number: Number(item.followingNum), friends_number: Number(item.followerNum),
              signature: item.profile, region: item.region}
          }
        })
      }
      reader.readAsBinaryString(file)
      setTimeout((e) => {
        thes.submitMwssage()
      },3000)
      
      return false
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
