<template>
  <div class="send-messge">
    <!-- <p class="send-messge-failText" v-if="display" @click="failTextDisplay">{{"失败原因："+failText+'。发送内容：'+displayvalue+'。'}}</p> -->
    <div class="function-class">
      <i class="iconfont icon-400biaoqing_biaoqing"></i>
      <i class="iconfont icon-charutupian">
        <input
          type="file"
          class="upload-img"
          @change="changepic($event)"
          accept="image/*"
        />
      </i>
      <i class="iconfont icon-wenjianjia"></i>
    </div>
    
    <div class="item-input">
      <textarea
        @keydown="keyup($event)"
        class="myTextarea"
        v-model="value"
        id="myTextarea"
        cols="30"
        rows="10"
         contenteditable="true"
      ></textarea>
      <div class="send-btn">
        <a-button
          type="info"
          :disabled="!value"
          @click.prevent="sendMessgeSending"
          plain
          >发送(Enter)</a-button
        >
        <!-- <a-button type="danger" :disabled="!value" @click="value = ''" plain
          >清空</a-button
        > -->
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { translate } from "../../utils/translate";
import bus from "../../utils/brotherBus";
import * as api from "../../api/index";
import store from '../../store/index'
import { MD5 } from '../../utils/md5'
import 'element-ui/lib/theme-chalk/index.css';
export default {
  data() {
    return {
      value: undefined,
      listArr:[],
      failText: null,
      display: false,
      displayvalue: null,
      translateID: localStorage.getItem("translateID"),
      translateSecret: localStorage.getItem("translateSecret"),
      DataList: {
        account_follower_id: '',
        account_id: '',
        content: "{\"aweType\":0,\"text\":\"hello\"}",
        conversation_id: "",
        conversation_short_id: "",
        conversation_type: 1,
        create_time: "",
        created_at: new Date().toISOString(),
        id: 0,
        index_in_conversation: "",
        is_send: true,
        message_type: 7,
        order_in_conversation: "",
        sec_sender: "",
        send_status: "",
        sender: "",
        server_message_id: "",
        status: 0,
        updated_at: "",
        version: "0"
      }
    };
  },
  computed: {
    fastReply: function() {
      return this.$store.state.quickValue;
    },
    
  },
  watch:{
    fastReply: {
      handler: function (oldVal) {
        this.value = oldVal
      }, 
      deep: true
    },
    /* fastReply: function(oldVal, newVal) {
      console.log(oldVal)
      console.log(newVal)
      this.value = oldVal
    } */
  },
  mounted() {
    bus.$on("setScroll", (res) => {
      this.display = false
    })
  },
  methods: {
    // 翻译
    changepic(e) {
      let that = this;

      let fileList = e.target.files[0];

      let reader = new FileReader();

      reader.readAsDataURL(fileList);

      reader.onload = function (e) {
        let dataURL = reader.result;

        that.$store.commit("messgePushData", {
          image: dataURL,
          type: "img",
          vid: 2,
          sendTime: new Date(),
        });
      };
    },

    // 键盘回车发送消息
    keyup(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        let translateVal = localStorage.getItem("translateVal")
        if(translateVal == 'true') {
          this.display = false
          this.sendMessge() // 发送文本
        } else {
          this.display = false
          this.sendMessgeNo() // 发送文本
        }
        return false
      }
    },
    // 发送消息
    sendMessgeSending() {
      let translateVal = localStorage.getItem("translateVal")
      if(translateVal == 'true') {
        this.sendMessge()
      } else {
        this.sendMessgeNo()
      }
    },
    // 发送消息推送(不翻译)
    sendMessgeNo() {
      var that = this
      let text = that.value
      that.displayvalue = that.value
      let messageDataList = {}
      that.DataList.account_follower_id = parseInt(localStorage.getItem("userId"))
      that.DataList.account_id = parseInt(localStorage.getItem("accountId"))
      that.DataList.content = `{\"aweType\":0,\"succeed\":true,\"text\":\"${that.displayvalue}\"}`
      messageDataList = that.DataList
      let arr = that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"][that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].length-1]
      if(arr.id === 0) {
        that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
      }
      that.$store.commit("setDataKey_history", messageDataList)
      that.display = false
      that.$nextTick(() => {
        let parmes = {
          type: "text",
          account_id: parseInt(localStorage.getItem("accountId")),
          account_follower_id: parseInt(localStorage.getItem("userId")),
          content: text,
        }
        that.$forceUpdate()
        api.sendMessge(parmes).then((res) => {
          this.$store.commit("fastReplyValue", '')
            if(res.data.server_message_id != ''){
              that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
              that.display = false
              res.data.content = `{\"aweType\":0,\"text\":\"${that.displayvalue}\"}`
              that.$store.commit("setDataKey_history", res.data)
              this.$store.commit("fastReplyValue", '')
            }else {
              that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
              that.DataList.content = `{\"aweType\":0,\"succeed\":false,\"failureText\":\"${res.data.send_status}\",\"text\":\"${that.displayvalue}\"}`
              let failureData = {}
              failureData = that.DataList
              that.$store.commit("setDataKey_history", failureData)
              localStorage.setItem("failText", res.data.send_status)
              that.failText = localStorage.getItem("failText")
              that.display = true
            }  
        })
      })
      this.value = undefined
    },

    // 发送消息推送
    sendMessge(event) {
      var that = this
      that.display = false
      that.displayvalue = that.value

      /* let messageDataList = {}
      that.DataList.account_follower_id = parseInt(localStorage.getItem("userId"))
      that.DataList.account_id = parseInt(localStorage.getItem("accountId"))
      that.DataList.content = `{\"aweType\":0,\"succeed\":true,\"text\":\"${that.displayvalue}\"}`
      messageDataList = that.DataList
      let arr = that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"][that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].length-1]
      if(arr.id === 0) {
        that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
      }

      that.$store.commit("setDataKey_history", messageDataList) */
      
      var appKey = this.translateID
      var secret_key = this.translateSecret
      var salt = (new Date).getTime()
      var query = that.value
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var from = 'auto'
      var to = store.state.translateForm || 'zh-CHS'
      // console.log(store.state.translateForm)
      if(!appKey) {
        that.$message.error('请输入有道翻译APPID')
      }
      if(!secret_key) {
        that.$message.error('请输入有道翻译密钥')
      }
      this.$jsonp(`https://openapi.youdao.com/api?q=${query}&appKey=${appKey}&salt=${salt}&from=${from}&to=${to}&sign=${this.$md5(appKey+query+salt+secret_key)}`)

      // 百度翻译
      // this.$jsonp(`https://api.fanyi.baidu.com/api/trans/vip/translate?q=${text}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`)
      .then((res) => {
        // console.log(res)
        if(res.errorCode === '108') {
          this.$message.error('请输入APPID及秘钥或更换APPID及秘钥')
        } else if(res.errorCode === '110') {
          this.$message.error('开发者账号无效,请更换APPID及秘钥')
        }else if(res.errorCode === '114') {
          this.$message.error('此类型不支持')
        }else if(res.errorCode === '302') {
          this.$message.error('翻译查询失败,请重试')
        }else if(res.errorCode === '401') {
          this.$message.error('账户已经欠费，请进行账户充值')
        }else if(res.errorCode === '411') {
          this.$message.error('访问频率受限,请稍后访问')
        }else if(res.errorCode === '412') {
          this.$message.error('长请求过于频繁，请稍后访问')
        }else if(res.errorCode === '1412') {
          this.$message.error('超过最大识别字节数')
        }
        if(res.translation !=null){
            that.$nextTick(() => {
            let parmes = {
              type: "text",
              account_id: parseInt(localStorage.getItem("accountId")),
              account_follower_id: parseInt(localStorage.getItem("userId")),
              content: res.translation[0],
            }
            that.$forceUpdate()
            if(res.translation[0] !== '') {
              let textVal = res.translation[0]
              // 消息发送反馈前
              let messageDataList = {}
              that.DataList.account_follower_id = parseInt(localStorage.getItem("userId"))
              that.DataList.account_id = parseInt(localStorage.getItem("accountId"))
              that.DataList.content = `{\"aweType\":0,\"succeed\":true,\"text\":\"${textVal}\"}`
              messageDataList = that.DataList
              let arr = that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"][that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].length-1]
              // console.log(arr)
              // console.log(that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"])
              if(arr.id === 0) {
                that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
              }
              that.$store.commit("setDataKey_history", messageDataList)
              api.sendMessge(parmes).then((res) => {
                this.$store.commit("fastReplyValue", '')
                  if(res.data.server_message_id != ''){
                    that.display = false
                    that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
                    res.data.content = `{\"aweType\":0,\"text\":\"${textVal}\"}`
                    that.$store.commit("setDataKey_history", res.data)
                    // that.$store.commit("isSend", res.data.is_send)
                    this.$store.commit("fastReplyValue", '')
                  }else {
                    that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
                    // res.data.content = "{\"aweType\":0,\"text\":\"hello\",\"failText\":\"false\"}"
                    // that.$store.commit("setDataKey_history", res.data)
                    localStorage.setItem("failText", res.data.send_status)
                    that.failText = localStorage.getItem("failText")
                    that.display = true
                    
                  }  
              })
            }
          })
        }
        // 百度翻译
        /* if(res.trans_result[0].dst != '') {
          that.$nextTick(() => {
          let parmes = {
            type: "text",
            account_id: parseInt(localStorage.getItem("accountId")),
            account_follower_id: parseInt(localStorage.getItem("userId")),
            content: res.trans_result[0].dst,
          }
          that.$forceUpdate()
          if(res.trans_result[0].dst !== '') {
            let textVal = res.trans_result[0].dst
            api.sendMessge(parmes).then((res) => {
              this.$store.commit("fastReplyValue", '')
                if(res.data.server_message_id != ''){
                  that.display = false
                  that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
                  res.data.content = `{\"aweType\":0,\"text\":\"${textVal}\"}`
                  that.$store.commit("setDataKey_history", res.data)
                  // that.$store.commit("isSend", res.data.is_send)
                  this.$store.commit("fastReplyValue", '')
                }else {
                  that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"].pop()
                  // res.data.content = "{\"aweType\":0,\"text\":\"hello\",\"failText\":\"false\"}"
                  // that.$store.commit("setDataKey_history", res.data)
                  localStorage.setItem("failText", res.data.send_status)
                  that.failText = localStorage.getItem("failText")
                  that.display = true
                  
                }  
            })
          }
        })
        } */
      })
      this.value = undefined
    },
    failTextDisplay() {
      this.display = false
    }
  },
};
</script>

