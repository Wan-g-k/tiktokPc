<template>
  <a-layout-sider width="auto">
    <!-- 平台账号 -->
    <div class="user-type">
      <p>登录平台</p>
      <div class="type-list">
        <div
          v-for="(item, i) in this.$store.state.typeList"
          :key="item.name + i"
          :class="['item-list', { typeactive: codeActive == i }]"
          @click="throttle(item, i)"
        >
          <a-tooltip :title="item.name">
            <img :src="item.typeImg" alt="">
          </a-tooltip>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>

    <!-- 平台账号列表 -->
    <transition
      enter-active-class="bounceIn"
      leave-active-class="bounceOut"
      :duration="200"
    >
      <!-- <div class="news-type" v-if="userListKey.length > 0" ref="news-type" @scroll="scrollEvent"> -->
      <div v-if="userListKey.length > 0" ref="news-type" class="news-type">
        <a-input-search placeholder="搜索账号" @search="onSearch" />
        <div style="padding: 10px 5px">
          <div
            v-for="(item2, index2) in userListKey"
            :key="index2"
            :class="['my-img', { userctive: userActive == item2.userInfo.id }]"
            @click="account(item2, item2.userInfo.id)"
          >
            <a-avatar
              :src="item2.userInfo.avatar"
              shape="square"
              :size="40"
              icon="user"
            />
            <a-tooltip :title="item2.userInfo.nickname">
              <p>{{ item2.userInfo.nickname }}</p>
            </a-tooltip>
            <span v-if="item2.noReadNum != 0" style="width: 18px; height: 18px;border-radius: 20px; background: orangered; text-align: center;margin:-10px -10px 0px 0px; padding: 3px 1px 0px 0px; color: #fff;">{{ item2.noReadNum }}</span>
          </div>
          <!-- <a-pagination simple :default-current="2" :total="50" /> -->
        </div>
        <p v-if="textData" style="color: #fff; margin: 0px 0px 0px 40px">没有更多了。。。</p>
      </div>
    </transition>

    <!--好友列表 -->
    <transition
      enter-active-class="bounceIn"
      leave-active-class="bounceOut"
      :duration="200"
    >
      <div v-if="friendList.length > 0" class="user-list">
        <div class="user-list-seach">
          <a-input-search placeholder="搜索粉丝" @search="onSearch" />
        </div>
        <div class="user-list-box">
          <div
            v-for="(item, index) in friendList"
            :key="index"
            ref="userdiglog"
            :class="['user-detail', { codeactive: friendActive == index }]"
            @contextmenu.prevent="contextmenu(item, index)"
            @click="Fanschat(item.userInfo), (friendActive = index)"
          >
            <!-- 气泡 -->
            <div v-if="menuIndex == index" class="user-menu">
              <i
                class="el-icon-circle-close"
                @click.stop="menuIndex = null"
              />
              <ul>
                <li>置顶</li>
                <li>移除列表</li>
              </ul>
            </div>
            <div class="user-avatar-img">
              <a-badge class="item">
                <a-avatar
                  shape="square"
                  :size="50"
                  icon="user"
                  :src="item.userInfo.avatar"
                />
              </a-badge>
            </div>
            <div class="user-name">
              <div class="user-time">
                <a-tooltip :title="item.userInfo.nickname">
                  <p v-if="item.userInfo.remarks == ''">{{ item.userInfo.nickname }}</p>
                  <p v-if="item.userInfo.remarks != ''">{{ item.userInfo.remarks }}</p>
                  <p style="color: #000;margin-top: 3px;">国家：{{ item.userInfo.region }}</p>
                </a-tooltip>
                <p>{{ computedMoment(item.userInfo.created_at) }}</p>
                <span v-if="item.noReadNum != 0" style="width: 18px; height: 18px;border-radius: 20px; background: orangered; text-align: center;margin:-10px -10px 0px 0px; padding: 3px 1px 0px 0px; color: #fff;">{{ item.noReadNum }}</span>
              </div>
              <!-- <p
                class="user-centent"
                v-if="
                  item.messgeList[item.messgeList.length - 1]['type'] ==
                  'messge'
                "
              >
                {{ item.messgeList[item.messgeList.length - 1]["messge"] }}
              </p> -->
              <!-- <p
                class="user-centent"
                v-if="
                  item.messgeList[item.messgeList.length - 1]['type'] == 'img'
                "
              >
                [图片]
              </p> -->
            </div>
          </div>
        </div>
      </div>
    </transition>
  </a-layout-sider>
