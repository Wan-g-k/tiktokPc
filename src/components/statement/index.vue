<template>
  <div>
      <a-modal v-model="promptVisible" width="50%" :ok-text="$t('announcement.read')" :closable="false" :cancel-text="$t('admin.cancel')" @cancel="statementCancel" @ok="statementOk">
      <div class="affiche">
        <h3 style="text-align: center;">{{ this.$t('announcement.title') }}</h3>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.detail') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.one') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.two') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.three') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.Four') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.five') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.six') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.regulation') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.measure') }}</p>
        <br>
        <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.responsibility') }}</p>
      </div>
			<span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="statementCancel">{{$t('admin.cancel')}}</a-button>
          <a-button style="margin-left:10px;" :type="type" :disabled="disabledValue" @click="statementOk">{{ $t('announcement.read') }}</a-button>
        </span>
    </a-modal>
  </div>
</template>

<script>
export default {
/* 	props: {
    promptVisible: {
      type: String,
      required: true
    },
  }, */
  data() {
    return {
      promptVisible: JSON.parse(localStorage.getItem('promptVisible')),
			value: null,
			disabledValue: false,
			type: 'primary'
    }
  },
	mounted() {
	},
  methods: {
    statementCancel() {
      window.sessionStorage.clear()
      this.$router.push(`/login`)
    },
    statementOk() {
      this.promptVisible = false
      localStorage.setItem('promptVisible', 'false')
    },
  }
}
</script>
<style lang="scss" scoped>
.affiche {
  height: 600px;
  overflow-y: hidden;
  overflow-y: scroll;
  white-space: pre-wrap;
  background: #FFCFAF1C 0% 0% no-repeat padding-box;
  border: 1px solid #FFC9A7A8;
  border-radius: 10px;
  opacity: 1;
  padding: 10px;
   &::-webkit-scrollbar {
   //滚动条的滑块样式修改
   width: 9px !important;
   min-height: 25px;
 }
 &::-webkit-scrollbar-thumb {
   border-radius: 4px;
 }
  p {
    line-height: 25px;
  }
}

</style>
