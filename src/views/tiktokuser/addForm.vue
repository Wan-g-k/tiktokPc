<template>
  <div>
    <a-modal v-model="childDialogVisible" :title="this.$t('user.newAttention')" width="400px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="handleAdd" @cancel="closeForm">
      <a-form ref="form" :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item :label="$t('user.taskPort')">
          <a-input v-model="executive_group_name" @click="dialogGroupVisible" readOnly/>
        </a-form-item>
        <a-form-item :label="$t('user.intervals')">
          <a-input-number style="width: 45%;" v-model="form.min" :min="0" :max="100"/> ---- <a-input-number style="width: 45%;" v-model="form.max" :min="0" :max="100"/>
          <!-- <a-input v-model="form.intervals" oninput="value=value.replace(/\D/g,'')"/> -->
        </a-form-item>
        <a-form-item :label="$t('admin.remark')">
          <a-input v-model="form.remark"/>
        </a-form-item>
      </a-form>
      <span slot="footer">
        <a-button style="margin-left:10px;" class="add-btn" type="success" @click="closeForm">{{$t('admin.cancel')}}</a-button>
        <a-button style="margin-left:10px;" type="primary" :loading="loading" @click="handleAdd">{{$t('admin.confirm')}}</a-button>
      </span>
    </a-modal>
    <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" />
  </div>
</template>

<script>
import * as api from '@/api/index'
import group from '@/components/group/index'
export default {
  components: {
    group
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    tiktokUser: {
      type: Array,
      // eslint-disable-next-line space-before-function-paren
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      childDialogVisible: false,
      dialogGroupId: false,
      executive_group: [],
      form: {
        type: 3,
        executive_group: '',
        executives: '',
        tiktok_user: [],
        is_send_all: null,
        video: null,
        text: null,
        rich_text: null,
        remark: '',
        intervals: 3,
        image: null,
        name_card: null,
        gender: null,
        min: '',
        max: ''
      },
      rich_text_form: {
        title: '',
        desc: '',
        avatar: '',
        link: '',
        text: ''
      },
      executive_group_name: '',
      loading: false
    }
  },
  watch: {
    dialogVisible(newValue, oldValue) {
      this.form.remark = ''
      this.form.intervals = 3
      this.executive_group_name = []
      this.form.executive_group = ''
      this.childDialogVisible = newValue
    },
    childDialogVisible(newValue, oldValue) {
      if (!newValue) {
        this.executive_group_name = []
        this.form.executive_group = []
        this.$emit('closeForm')
      }
    }
  },
  methods: {
    getGroupId(ids, name) {
      console.log(ids)
      this.form.executive_group = ids
      this.executive_group_name = ids
    },
    dialogGroupVisible() {
      this.dialogGroupId = true
      this.form.executive_group = []
      this.executive_group_name = []
    },
    async handleAdd() {
      if (this.validateForm()) return
      this.loading = true
      let form = {}
      form.type = 3
      form.belong = Number(this.userInfo.data.i)
      if(this.form.executive_group != []) {
        form.executive = this.form.executive_group
      } else if(this.form.executive_group = []) {
        this.$message.error('请选择端口')
      }
      // tik tok
      form.follow_user = this.tiktokUser
      form.remark = this.form.remark
      // form.intervals = Number(this.form.intervals)
      form.max = Number(this.form.max)
      form.min = Number(this.form.min)
      // console.log(form)
      const res = await api.postTask(form)
      if (res && res.code === 0) {
        this.loading = false
        this.$emit('closeForm')
        this.$emit('success')
      }
    },
    closeForm() {
      this.executive_group_name = []
      this.form.executive_group = ''
      this.$emit('closeForm')
      this.$emit('success')
    },
    validateForm() {
      if (this.form.executive_group === '') {
        this.errorInfo('执行任务的组未选择')
        return true
      }
      return false
    },
    errorInfo(msg) {
      this.$message.error(msg)
    }
  }
}
</script>

<style lang="scss">
</style>
