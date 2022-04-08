<template>
  <div>
    <div class="affiche">
      <h2 style="text-align: center;">{{ this.$t('announcement.title') }}</h2>
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
      <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.measure') }}/p>
      <br>
      <p>{{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}{{ this.$t('announcement.responsibility') }}</p>
    </div>
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
.affiche{
  white-space: pre-wrap;
  background: #FFCFAF1C 0% 0% no-repeat padding-box;
  border: 1px solid #FFC9A7A8;
  border-radius: 10px;
  opacity: 1;
  padding: 20px;
  font-size: 16px;
  p {
    line-height: 30px;
  }
}
</style>
