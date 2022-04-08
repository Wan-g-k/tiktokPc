<template>
  <div class="messge-box" style="flex: none" ref="itembox">
     <a-spin :spinning="spinning" style="margin-top:20px;"  tip="Loading..." >
      <div class="spin-content">
      </div>
    </a-spin>
    <!-- <p  class="title"  @click="getMessgeList" > 获取聊天记录</p> -->
    <div
      v-for="(item, index) in listData"
      :key="item.id">
    <div v-if="item.message_type !== 50001" class="item-box">
    <p :style="item.is_send == false? '': 'text-align:right;'" v-if="listData">{{flatTime(item)}}</p>
    <div style="display: flex;"  :style="item.is_send == false? '': 'justify-content:end;flex-flow: row-reverse'
      " v-if="(item.account_follower_id == userId || item.account_id == accountId)">
      <div class="item-box-img">
        <a-avatar
          shape="square"
          v-if="item.is_send == false"
          :size="40"
          :src="$store.state.userInfo.avatar"
        />
        <a-avatar shape="square" v-else :size="40" src="" icon="user" />
      </div>
      <!-- <div class="item-upload" v-if="item.image"> -->
      <!-- <img :src="item.image" ref="dom" /> -->
      <!-- </div> -->
      
      <div class="item-fanyi">
        <div class="item-box-messge" :style="item.is_send == false ? 'margin-left: 20px;background: white;': 'margin-right: 20px;background: #67C23A;'"
          @mousemove.prevent="tranlsateIndex = index"
          @mouseout.prevent="tranlsateIndex == null"
        >
          <div
            v-if="item.is_send == false && tranlsateIndex == index"
            class="item-box-tranlsate"
          >
            <el-button
              @click="keyTranslete(item, index), (item.isTop = true)"
              icon="el-icon-refresh"
              :loading="btnLoading"
              >翻译</el-button
            >
          </div>
          <div>
            <div style="color: #000;" v-if="imgWD(item).text">
              <span style="position: absolute; left: -34px" v-if="imgWD(item).failureText">
                <a-icon
                  type="exclamation"
                  style="
                    color: #fff;
                    font-size: 18px;
                    background-color:#fa5151;
                    border-radius:50%
                  "
                />
              </span>
              <!-- <p style="position: absolute;right: 0px;width: 18px;height: 18px; color: #fff;text-align: center;background:#f70303ce;border-radius: 20px;" v-if="imgWD(item).text">X</p> -->
              <a-spin v-if="imgWD(item).succeed" style="position: absolute; left: -34px" size="small" />
              {{ imgWD(item).text }}
              <span style="position: absolute; top: 40px;width: 150px;border: 1px solid #c0c4cc;background: #dadbdf33;text-align: center;border-radius: 5px;right: 0px" v-if="imgWD(item).failureText">{{'原因:'+imgWD(item).failureText}}</span>
            </div>
            <div v-if="imgWD(item).nickname">
              <span v-for="(item) in imgWD(item).stickers" :key="item.id">
                <img style="width: 50px; height: 50px;" :src="item.animate_url.url_list[0]" alt="">
              </span>
            </div>
            <div v-if="imgWD(item).avatar" style="display: flex;">
              <p>
                <a-avatar
                  :size="50"
                  icon="user"
                  :src="imgWD(item).avatar.url_list[1]"
                />
              </p>
              <p style="margin-left: 20px;">
                <span style="color: #000">{{imgWD(item).name}}</span> <br>
                <span style="color: #777">{{'@'+imgWD(item).desc}}</span>
              </p>
            </div>
            <div v-if="imgWD(item).aweType === 800 || imgWD(item).awemeType === 0">
              <p>{{'视频作者：'}}{{imgWD(item).author_username}}</p> 
              <p>{{'视频名称：'}}{{imgWD(item).content_name}}</p>
              <p>{{'视频地址：'}}</p>
              <div  style="overflow: hidden; text-overflow:ellipsis;white-space: nowrap;width:300px; " v-for="(item, index) in imgWD(item).cover_url.url_list" :key="index">
                <span style="color: #0066FF"><a :href="item" >{{item}}</a></span>
              </div>
            </div>
            <div v-if="imgWD(item).title" style="display: flex;">
              <p>
                <a-avatar
                  :size="50"
                  icon="user"
                  :src="imgWD(item).cover_url"
                />
              </p>
              <p style="margin-left: 20px;overflow: hidden; text-overflow:ellipsis;white-space: nowrap;width:200px;">
                <span style="color: #000" >{{imgWD(item).title}}</span> <br>
                <span style="color: #777"> <a :href="imgWD(item).link_url" >{{'@'+imgWD(item).link_url}}</a></span>
              </p>
              
            </div>
            <div v-if="imgWD(item).display_name === 'wave'">
              <span v-for="(item) in imgWD(item).url.url_list" :key="item.id">
                <img style="width: 50px; height: 50px;" :src="item" alt="">
              </span>
            </div>
          </div>
          <div
            :class="[
              'item-box-qipao',
              item.is_send == false ? 'triangle-left' : 'triangle-right',
            ]"
          ></div>
        </div>
        <div class="fanyi-box" v-if="item.isTop == true">
          <p>翻译：{{ item.translate }}</p>
          <i
            class="el-icon-circle-close"
            @click.stop="deleteMeege(item, index)"
          ></i>
        </div>
      </div>
    </div>
    </div>
    
    </div>
  </div>