<style lang="scss" scoped>
textarea {
  outline: none;
  resize: none;
  width: 100%;
}

#myTextarea::-webkit-scrollbar {
  display: none;
}
.upload-img {
  width: 100%;
  opacity: 0;
  position: absolute;
  left: 0px;
  z-index: 999;
}
#myTextarea {
  margin: 0px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  resize: none;
  cursor: pointer;
  height: 195px;
}
.send-messge {
  box-sizing: border-box;
  border: 1px solid #c0c4cc;
  position: relative;
  display: flex;
  flex-direction: column;
  .item-input {
    flex: 1;
    display: flex;
    .send-btn {
      position: absolute;
      bottom: 4px;
      right: 4px;
      button {
        margin: 4px;
      }
    }
  }
  .function-class {
    /* width: 100%; */
    height: 40px;
    background: #304156;
    display: flex;
    align-items: center;
    padding-left: 20px;
    i {
      color: white;
      font-size: 24px;
      margin-right: 20px;
    }
    i:nth-child(2) {
      position: relative;
    }
  }
  .send-messge-failText{
    border: 1px solid #c0c4cc;
    color: #000;
    width: 100%;
    text-align: center;
    background: #dadbdf33;
    position: absolute;
    top: -40px;
    padding: 3px 10px;
    cursor: pointer;
  }
}
</style>