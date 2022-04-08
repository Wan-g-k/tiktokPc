<template>
  <div>
    <!-- <a-button type="primary" @click="upload">文件上传</a-button> -->
    <div @click="upload" style="border: 1px dashed #d9d9d9; background: #fafafa;border-radius: 5px; padding: 20px 0;">
      <p v-if="!uploadLoadingVisible" style="font-size: .25rem; text-align: center; color: #40a9ff;" >
        <a-icon type="cloud-upload"/>
      </p>
      <p v-if="!uploadLoadingVisible" class="ant-upload-text" style="font-size: .1rem;text-align: center;padding: 10px 0;">
        {{this.$t('user.clickUpload')}}
      </p>
      <p v-if="uploadLoadingVisible" class="ant-upload-drag-icon" style="text-align: center;padding-bottom: 20px;">
        <a-spin size="large" />
      </p>
      <p v-if="uploadLoadingVisible" class="ant-upload-text" style="font-size: .1rem;text-align: center;">
        {{this.$t('user.fileUpload')}}
      </p>
      <p style="font-size: .1rem;text-align: center; padding: 10px 0;">http://45.207.44.6:12345/v2/api/get/phone?name={{this.form.name}}</p>
    </div>
    <a-modal v-model="uploadVisible" title="文件上传" ok-text="确认" cancel-text="取消" @ok='submitMwssage'>
      <a-form-model v-if="!uploadLoadingVisible" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="用户名称" prop="name">
          <a-input v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="文件内容">
          <a-upload-dragger
            :file-list="fileList"
            :remove="handleRemove" :before-upload="beforeUpload"
          >
          <a-icon style="font-size: .2rem; color: #40a9ff;" type="cloud-upload" />
          </a-upload-dragger>
          <!-- <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
            <a-button>
              <a-icon type="upload" /> 上传
            </a-button>
          </a-upload> -->
        </a-form-model-item>
      </a-form-model>
      <p v-if="uploadLoadingVisible" class="ant-upload-drag-icon" style="text-align: center;padding-bottom: 20px;">
        <a-spin size="large" />
      </p>
      <p v-if="uploadLoadingVisible" class="ant-upload-text" style="text-align: center;">
        文件正在上传请稍后。。。
      </p>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios' // 引入axios
export default {
  data() {
    return {
      uploadVisible: false,
      uploadLoadingVisible: false,
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

  },
  methods: {
    upload() {
      this.uploadVisible = true
    },
    submitMwssage() {
      this.uploadLoadingVisible = true
      axios({
        url: 'http://45.207.44.6:12345/v2/api/upload/phone',
        method: 'post',
        data: {
          userName: this.form.name,
          phoneList: this.fileDataList
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.uploadVisible = false
          this.uploadLoadingVisible = false
          this.$message.success(res.data.msg)
        }
      }).catch(err => {
        this.$message.error(err.data.msg)
      })
      // this.uploadVisible = false
    },
    handleRemove(file) {
      console.log(file)
    },
    beforeUpload(file) {
      let reader = new FileReader()
      reader.onload = (e) => {
        let fileList = e.target.result
        this.fileDataList = fileList.split(/[(\r\n)\r\n]+/)
      }
      reader.readAsText(file)
      this.fileList = []
      this.fileList = [file]
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