</template>



<script>
import bus from "../../utils/brotherBus";
import { translate } from "../../utils/translate";
import * as api from "@/api/index";
import moment from "moment";
import templete from '@/views/templete.vue';
import store from '../../store/index'
import { MD5 } from '../../utils/md5'
import 'element-ui/lib/theme-chalk/index.css';
// import { forEach } from 'mock/user';

export default {
  components: { templete },
  name: "messgeBox",
  data() {
    return {
      tranlsateIndex: null,
      spinning:false,
      btnLoading: false,
      deleteIndex: null,
      listData: [],
      list:[],
      accountId: parseInt(localStorage.getItem("accountId")),
      userId: parseInt(localStorage.getItem("userId")),
      translateID: localStorage.getItem("translateID"),
      translateSecret: localStorage.getItem("translateSecret"),
      isshows:true,
      parame: {
        page: 1,
        page_size: 20,
        order_created_at: true,
      },
      DataListText: {
        account_follower_id: 720207,
        account_id: 56473,
        content: "{\"command_type\":8,\"conversation_id\":\"0:1:6696402233251251206:7027796341846475781\",\"conversation_type\":1,\"inbox_type\":0}",
        conversation_id: "0:1:6696402233251251206:7027796341846475781",
        conversation_short_id: "7030001006020657413",
        conversation_type: 1,
        create_time: "1636799659125",
        created_at: "2021-11-13T18:38:00.930111+08:00",
        id: 3293514,
        index_in_conversation: "0",
        is_send: false,
        message_type: 50001,
        order_in_conversation: "0",
        sec_sender: "MS4wLjABAAAAdxoCNTCQlbbiDxUKphNnjHBNPCa8r7JeKV-rSmHjman46gxKs2xRTyyhVGOZw-im",
        send_status: "",
        sender: "7027796341846475781",
        server_message_id: "7030001003877435398",
        status: 0,
        updated_at: "2021-11-13T18:38:00.930111+08:00",
        version: "0"
      }
    };
  },
  computed: {
    msgObj_ss: function() {
      return this.listData
    },
    flowt() {
      return localStorage.getItem("accountId")
      // this.$nextTick(()=>{
        // return this.$store.state[`tiktok_${this.accountId}_${this.userId}`] ? this.$store.state[`tiktok_${this.accountId}_${this.userId}`]['arr'] : []
      // })
      
    },
    flatTime(o){
      return function (o) {
        return moment(o.created_at).format("HH:mm")
      }
    },
    imgWD(o) {
      return function (o) {
        let a = JSON.parse(o.content)
        // console.log(a)
        return a
      };
    },
  },
  watch: {
    msgObj_ss:function (oldVal, newVal){
      this.$nextTick(()=>{
        this.scroolSetBottom()
      })
    },
    /* isSend: function(oldVal, newVal) {
      
      // 改前14
      // console.log(oldVal)
      // 改后
      // console.log(newVal)
      this.getMessgeList()
    } */
  },
  methods: {
    // 删除翻译
    deleteMeege(item, index) {
      // console.log(item)
      this.$nextTick(() => {
        delete item.translate;
        delete item.isTop;
        this.$forceUpdate(); //强制刷新试图
      });
    },

    // 一键翻译
    keyTranslete(item, index) {
      this.btnLoading = false;
      this.deleteIndex = index;
      let text = JSON.parse(item.content).text
      // console.log(appid,key)

      var appKey = this.translateID
      var secret_key = this.translateSecret
      var salt = (new Date).getTime()
      var query = text
      // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
      var from = 'auto'
      var to = store.state.translateForm || 'zh-CHS'
      this.$jsonp(`https://openapi.youdao.com/api?q=${query}&appKey=${appKey}&salt=${salt}&from=${from}&to=${to}&sign=${this.$md5(appKey+query+salt+secret_key)}`)
      .then((res) => {
        if(!appKey) {
          item.translate = '请输入有道翻译APPID'
        }
        if(!secret_key) {
          item.translate = '请输入有道翻译密钥'
        }
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
          this.$nextTick(() => {
            item.translate = res.translation[0]
            this.$forceUpdate()
          })
        }
      })
      /* translate("auto", "zh", text).then((res) => {
        this.$nextTick(() => {
          item.translate = res;
          this.$forceUpdate()
          // console.log(res)
        });
      }) */;
    },

    checkStoreMsgData(){
      var that = this
      if (!that.$store.state.msgObj){
        return false
      }
      if (!that.$store.state.msgObj["tiktok"]){
        return false
      }
      if (!that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")]){
        return false
      }
      if (!that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]){
        return false
      }
      return true
    },
    // 点击获取聊天
    getMessgeList() {
      var that = this
      if (that.checkStoreMsgData()){

        // 存在
        that.listData = that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"]
        that.$nextTick(()=>{
          that.scroolSetBottom()
        })
        that.$store.commit("cleanNoReadNum", that.$store.state.fansList)
        return 
      }
      that.spinning = true
      that.listData = []
      let parame = {
        ...this.parame,
        account_id: localStorage.getItem("accountId"),
        account_follower_id: localStorage.getItem("userId"),
      }
      // 数据类型
      // message_type: 7 文字
      // message_type：15 动态招呼图片
      // message_type：25 名片
      // 
      api.getFansMessge(parame).then((res) => {
        let messgeData = []
        if(res.data.count !== 0) {
          res.data.data.forEach(item => {
            if(item.message_type === 7 || item.message_type === 15 || item.message_type === 25 || item.message_type === 50001) {
              return messgeData.push(item)
            }
          })
          that.$nextTick(()=>{
            that.scroolSetBottom()
          })
          
          that.spinning = false
          let messageDataList = messgeData.reverse()
          messageDataList.forEach((item, i) => {
            that.$store.commit("setDataKey_history", item)
          })
          let accountLoS =  that.$store.state.accountList
          let fansLoS =  that.$store.state.fansList
          accountLoS.forEach(item => {
            if(item.userInfo.id == localStorage.getItem("accountId")) {
              item.noReadNum = 0
            }
          })
          fansLoS.forEach(item => {
            if(item.userInfo.id == localStorage.getItem("userId")) {
              item.noReadNum = 0
            }
          })
          that.listData = that.$store.state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["msgList"]
        } else if(res.data.count === 0) {
          that.spinning = false
          that.DataListText.account_follower_id = localStorage.getItem("userId")
          that.DataListText.account_id = localStorage.getItem("accountId")
          that.$store.commit("setDataKey_history", that.DataListText)
        }
      })
    },
    // 页面触底
    scroolSetBottom(index) {
      var _that = this;
      this.$nextTick(() => {
        _that.$refs.itembox.scrollTop = _that.$refs.itembox.scrollHeight;
      });
    },
  },

  created() {},
  updated() {

  },
  mounted() {
    bus.$off("setScroll")
    this.getMessgeList()
    /* bus.$on("setDataKey", (e) => {
      this.listData = [...this.listData , e]
      this.scroolSetBottom();
    }); */
    // 监听兄弟组件的消息
    bus.$on("setScroll", (res) => {
      var that = this
      that.getMessgeList()
    })
  },
};
</script>


