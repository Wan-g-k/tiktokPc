<template>
  <div style="margin: 0 auto;">
    <a-upload-dragger
      :file-list="fileList"
      :remove="handleRemove"
      :multiple="true"
      :before-upload="beforeUpload"
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
    <a-button type="primary" style="margin-top: 10px;" @click="submitMwssage">
      上传
    </a-button>
    <a-button type="primary" style="margin-top: 10px;margin-left: 50px;" @click="submitMwssageV2">
      上传V2
    </a-button>
    <!-- <a-button type="primary" @click="upload">文件上传</a-button>
    <a-modal v-model="uploadVisible" title="文件上传" ok-text="确认" cancel-text="取消" @ok='submitMwssage'>
      <a-form-model layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item label="用户名称" prop="name">
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
        messageList: null
      },
      fileList: [],
      fileDataList: []
    }
  },
  mounted() {
    this.form.name = window.sessionStorage.getItem('userName')
  },
  methods: {
    upload() {
      this.uploadVisible = true
      this.form.name = window.sessionStorage.getItem('userName')
    },
    submitMwssage() {
      let fileDataList = this.fileDataList
      let index = 0
      let newArray = []
      while (index < fileDataList.length) {
        newArray.push(fileDataList.slice(index, index += 1))
      }
      newArray.map(item => {
        let form = {}
        form.username = window.sessionStorage.getItem('userName')
        try {
          form.token = JSON.parse(item)
        } catch (d) {
          this.$message.error('文件内容格式有误，请检查文件')
          return
        }
        if (JSON.parse(item).token) {
          form.token = JSON.parse(item).token
          setTimeout(this.Upload(form), 2000)
        } else {
          form.token = JSON.parse(item)
          setTimeout(this.Upload(form), 2000)
        }
      })
      this.uploadVisible = false
      this.$message.success('上传成功，正在处理中。。。。')
      this.fileList = []
    },
    async Upload(form) {
      const res = await api.postUserAccountUpload(form)
      if (res.code !== 0) {
        this.$message.error('上传失败，请重新上传')
      }
    },
    submitMwssageV2() {
      let fileList = this.fileDataList[0].split(/[(\r\n)\r\n]+/)
      let fileDataList = fileList
      let index = 0
      let newArray = []
      while (index < fileDataList.length) {
        newArray.push(fileDataList.slice(index, index += 1))
      }
      newArray.map(item => {
        let form = {}
        form.username = window.sessionStorage.getItem('userName')
        try {
          form.token = JSON.parse(item)
        } catch (d) {
          this.$message.error('文件内容格式有误，请检查文件')
          return
        }
        if (JSON.parse(item).token) {
          form.token = JSON.parse(item).token
          this.UploadV2(form)
        } else {
          form.token = JSON.parse(item)
          this.UploadV2(form)
        }
        // this.UploadV2(form)
        /* setTimeout(
          api.postUserAccountUploadV2(form).then(res => {
          }).catch(err => {
            this.$message.error(err.msg)
            this.uploadVisible = false
            return
          }), 2000) */
      })
      this.uploadVisible = false
      this.$message.success('上传成功，正在处理中。。。。')
      this.fileList = []
    },
    async UploadV2(form) {
      const res = await api.postUserAccountUploadV2(form)
      if (res.code !== 0) {
        this.$message.error('上传失败，请重新上传')
      }
      /* if (res.code !== 0) {
        this.$message.error('上传失败，请重新上传')
      } */
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      // console.log(file)
      let thes = this
      let reader = new FileReader()
      // thes.form.name = window.sessionStorage.getItem('userName')
      reader.onload = (e) => {
        let fileList = e.target.result
        // thes.fileDataList = []
        thes.fileList.push(file)
        thes.fileDataList.push(e.target.result)
        /* if (thes.fileList.length > 1) {
          thes.fileDataList = e.target.result.split(/[(\r\n)\r\n]+/)
        } else {
          thes.fileDataList.push(e.target.result)
        } */
        // thes.fileDataList.push(e.target.result) // 单调数据
        // thes.fileDataList = e.target.result.split(/[(\r\n)\r\n]+/)
        // thes.fileDataList = fileList.split(/[(\r\n)\r\n]+/)
        /* try {
          JSON.parse(e.target.result).map(item => {
            thes.fileDataList.push(JSON.stringify(item))
          })
          // console.log(thes.fileDataList)
        } catch (d) {
          thes.fileDataList = fileList.split(/[(\r\n)\r\n]+/)
        } */
      }
      thes.fileList = []
      reader.readAsText(file)
      /* setTimeout((e) => {
          thes.submitMwssage()
        },2000) */
      // thes.fileList.push(file)
      // console.log(file)
      /* if (thes.fileList.length !== 0) {
        thes.uploadVisible = true
      } */
      return false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
