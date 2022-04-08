<template>
  <a-tabs :default-active-key="activeName" @change="handleClick" stretch>
    <a-tab-pane key="first" tab="快捷回复">
			<div style="padding: 20px 20px 10px 20px">
				<a-input-search
					placeholder="请输入快捷信息"
					enter-button="提交"
					v-model="quickValue"
					@search="onSearch"
				/>
			</div>
      <div class="fast-reply">
        <div v-for="(item, i) in fastList" :key="i">
          <div class="tag" @dblclick="dbsend(item.text)">
            <p>
							{{ item.text }}
							<a-popconfirm
								title="是否删除此信息?"
								ok-text="Yes"
								cancel-text="No"
								@confirm="delQuick(item)"
								@cancel="cancel"
						  >
							<a-icon type="delete" style="margin-left: 30px;"  />
						</a-popconfirm>
						</p>
          </div>
          <a-divider></a-divider>
        </div>
      </div>
			
    </a-tab-pane>
    <a-tab-pane key="second" tab="客户资料">
      <div class="user-info">
        <div class="user-avatar">
          <div class="block">
            <a-avatar
              :src="this.$store.state.userInfo.avatar"
              :size="70"
              icon="user"
            />
          </div>
          <div>{{ this.$store.state.userInfo.nickname }} <span class="el-icon-edit" @click="remarKamend"></span></div>
          <p v-if="!remarkVisible">{{this.$store.state.userInfo.remarks}}</p>
					<div style="padding: 0px 20px">
				<a-input-search
					placeholder="请输入备注信息"
					enter-button="提交"
					v-if="remarkVisible"
					v-model="remarkValue"
					size="small"
					@search="onSearchRemark"
				/>
			</div>
        </div>
        <div class="item-info-list">
          <ul>
            <li>客户昵称：</li>
            <li v-if="this.$store.state.userInfo.remarks == ''">{{this.$store.state.userInfo.nickname}}</li>
            <li v-if="!this.$store.state.userInfo.remarks == ''">{{this.$store.state.userInfo.remarks}}({{this.$store.state.userInfo.nickname}})</li>
          </ul>
          <!-- <ul>
            <li>客户性别：</li>
            <li>
              <span class="iconfont icon-xingbienan"></span>
            </li>
          </ul> -->
          <ul>
            <li>国家：</li>
            <li>{{this.$store.state.userInfo.region}}</li>
          </ul>
          <ul>
            <li>关注数量：</li>
            <li>{{this.$store.state.userInfo.follow_number}}</li>
          </ul>
          <ul>
            <li>粉丝数量：</li>
            <li>{{this.$store.state.userInfo.friends_number}}</li>
          </ul>
          <ul>
            <li>个性签名：</li>
            <li>{{ this.$store.state.userInfo.signature }}</li>
          </ul>
          <ul>
            <li>唯一ID：</li>
            <li>{{ this.$store.state.userInfo.unique_id }}</li>
          </ul>
        </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="set" tab="用户设置">
      <div class="set">
        <a-form ref="form" :model="form" label-width="80px">
          <a-form-item label="翻译语言">
            <a-select
              @change="selectTranslate"
              :default-value="value"
              placeholder="转换的语言类型"
            >
              <a-select-option
                v-for="(item, index) in translateList"
                :key="index"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="发送是否自动翻译">
            <a-radio-group :default-value="translateNo" button-style="solid" @change="onChangeTranslate">
              <a-radio-button :value="false">
                否
              </a-radio-button>
              <a-radio-button :value="true">
                是
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="APP ID：">
            <a-input-search
              placeholder="请输入有道翻译APP ID"
              enter-button="提交"
              v-model="form.translateID"
              @search="onSearchID"
            />
          </a-form-item>
          <a-form-item label="密钥：">
            <a-input-search
              placeholder="请输入有道翻译密钥"
              enter-button="提交"
              v-model="form.translateSecret"
              @search="onSearchSecret"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { translate } from "../../utils/translate";
