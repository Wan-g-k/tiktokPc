import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
// import info from './modules/userinfo'
const wsUrl = process.env.VUE_APP_WS_URL

Vue.use(Vuex)


const store = new Vuex.Store({
  state:{
    websocket:null,
    typeList: [{
      typeImg: require("../assets/image/TK.png"),
      name: "TK",
      typeId: 1,
    },
    ],
    //翻译类型
    translateForm: 'en',
    // tiktok
    setDataKey: [],
    isSend: null,
    // msgObj
    msgObj: null,
    // 账号列表
    accountList: [],
    // 当前命中粉丝列表
    fansList: [],
    // 双击快捷信息
    quickValue: '',

    // 
    dataList:[],
    messgeDataList:{},
    messgeList: [],
    userInfo: {},
    myinfo: {
      //   myAvater:'https://img2.baidu.com/it/u=1296186069,911111491&fm=26&fmt=auto',
      //   name:"Reus"
    },

  },
  mutations:{
    newDataList:function(state, newValue){
      // console.log(state)
    },

    messgePushData:(state, newValue)=>{
      // console.log(newValue)
      if (
        state[`tiktok_${newValue.account_id}_${newValue.account_follower_id}`]
      ) {
        state[`tiktok_${newValue.account_id}_${newValue.account_follower_id}`][
          "arr"
        ].push(newValue);
      } else {
        state[`tiktok_${newValue.account_id}_${newValue.account_follower_id}`] = {
          "arr": [newValue],
        };
      }
    },


    // 缓存模式保存数据
    setDataKey_history: function(state, newValue){
      // console.log(newValue)
      // 如果为空 创建
      if (state.msgObj == null){
        state.msgObj = new Object;
      }
      var arr = []
      var that = this
      arr.push(newValue)

      arr.forEach((item, i) => {
        // 判断消息类型
        // console.log("item: ", item)
        if(!state.msgObj["tiktok"]){
          state.msgObj["tiktok"] = new Object
        }

        if (!state.msgObj["tiktok"][item.account_id]){
          state.msgObj["tiktok"][item.account_id] = new Object
        }

        if (!state.msgObj["tiktok"][item.account_id][item.account_follower_id]){

          state.msgObj["tiktok"][item.account_id][item.account_follower_id] = {
            ["msgList"]: [item],
            ["noReadNum"]: 1,
          }
        }else{
          state.msgObj["tiktok"][item.account_id][item.account_follower_id]["msgList"].push(item)
          state.msgObj["tiktok"][item.account_id][item.account_follower_id]["noReadNum"] += 1
        }
        // 判断是否是当前打开的页面
        if (localStorage.getItem("accountId") == item.account_id && localStorage.getItem("userId") == item.account_follower_id){
          // 是当前页面 未读消息为0
          state.msgObj["tiktok"][item.account_id][item.account_follower_id]["noReadNum"] = 0
        }else{
          // 同步未读消息数量到localstroe

          // 更新用户未读消息
          that.commit("updateAccountListNoreadNum",item) 
          that.commit("updateFansListNoreadNum",item)
        }
      })
    },
    // 更新accountList未读消息数量
    updateAccountListNoreadNum: function(state, newValue){
      // console.log(newValue)
      state.accountList.forEach(item => {
        if (newValue.account_id == item.userInfo.id){
          item.noReadNum += 1
        }
      })
      localStorage.setItem('accountList', JSON.stringify(state.accountList))
    },
    // 更新fansList未读消息数量
    updateFansListNoreadNum: function(state, newValue){
      state.fansList.forEach(item => {
        
        if (newValue.account_follower_id == item.userInfo.id){
          item.noReadNum += 1
        }   
      })
      this.commit("fansIdListMsgAtTop", newValue)
      localStorage.setItem('fansList', JSON.stringify(state.fansList))
    },
    accountLoS: function(state, newValue) {
      // console.log(newValue)
      // state.accountList = newValue
    },

    // 用户数据list
    accountListData: function(state, newValue){
      // console.log(state)
      var objList = []
      let accountLoS = JSON.parse(localStorage.getItem('accountList'))
      newValue.forEach((item, i) => {
        var noReadNum = 0
        // 获取该账号未读消息
        if (state.msgObj){
          if (state.msgObj["tiktok"][item.id]){
            for (let key of Object.keys(state.msgObj["tiktok"][item.id])) {
              noReadNum += state.msgObj["tiktok"][item.id][key]["noReadNum"]
            }
          }
        }

        var objInfo = {
          "userInfo": item,
          "noReadNum": noReadNum
        }

        objList.push(objInfo)
      })
      state.accountList = objList
      if(accountLoS) {
        accountLoS.forEach(item => {
          state.accountList.forEach(items => {
            if(item.userInfo.unique_id === items.userInfo.unique_id) {
              items.noReadNum = item.noReadNum
            }
          })
        })
      }
      localStorage.setItem('accountList', JSON.stringify(state.accountList))
    },
    // 粉丝数据list
    fansListData: function(state, newValue){
      var objList = []
      let fansLoS = JSON.parse(localStorage.getItem('fansList'))
      // console.log("fansListData 1", newValue)
      newValue.forEach(item => {
        var noReadNum = 0
        /* console.log("item: ", item)
        console.log("state.msgObj", state.msgObj) */
        // 获取该账号未读消息
        if (state.msgObj){
          if (state.msgObj["tiktok"][item.account_id]){
            if (state.msgObj["tiktok"][item.account_id][item.id]){

              noReadNum = state.msgObj["tiktok"][item.account_id][item.id]["noReadNum"]
            }
          }
        }

        var objInfo = {
          "userInfo": item,
          "noReadNum": noReadNum
        }
        objList.push(objInfo)
      })
      state.fansList = objList
      if(fansLoS) {
        fansLoS.forEach(item => {
          state.fansList.forEach(items => {
            if(item.userInfo.unique_id === items.userInfo.unique_id) {
              items.noReadNum = item.noReadNum
            }
          })
        })
      }
      this.commit("fansIdlistSort")
      localStorage.setItem('fansList', JSON.stringify(state.fansList))
    },

    // 粉丝id list 排序
    fansIdlistSort: function(state){
      state.fansList.sort(function(a, b){
        return b.noReadNum - a.noReadNum
      })
      localStorage.setItem('fansList', JSON.stringify(state.fansList))
    },

    // 粉丝id list 消息置顶
    fansIdListMsgAtTop: function(state, newValue){
      var fansListTemp = state.fansList

      fansListTemp.map((item, index) => {
       /*  console.log("item: ", item)
        console.log("newValue: ", newValue) */
        if(item.userInfo.account_id == newValue.account_id && item.userInfo.id == newValue.account_follower_id) {
          var fansObj = state.fansList.splice(index, 1)[0]
          // console.log("fansobj: ", fansObj)
          state.fansList.unshift(fansObj)
          localStorage.setItem('fansList', JSON.stringify(state.fansList))
        }
      })
    },
    // 未读消息清零
    cleanNoReadNum:function(state, newValue){
      // console.log("cleanNoReadNum: ", localStorage.getItem("accountId"), localStorage.getItem("userId"), state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")])

      // vuex 未读消息清零
      state.msgObj["tiktok"][localStorage.getItem("accountId")][localStorage.getItem("userId")]["noReadNum"] = 0
      
      // localstore 未读消息清零
      /* console.log(state)
      console.log(newValue) */
      // accountId list 未读消息更新
      state.fansList.forEach(item => {
        if(item.userInfo.id == localStorage.getItem("userId")){
          // 更新未读消息数量
          item.noReadNum = 0
        }
      })
      localStorage.setItem('fansList', JSON.stringify(state.fansList))
      // 账号
      state.accountList.forEach(item => {
        if (item.userInfo.id == localStorage.getItem("accountId")){
          // 更新未读消息数量
          var noReadNum = 0
          var mapObj = state.msgObj["tiktok"][localStorage.getItem("accountId")]
          for (let key of Object.keys(mapObj)) {
            noReadNum += state.msgObj["tiktok"][localStorage.getItem("accountId")][key]["noReadNum"]
          }
          item.noReadNum = noReadNum
        }
      })
      localStorage.setItem('accountList', JSON.stringify(state.accountList))
    },
    // 快捷信息回复
    fastReplyValue: function(state, newValue, oldVal) {
      // console.log(newValue)
      state.quickValue = newValue
    },

    setDataKey:(state, oldvalue, newValue) => {
      state.setDataKey.push(oldvalue)
    },
    isSend:(state, newValue) => {
      state.isSend = newValue
    },
    
    setStateObj:(state, newValue)=>{
      // console.log('数据转换')
      // state.messgeDataList = newValue
      if (
        state[`tiktok_${newValue.account_id}_${newValue.account_follower_id}`]
      ) {
        state[`tiktok_${newValue.account_id}_${newValue.account_follower_id}`][
          "arr"
        ].push(newValue);
      } else {
        state[`tiktok_${newValue.account_id}_${newValue.account_follower_id}`] = {
          "arr": [newValue],
        };
      }
    },
    //获取用户信息
    getUserInfo:(state, newValue)=>{
      // console.log(state, newValue)
      state.userInfo = newValue
    },
    

    // formatting(state){
    //   let fansId = localStorage.getItem('accountId')
    //   let userId =  localStorage.getItem('userId')
    //   var listData = []
    //   state.messgeList ?  state.messgeList.forEach((item)=>{
    //       if(item.account_follower_id == userId && item.account_id == fansId){
    //         console.log(item)
    //         listData.push(item)
    //       }
    //   }) : listData = []
    //   return listData
    // },
    newData(state, newValue){
      state.messgeList = newValue
    },
    // 获取账号
    getMyInfo:(state, newValue)=>{
      // console.log(newValue)
      state.myinfo = newValue
    },
  
    // 转换翻译
    setTranslateType:(state, newValue)=>{
      // console.log(newValue)
      state.translateForm = newValue
    },

    // 清空用户信息
    deleteUserInfo(state){
      state.userInfo = {}
    }
  },

  actions:{

        // INIT_WEBSOCKET({commit}){
        //   commit('newWebsocket' , new WebSocket(wsUrl))

        //   const token = sessionStorage.getItem('userToken')

          
        // }
  },
  modules: {
    app,
    settings,
    user,
    // info
  },
  getters
  
})



export default store