<style lang="scss" scoped>
// .spin-content {
//   border: 1px solid #91d5ff;
//   background-color: #e6f7ff;
//   padding: 30px;
// }
.title{
    position: absolute;
    top: 8px;
    left: 45%;
    display: flex;
    justify-content: center;
}
.messge-box::-webkit-scrollbar {
  display: none;
}
.triangle-right {
  border-left: 10px solid #98e165;
  right: -10px;
}
.triangle-left {
  left: -10px;
  border-right: 10px solid white;
}
.messge-box {
  overflow-y: scroll;
  box-sizing: border-box;
  background: #f5f5f5;
  border: 1px solid #c0c4cc;
  background-repeat: no-repeat;
  width: 100%;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
  background-size: 100% 100%;
  height: 588px !important;
  .item-box {
    flex-direction: column;
    // align-items: baseline;
    display: flex;
    margin-bottom: 10px;
    >p{
      margin: 5px 0;
    }
    .item-fanyi {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .fanyi-box {
        max-width: 357px;
        background: #98e165;
        margin: 15px 0px;
        padding: 15px 10px;
        border-radius: 5px;
        margin-left: 20px;
        font-size: 14px;
        border-bottom: 1px solid #c0c4cc;
        position: relative;
        i {
          /* color: white; */
          font-size: 16px;
          position: absolute;
          top: -2px;
          right: -2px;
        }
      }
    }
    .item-box-messge {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      min-height: 30px;
      padding: 5px 10px;
      line-height: 19px;
      border-radius: 5px;
      max-width: 357px;
      word-break:break-all;
      position: relative;
      .item-box-tranlsate {
        position: absolute;

        right: -67px;
        top: 1px;
        ::v-deep .el-button {
          padding: 5px 5px;
        }
      }
      .item-box-qipao {
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        position: absolute;
        top: 8px;
        
      }
    }
    .item-upload {
      /* transform:scale(0.5,0.5); */
      width: 100px;
      height: 100px;
      margin: 0 20px;
      border-radius: 8px;
      background: white;
      img {
        width: 100%;
        height: 100%;
        border-radius: 8px;
      }
    }
    .item-box-img {
      img {
        width: 40px;
        height: 40px;
        border-radius: 5px;
      }
    }
  }
}
</style>