import bus from "../../utils/brotherBus";
import * as api from '@/api/index'
export default {
  data() {
    return {
      form: {
        translateID: localStorage.getItem("translateID"),
        translateSecret: localStorage.getItem("translateSecret")
      },
      translateList: [
        {
          value: "en",
          label: "默认(英语)",
        },
        {
          value: "zh-CHS",
          label: "中文",
        },
        {
          value: "ja",
          label: "日语",
        },
        {
          value: "fr",
          label: "法语",
        },
        {
          value: "ru",
          label: "俄罗斯",
        },
        {
          value: "es",
          label: "西班牙",
        },
        {
          value: "it",
          label: "意大利语",
        },
        {
          value: "ko",
          label: "韩语",
        },
        {
          value: "de",
          label: "德语",
        },
      ],
      value: localStorage.getItem("setTranslateType"),
			quickValue: null,
			remarkValue: '',
      userInfo: this.$store.state.userInfo,
			userFK: JSON.parse(window.sessionStorage.getItem('userInfo')),
			remarkVisible: true,
      translateNo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      activeName: "first",
      fastList: [
        {
          text: "你好！欢迎咨询",
        },
        {
          text: "很高兴为您服务！",
        },
        {
          text: "抱歉！这边无法处理您的问题",
        },
        {
          text: "接下来为你转接其他人工客服，请稍等客服，请稍客服，请稍！",
        },
        {
          text: "实在抱歉！请您稍等",
        },
      ],
    };
  },
	filters: {
		// 快捷类型
    getType(value) {
      if (value === '1') return '文字'
      if (value === '2') return '富文本'
      if (value === '3') return '视频'
      if (value === '4') return '图片'
      if (value === '5') return '名片'
    }
  },
	mounted() {
		this.getQuickData()
	},
  methods: {
    // 选择翻译类型
    selectTranslate(e) {
      this.value = e
      this.$store.commit("setTranslateType", e)
      localStorage.setItem("setTranslateType", e)
    },
    // 是否自动翻译
    onChangeTranslate(e) {
      this.translateNo = e.target.value
      localStorage.setItem("translateVal", e.target.value)
    },
    //  双击发送消息
    dbsend(text) {
      this.$store.commit("fastReplyValue", text)
      // bus.$emit("setScroll")
      /* translate("", "", text).then((res) => {
        console.log(res);
        this.$store.commit("messgePushData", { messge: res, vid: 2 });
        bus.$emit("setScroll", 111);
      }) */
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
		// 快捷查询
		getQuickData() {
			let userKfId = this.userFK.data.i
			let form = {}
			form.user_id = userKfId
			form.type = '1'
			form.content = this.quickValue
			api.getImQuickReply(form).then(res => {
				if(res.code === 0) {
					this.fastList = res.data.data.map(item => {
						return { text: item.content, id: item.id}
					})
				} else {
					this.$message.error(err.msg)
				}
			}).catch(err => {
				this.$message.error(err.msg)
			})
		},
		// 添加快捷
		onSearch(value) {
			let userKfId = this.userFK.data.i
			this.quickValue = ''
			this.quickValue = value
			let form = {}
			form.user_id = userKfId
			form.type = '1'
			form.content = this.quickValue
			api.postImQuickReply(form).then(res => {
				if(res.code === 0) {
					this.quickValue = null
					this.$message.success('添加成功')
					this.getQuickData()
				} else {
					this.$message.error(err.msg)
				}
			}).catch(err => {
				this.$message.error(err.msg)
			})
		},
		// 删除快捷
		delQuick(item) {
			let id = item.id
			api.delImQuickReply(id).then(res => {
				this.getQuickData()
			}).catch(err => {
				// console.log(err)
			})
		},
		cancel() {
			this.$message.error('取消删除')
		},
		// 添加备注
		remarKamend() {
			this.remarkVisible = !this.remarkVisible
		},
		onSearchRemark(value) {
			let userKfId = this.userFK.data.i
			this.remarkValue = ''
			this.remarkValue = value
			/* console.log(this.userFK)
			console.log(this.remarkValue)
			console.log(parseInt(localStorage.getItem("userId")))
			console.log(parseInt(localStorage.getItem("accountId"))) */
			let form = {}
			form.account_id = parseInt(localStorage.getItem("accountId"))
			form.account_follower_id = parseInt(localStorage.getItem("userId"))
			form.remarks = this.remarkValue
			api.putImAccountFollower(form).then(res => {
				if(res.code === 0) {
					this.remarkVisible = false
					this.$message.success('添加成功')
				}
			})
			/* account_id: parseInt(localStorage.getItem("accountId")),
      account_follower_id: parseInt(localStorage.getItem("userId")) */
			// this.remarkValue = ''
			
		},
    onSearchID() {
      localStorage.setItem('translateID', this.form.translateID)
      this.$message.success('添加成功')
    },
    onSearchSecret() {
      localStorage.setItem('translateSecret', this.form.translateSecret)
      this.$message.success('添加成功')
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .ant-layout-sider-children {
  background: white;
}
::v-deep .ant-tabs-bar {
  margin: 0 10px;
}
.set {
  padding: 10px;
  box-sizing: border-box;
}
.user-info {
  display: flex;
  /* justify-content: center; */
  flex: 1;
  flex-direction: column;
  .item-info-list {
    padding: 20px;
    flex: 1;
    ul {
      display: flex;
      margin: 20px 0;
      li:nth-child(1) {
        width: 100px;
        font-size: 18px;
        font-weight: 400;
      }
      li:nth-child(2) {
        word-wrap: break-word;
        word-break: normal;
        width: 0px;
        flex: 1;
        span {
          font-size: 18px;
        }
      }
    }
  }
  .user-avatar {
    // height: 100px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: #304156;
    border-radius: 0 0 100px 100px;
    padding: 50px 0;
    > div:nth-child(2) {
      color: white !important;
      font-size: 16px;
      font-weight: 500;
      margin: 5px 0;
    }
    > p {
      color: rgba(255, 255, 255, 0.3) !important;
      font-size: 14px;
			height: 24px;
      font-weight: 300;
    }
  }
}
::v-deep .el-divider {
  margin: 10px 0;
}
.el-tabs {
  display: flex;
  flex: 1;
  flex-direction: column;
}
::v-deep .el-tabs__content {
  flex: 1;
  display: flex;
  padding: 0px;
}
::v-deep .a-tab-pane {
  flex: 1;
  display: flex;
  > div {
    flex: 1;
    background: #e9e9e9;
    .tag {
      padding: 0px 0;
      display: flex;
      p {
        font-weight: 500;
        font-size: 14px;
        line-height: 28px;
      }
    }
  }
}
.fast-reply {
  padding: 20px;
  box-sizing: border-box;
	height: 700px;
	overflow-y:auto;
}
</style>>
