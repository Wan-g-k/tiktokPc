<template>
  <div class="chat-room">
    <a-layout>
      <UserList />
      <a-layout
        v-if="Object.keys(this.$store.state.userInfo).length > 1"
        class="contarners"
      >
        <Hearder />
        <Main />
      </a-layout>
      <ThreeIndex v-if="Object.keys(this.$store.state.userInfo).length <= 1" />
      <UserInfo v-if="Object.keys(this.$store.state.userInfo).length > 1" />
    </a-layout>
  </div>
</template>


<script>
import Hearder from "@/components/hearder.vue";
import Main from "@/components/main.vue";
import UserList from "@/components/userList.vue";
import UserInfo from "@/components/userInfo.vue";
import ThreeIndex from "@/components/404";

export default {
  name: "CharRoom",
  components: {
    Hearder,
    Main,
    UserList,
    UserInfo,
    ThreeIndex,
  },
  data() {
    return {
      websocket: null,
      listArr: [],
      obj:{},
      lockReconnect: false,
      timer: null
    };
  },
  computed: {
    setDataKey: function() {
      return this.$store.state.setDataKey;
    },
  },
  methods: {
    // 初始化webscoket
    initWebSocket() {
      const that = this
      that.timer = null
      
      if ("WebSocket" in window) {
        const token = sessionStorage.getItem("token")
        // let url = 'ws://192.168.80.242:8088/api/v1/ws/';
        // let url = 'ws://192.168.80.36:8088/api/v1/ws/';
        //  let url = 'ws://192.168.82.5:8088/api/v1/ws/';
        
          let url = 'wss://ikuajing.club/api/v1/ws/';
          // let url = 'wss://tiktok.y691.cc/api/v1/ws/';
          // let url = 'ws://slf.y691.cc/api/v1/ws/'
        
        /* if(document.location.protocol === 'https:') {
          // let url = 'ws://192.168.80.242:8088/api/v1/ws/';
          let url = 'wss://tiktok.y691.cc/api/v1/ws/';
          // let url = 'wss://slf.y691.cc/api/v1/ws/';
        } else if(document.location.protocol === 'http:') {
          // let url = 'ws://192.168.80.242:8088/api/v1/ws/';
          // let url = 'ws://tiktok.y691.cc/api/v1/ws/';
          // let url = 'ws://slf.y691.cc/api/v1/ws/';
        } */
/*         
        console.log(document)
        console.log(document.location)
        console.log(document.location.protocol) */

        this.websocket = new WebSocket(url)
        let sendDataKey = []
        // 有消息的回调
        this.websocket.onmessage = function (e) {
          // 判断data类型
          if (typeof e.data == "string" && e.data !== "PONG") {
            
            let data = JSON.parse(e.data)
            // var arr = []
            // arr.push(data.data)

            // arr.forEach((item, i) => {
              // if (
              //   that.obj[`tiktok_${item.account_id}_${item.account_follower_id}`]
              // ) {
              //   that.obj[`tiktok_${item.account_id}_${item.account_follower_id}`][
              //     "arr"
              //   ].push(item);
              // } else {
              //   that.obj[`tiktok_${item.account_id}_${item.account_follower_id}`] = {
              //     ["arr"]: [item],
              //   };
              // }
              if(data.data.message_type === 7) {
                // that.$store.commit("setDataKey", data.data)
                that.$store.commit("setDataKey_history", data.data)
              } else if(data.data.message_type === 15) {
                that.$store.commit("setDataKey_history", data.data)
              } else if(data.data.message_type === 25) {
                that.$store.commit("setDataKey_history", data.data)
              }
              /* if(data.data.message_type === 0) {
                that.$store.commit("setDataKey_history", data.data)
              } */
              
              /* if(data.data.message_type !== 50001) {
                that.$store.commit("setDataKey_history", data.data)
              } */
              
              // bus.$emit('setDataKey',data.data)
            // });
            // console.log(data.data);
            // console.log(data.data)
            // that.$store.commit("messgePushData", data.data);
            // that.$store.commit("setStateObj", that.obj);
          }
        };

        // 链接成功地回调 带token验证
        this.websocket.onopen = function (e) {
          //  this.$message.loading('Action in progress..', 2.5)
          console.log("链接成功")
          //是否真正建立连接
          that.lockReconnect = true 
          this.send(token)
          that.timer = setInterval((e) => {
            this.send('PING')
          },10000)
        };

        // 连接错误回调
        this.websocket.onerror = function (e) {
          console.log("链接错误")
          that.reconnect()
        },
          // 断开连接回调
        this.websocket.onclose = (e) => {
          console.log("断开链接")
          if(!sessionStorage.getItem("token")) {
            this.websocket.close()
          } else {
            that.reconnect()
          }
        }
      } else {
        alert("当前浏览器不支持websocket");
      }
      if(!sessionStorage.getItem("token")) {
        this.websocket.close()
      }
      /* if(window.name == ""){
        console.log("首次被加载") 
        window.name = "isReload"
      }else if(window.name == "isReload"){
        console.log("页面被刷新")
      } */
    },
    //重连
    reconnect() {
      let thta = this
      setTimeout(() =>{
        //新连接
        thta.initWebSocket()
      },5000)
    },
  },
  
  //页面销毁时关闭长连接
  destroyed() {
    if(!window.sessionStorage.getItem('token')) {
      this.websocket.close()
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
    // 初始化化websocket
    this.initWebSocket()
    // this.$store.commit('messgePushData',null)
    // 页面销毁清空用户信息
    this.$store.commit("deleteUserInfo");
  },
};
</script>

<style lang='scss' scoped>
.ant-layout-sider {
  background: white;
}
::v-deep .a-layout {
  width: 100%;
  height: 100%;
}
.a-layout {
  flex-direction: column;
}
.avatar {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-right: 50px;
  height: 100%;
  p {
    font-size: 16px;
    margin: 0 20px;
    font-weight: 700;
    color: white;
  }
}
.chat-room {
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
}

body > .a-layout {
  margin-bottom: 40px;
}

// .heardes-user {
//   background: #0acffe;
// }
// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }
</style>