</template>

<script>
import bus from '../utils/brotherBus'
import * as api from '@/api/index'
import moment from 'moment'
export default {
  data() {
    return {
      flag: true,
      accountflag: true,
      Fansflag: true,
      codeActive: null,
      userActive: null,
      friendActive: null,
      seachValue: '',
      userListKey: [],
      friendList: [],
      skList: [],
      menuIndex: null,
      keyBoolin: false,
      accountId: null,
      textData: false,
      total: 0,
      parame: {
        page: 1,
        page_size: 100,
        order_created_at: true
      }
    }
  },
  computed: {
    computedMoment() {
      return function(value) {
        return moment(value).format('HH:mm')
      }
    },
    setDataKey: function() {
      return this.$store.state.setDataKey
    }
  },
  watch: {
    /* setDataKey: {
      handler: function (oldVal, newVal) {
        console.log(oldVal)
        console.log(newVal)
        this.setDataKey = this.$store.state.setDataKey
      },
      immediate: true
    } */
  },
  mounted() {
    this.$store.commit('getUserInfo', {})
    document.addEventListener('scroll', this.Scroll)
    window.addEventListener('storage', event => {
      if (event.key === 'accountList') {
        // console.log(event.newValue)
      }
    })
    window.addEventListener('storage', event => {
      if (event.key === 'fansList') {
        // console.log(event.newValue)
      }
    })
  },
  methods: {
    manageDataList() {
      localStorage.setItem('skList', JSON.stringify(this.skList))
    },
    scrollEvent(e) {
      if (e.srcElement.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - 100) {
        // 加载更多
        if (this.parame.page_size <= this.total) {
          this.parame.page_size = this.parame.page_size + 10
          this.getChumList()
        } else {
          this.textData = true
        }
      }
    },
    onSearch() {},
    // 获取好友列表
    getChumList() {
      this.$store.commit('getUserInfo', {})
      const form = {}
      form.page = this.parame.page
      form.page_size = this.parame.page_size
      form.order_created_at = this.parame.order_created_at
      api.getChatRoom(form).then((res) => {
        if (res.code === 0) {
          this.total = res.data.count
          this.textData = false
          // this.userListKey = res.data.data;
          localStorage.setItem('accountId', 0)
          this.getChumCountList()
        }
      })
    },
    // 获取所有好友列表
    getChumCountList() {
      const form = {}
      form.page = this.parame.page
      form.page_size = this.total
      form.order_created_at = this.parame.order_created_at
      api.getChatRoom(form).then((res) => {
        if (res.code === 0) {
          this.textData = false
          let dataList = res.data.data
          if (dataList != null || dataList != undefined || dataList != []) {
            this.$store.commit('accountListData', dataList)
          } else {
            dataList = []
            this.$store.commit('accountListData', dataList)
          }
          // this.userListKey = JSON.parse(localStorage.getItem('accountList'))
          this.userListKey = this.$store.state.accountList
        }
      })
    },
    checkStoreMsgData() {
      var that = this
      if (!that.$store.state.msgObj) {
        return false
      }
      if (!that.$store.state.msgObj['tiktok']) {
        return false
      }
      return true
    },
    // 数据右击事件
    contextmenu(item, index) {
      this.menuIndex = index
    },
    // 选择平台
    throttle(item, index) {
      if (this.flag) {
        this.flag = false
        this.getUserType(item, index)
        setTimeout(() => {
          this.flag = true
        }, 2000)
      }
    },
    getUserType(item, index) {
      // this.$store.commit("getUserInfo", {})
      (this.codeActive = index), (this.userListKey = [])
      this.friendList = []
      this.getChumList()
      //   this.userListKey = item.myUserinfoList;
    },
    account(item, index) {
      if (this.accountflag) {
        this.accountflag = false
        this.getFriendList(item, index)
        setTimeout(() => {
          this.accountflag = true
        }, 2000)
      }
    },
    // 选择账号获取粉丝列表
    getFriendList(item, index) {
      var that = this
      this.userActive = index
      this.$store.commit('getUserInfo', {})
      // this.$store.commit("getMyInfo", item);
      this.friendList = []
      localStorage.setItem('accountId', index)
      localStorage.setItem('userId', 0)
      this.accountId = index
      const parame = this.parame
      parame.account_id = index
      api.getFansList(parame).then((res) => {
        // console.log(res.data.data)
        // forEach
        let dataList = res.data.data
        if (dataList != null && dataList != undefined && dataList != []) {
          this.$store.commit('fansListData', dataList)
        }
        if (dataList === []) {
          dataList = []
          this.$store.commit('fansListData', [])
        }
        // that.friendList = JSON.parse(localStorage.getItem('fansList'))
        that.friendList = this.$store.state.fansList
      })
    },
    Fanschat(item) {
      if (this.Fansflag) {
        this.Fansflag = false
        this.getUserDetial(item)
        setTimeout(() => {
          this.Fansflag = true
        }, 1000)
      }
    },
    // 获取粉丝聊天记录
    getUserDetial(item) {
      localStorage.setItem('userId', item.id)
      this.$store.commit('getUserInfo', item)
      bus.$emit('setScroll')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list,
.empty-list,
.news-type,
.user-type {
  margin: 0 1px;
  overflow: auto;
  background: #304156;
}
.userctive {
  background: #eeeeee !important;
  border-radius: 4px !important;
}
.typeactive {
  background: #a2a2a2 !important;
  border-radius: 4px !important;
}
.codeactive {
  background: #a2a2a2 !important;
  border-radius: 4px !important;
}
.user-type {
  background: #304156;
  > p {
    text-align: center;
    font-weight: 700;
    color: white;
    margin: 10px 0;
  }
}
::v-deep .el-badge__content {
  padding: 0 6px;
}
::v-deep .el-badge {
  width: 100%;
  height: 100%;
}
.empty-list {
  padding: 5px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  width: 170px;
  ::v-deep .el-empty {
    flex: 1;
    padding: 0 5px;
  }
  .el-tag {
    width: 100%;
    color: black;
    text-align: center;
  }
}
::v-deep .ant-layout-sider-children {
  color: #333;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  .user-type {
    width: 150px;
    padding: 5px;
    box-sizing: border-box;
    .el-tag {
      width: 100%;
      color: black;
      text-align: center;
    }
    .type-list {
      flex-wrap: wrap;
      margin-top: 33px;
      p{
        font-weight: 600;
        color: #fff;
      }
    }
    .item-list {
      display: flex;
      margin: 10px 0;
      margin-top: 20px;
      p {
        font-size: 14px;
        display: flex;
        color: white;
        align-items: center;
      }
      img {
        width: 40px;
        margin: 0 10px;
        margin-left: 0;
        background: white;
        border-radius: 5px;
        height: 40px;
      }
    }
  }
  .news-type {
    width: 170px;
    padding: 5px;
    box-sizing: border-box;
    .my-img {
      background: white;
      border-radius: 4px;
      display: flex;
      padding: 4px;
      margin: 10px 5px;
      p {
        margin: 10px 0;
        font-size: 16px;
        margin-left: 10px;
        flex: 1;
        width: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }
    }
  }
}
.user-list {
  width: 250px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  background: #e9e9e9;
  .user-list-box {
    flex: 1;
    padding: 10px 5px;
    .user-detail {
      padding: 2px;
      margin: 10px 0;
      display: flex;
      position: relative;
      background: #fff;
      border-radius: 5px;
      .user-menu {
        ul {
          li {
            line-height: 26px;
          }
        }
        i {
          position: absolute;
          right: 2px;
          top: 2px;
          font-size: 18px;
        }
        z-index: 999;
        position: absolute;
        right: 1px;
        background: white;
        padding: 10px;
        border-radius: 4px;
        width: 150px;
        right: 0px;
        top: 29px;
        z-index: 9;
      }
      .user-time {
        flex: 0.5;
        // text-align: right;
        font-size: 10px;
        display: flex;
        justify-content: space-between;
      }
      .user-name {
        flex: 1;
        margin: 0 5px 0 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2px;
        background: #fff;
        .user-centent {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        p:nth-child(1) {
          font-weight: 700;
          font-size: 14px;
          width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        p:nth-child(2) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
      .user-avatar-img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        img {
          width: 50px;
          height: 50px;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
