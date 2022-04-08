<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="6">
        <div>
          <a-col :span="24" style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px;  margin: 0px 0px 20px 0px;">
            <div>
              <a-col :span="10">
                <div>
                  <p class="textColor">
                    <img src="../../assets/trafficIcon.svg">
                    {{this.$t('admin.flowInformation')}}
                  </p>
                  <p style="margin: 10px 0 10px 0;" v-if="this.flow.second" class="describeText">{{this.$t('user.totalFlow')}}:{{this.flow.count+'M'}}</p>
                  <p style="margin: 10px 0 10px 0;" v-if="this.flow.second" class="describeText">{{this.$t('user.used')}}:{{this.flow.useing+'M'}}</p>
                  <p style="margin: 10px 0 10px 0;" v-if="this.flow.second" class="describeText">{{this.$t('user.remainingFlow')}}:{{this.flow.second+'M'}}</p>
                </div>
              </a-col>
              <a-col :span="14" class="traffic">
                <div ref="traffic" class="traffic" style="width: 100%; height: 25vh;"></div>
                <!-- <div class="homeBJ" v-if="!this.flow.second" style="width: 100%; height: 350px;"></div> -->
              </a-col>
            </div>
          </a-col>
          <a-col :span="24" style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px;  margin: 0px 0px 20px 0px;">
            <div>
              <a-col :span="10">
                <div>
                  <p class="textColor">
                    <img src="../../assets/portsIcon.svg">{{this.$t('user.portInformation')}}</p>
                  <p style="margin: 10px 0 10px 0;" v-if="this.port.good_count" class="describeText">{{this.$t('admin.portNumber')}}:{{this.port.count}}</p>
                  <p style="margin: 10px 0 10px 0;" v-if="this.port.good_count" class="describeText">{{this.$t('user.normalPort')}}:{{this.port.good_count}}</p>
                  <p style="margin: 10px 0 10px 0;" v-if="this.port.good_count" class="describeText">{{this.$t('user.willExpire')}}:{{this.port.will_expire}}</p>
                  <p style="margin: 10px 0 10px 0;" v-if="this.port.good_count" class="describeText">{{this.$t('user.expired')}}:{{this.port.is_expire}}</p>
                </div>
              </a-col>
              <a-col :span="14" class="ports">
                <div ref="ports" class="ports" style="width: 100%; height: 25vh;"></div>
                <!-- <div class="homeBJ" v-if="!this.port.good_count" style="width: 100%; height: 300px"></div> -->
              </a-col>
            </div>
          </a-col>
        </div>
      </a-col>
      <a-col :span="18">
        <div style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px;  margin: 0px 0px 20px 0px;">
          <p class="textColor">
            <img style="margin: 10px 0px 0px 20px;" src="../../assets/taskIcon.svg">{{this.$t('user.taskInformation')}}</p>
          <div ref="task" class="task" style="width: 100%; height: 47vh;"></div>
          <div class="homeBJbar" v-if="!this.port.good_count"></div>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="16" align="bottom">
      <a-col :span="12" >
        <div style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px;  width: 100%; height: 300px;">
          <p class="textColor">
            <img style="margin: 10px 0px 0px 20px;" src="../../assets/attentionIcon.svg">{{this.$t('user.ConcernTask')}}</p>
            <div class="homeBJbar" v-if="!this.port.good_count"></div>
          <div v-if="this.port.good_count" style="margin: 20px 0 10px 0;">
            <a-col :span="24" class="progressHei">
              <a-col class="describeText" :span="4">{{this.$t('user.followYesterday')}}：</a-col>
              <a-col :span="14" style="margin:0 0 15px 0">
                <a-progress  :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#909dfb',
                  }" :stroke-width="13" :percent="100" :format="() => ''" />
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.followYesterday')}}：{{this.taskFollow.today_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.YesterdaySuccess')}}：</a-col>
              <a-col :span="14" style="margin:0 0 15px 0">
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#ffc853',
                  }" :stroke-width="13" :percent="parseInt(this.taskFollow.today_success_count/this.taskFollow.today_count*100)" :format="() => ''" />
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.YesterdaySuccess')}}：{{this.taskFollow.today_success_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.careFailedYesterday')}}：</a-col>
              <a-col :span="14" style="margin:0 0 15px 0">
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#44dd6b',
                  }" :stroke-width="13" :percent="parseInt(this.taskFollow.today_fail_count/this.taskFollow.today_count*100)"  :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.careFailedYesterday')}}：{{this.taskFollow.today_fail_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.totalAttention')}}：</a-col>
              <a-col :span="14" style="margin:0 0 15px 0">
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#f65d75',
                  }" :stroke-width="13" :percent="100"  :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.totalAttention')}}：{{this.taskFollow.count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.beingExecuted')}}：</a-col>
              <a-col :span="14" style="margin:0 0 15px 0">
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#2aeedb',
                  }" :stroke-width="13" :percent="parseInt(this.taskFollow.running_count/this.taskFollow.count*100)"  :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.beingExecuted')}}：{{this.taskFollow.running_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.hasBeenCompleted')}}：</a-col>
              <a-col :span="14" style="margin:0 0 15px 0">
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#fbf25a',
                  }" :stroke-width="13" :percent="parseInt(this.taskFollow.over_count/this.taskFollow.count*100)"  :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.hasBeenCompleted')}}：{{this.taskFollow.over_count}}</a-col>
            </a-col>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px; width: 100%; height: 300px;">
          <p class="textColor">
            <img style="margin: 10px 0px 0px 20px;" src="../../assets/privateIcon.svg">{{this.$t('user.privateMessageTask')}}</p>
            <div class="homeBJbar" v-if="!this.port.good_count"></div>
          <div v-if="this.port.good_count" style="margin: 20px 0 10px 0;">
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.YesterdayPersonalCommunication')}}：</a-col>
              <a-col :span="14" style="margin:0vh 0vw 15px 0vw">
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#909dfb',
                  }" :stroke-width="13" :percent="100" :format="() => ''"/>
              </a-col>
              <a-col class="taskLetterm" :span="6">{{this.$t('user.YesterdayPersonalCommunication')}}：{{this.taskLetter.today_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.privateMessageYesterdayOk')}}：</a-col>
              <a-col :span="14" style="margin:0vh 0vw 15px 0vw">
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#ffc853',
                  }" :stroke-width="13" :percent="parseInt(this.taskLetter.today_success_count/this.taskLetter.today_count*100)" :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.privateMessageYesterdayOk')}}：{{this.taskLetter.today_success_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.privateMessageFailedYesterday')}}：</a-col>
              <a-col :span="14" style="margin:0vh 0vw 15px 0vw">            
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#44dd6b',
                  }" :stroke-width="13" :percent="parseInt(this.taskLetter.today_fail_count/this.taskLetter.today_count*100)" :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.privateMessageFailedYesterday')}}：{{this.taskLetter.today_fail_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.numberOfPrivateMessages')}}：</a-col>
              <a-col :span="14" style="margin:0vh 0vw 15px 0vw">            
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#f65d75',
                  }" :stroke-width="13" :percent="100" :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.numberOfPrivateMessages')}}：{{this.taskLetter.count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.beingExecuted')}}：</a-col>
              <a-col :span="14" style="margin:0vh 0vw 15px 0vw">            
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#2aeedb',
                  }" :stroke-width="13" :percent="parseInt(this.taskLetter.running_count/this.taskLetter.count*100)" :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.beingExecuted')}}：{{this.taskLetter.running_count}}</a-col>
            </a-col>
            <a-col :span="24">
              <a-col class="describeText" :span="4">{{this.$t('user.hasBeenCompleted')}}：</a-col>
              <a-col :span="14" style="margin:0vh 0vw 15px 0vw">            
                <a-progress :stroke-color="{
                    '0%': '#eff1fe',
                    '100%': '#fbf25a',
                  }" :stroke-width="13" :percent="parseInt(this.taskLetter.today_over_count/this.taskLetter.count*100)" :format="() => ''"/>
              </a-col>
              <a-col class="describeText" :span="6">{{this.$t('user.hasBeenCompleted')}}：{{this.taskLetter.today_over_count}}</a-col>
            </a-col>
          </div>
        </div>
        
      </a-col>
    </a-row>
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->
    <a-modal v-model="afficheVisible" width="50%" :title="title" ok-text="确认" cancel-text="取消" @cancel="handleCancel" @ok="handleOk">
      <div class="affiche">
        {{this.affiche}}
      </div>
    </a-modal>
    <statement-duty/>
    <!-- 世界地图 -->
    <!-- <div id="chart6" class="chart6" style="width: 100%; height: 500px; padding: 0px; margin: 0px 58px 20px 0px;; border: none;"></div> -->
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup"
import statementDuty from '../../components/statement/index.vue'
import world from '../../mapData/world.json'
import * as api from '@/api/index'
export default {
  name: "DashDoard",
  components: {
    PanelGroup,
    statementDuty
  },
  data() {
    return {
      value: "world",
      afficheVisible: false,
      affiche: null,
      title: null,
      promptVisible: JSON.parse(localStorage.getItem('promptVisible')),
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      newDataList: [],
      flow: {
        count: 0,
        second: 0,
        useing: 0
      },
      port: {
        count: 0,
        good_count: 0,
        is_expire: 0,
        will_expire: 0
      },
      taskFollow: {
        count: 4,
        over_count: 2,
        running_count: 0
      },
      over_count: 0,
      running_count: 0,
      tasklist: {
        account: [],
        account_record_count: [],
        follower_count: [],
        panic_account_count: [],
        today_new_record_count: [],
        yestoday_follwer_count: []
      },
      taskLetter: {
        count: 0,
        today_count: 0,
        today_over_count: 0
      },
      //注册地图json
      jsonMap: {
        'world':world
      },
      // 全球数据
      worldData :[
        {name: '美国', gold: 46, silver: 29, copper: 29, value: 104},
        {name: '中国', gold: 38, silver: 27, copper: 23, value: 88},
        {name: '英国', gold: 29, silver: 17, copper: 19, value: 65},
        {name: '俄罗斯', gold: 24, silver: 25, copper: 33, value: 82},
        {name: '韩国', gold: 13, silver: 8, copper: 7, value: 28},
        {name: '德国', gold: 11, silver: 19, copper: 14, value: 44},
        {name: '法国', gold: 11, silver: 11, copper: 12, value: 34},
        {name: '意大利', gold: 8, silver: 9, copper: 11, value: 28},
        {name: '匈牙利', gold: 8, silver: 4, copper: 5, value: 17},
        {name: '澳大利亚', gold: 7, silver: 16, copper: 12, value: 35},
        {name: '日本', gold: 7, silver: 14, copper: 17, value: 38},
        {name: '哈萨克斯坦', gold: 7, silver: 1, copper: 5, value: 13},
        {name: '荷兰', gold: 6, silver: 6, copper: 8, value: 20},
        {name: '乌克兰', gold: 6, silver: 5, copper: 9, value: 20},
        {name: '古巴', gold: 5, silver: 3, copper: 6, value: 14},
        {name: '新西兰', gold: 5, silver: 3, copper: 5, value: 13},
        {name: '伊朗', gold: 4, silver: 5, copper: 3, value: 12},
        {name: '牙买加', gold: 4, silver: 4, copper: 4, value: 12},
        {name: '捷克', gold: 4, silver: 3, copper: 3, value: 10},
        {name: '朝鲜', gold: 4, silver: 0, copper: 2, value: 6},
        {name: '西班牙', gold: 3, silver: 10, copper: 4, value: 17},
        {name: '巴西', gold: 3, silver: 5, copper: 9, value: 17},
        {name: '白俄罗斯', gold: 3, silver: 5, copper: 5, value: 13},
        {name: '南非', gold: 3, silver: 2, copper: 1, value: 6},
        {name: '埃塞俄比亚', gold: 3, silver: 1, copper: 3, value: 7},
        {name: '克罗地亚', gold: 3, silver: 1, copper: 2, value: 6},
        {name: '罗马尼亚', gold: 2, silver: 5, copper: 2, value: 9},
        {name: '肯尼亚', gold: 2, silver: 4, copper: 5, value: 11},
        {name: '丹麦', gold: 2, silver: 4, copper: 3, value: 9},
        {name: '波兰', gold: 2, silver: 2, copper: 6, value: 10},
        {name: '阿塞拜疆', gold: 2, silver: 2, copper: 6, value: 10},
        {name: '土耳其', gold: 2, silver: 2, copper: 1, value: 5},
        {name: '瑞士', gold: 2, silver: 2, copper: 0, value: 4},
        {name: '立陶宛', gold: 2, silver: 1, copper: 2, value: 5},
        {name: '挪威', gold: 2, silver: 1, copper: 1, value: 4},
        {name: '加拿大', gold: 1, silver: 5, copper: 12, value: 18},
        {name: '瑞典', gold: 1, silver: 4, copper: 3, value: 8},
        {name: '格陵兰', gold: 1, silver: 3, copper: 4, value: 10},
        {name: '哥伦比亚', gold: 1, silver: 3, copper: 4, value: 8},
        {name: '格鲁吉亚', gold: 1, silver: 3, copper: 3, value: 7},
        {name: '墨西哥', gold: 1, silver: 3, copper: 3, value: 7},
        {name: '爱尔兰', gold: 1, silver: 1, copper: 3, value: 5},
        {name: '塞尔维亚', gold: 1, silver: 1, copper: 2, value: 4},
        {name: '斯洛文尼亚', gold: 1, silver: 1, copper: 2, value: 4},
        {name: '阿根廷', gold: 1, silver: 1, copper: 2, value: 4},
        {name: '突尼斯', gold: 1, silver: 1, copper: 1, value: 3},
        {name: '多米尼加', gold: 1, silver: 1, copper: 0, value: 2},
        {name: '乌兹别克斯坦', gold: 1, silver: 0, copper: 3, value: 4},
        {name: '特立尼达和多巴哥', gold: 1, silver: 0, copper: 3, value: 4},
        {name: '拉脱维亚', gold: 1, silver: 0, copper: 1, value: 2},
        {name: '格林纳达', gold: 1, silver: 0, copper: 0, value: 1},
        {name: '巴哈马', gold: 1, silver: 0, copper: 0, value: 1},
        {name: '乌干达', gold: 1, silver: 0, copper: 0, value: 1},
        {name: '委内瑞拉', gold: 1, silver: 0, copper: 0, value: 1},
        {name: '阿尔及利亚', gold: 1, silver: 0, copper: 0, value: 1},
        {name: '印度', gold: 0, silver: 2, copper: 4, value: 6},
        {name: '蒙古', gold: 0, silver: 2, copper: 3, value: 5},
        {name: '泰国', gold: 0, silver: 2, copper: 1, value: 3},
        {name: '埃及', gold: 0, silver: 2, copper: 0, value: 2},
        {name: '斯洛伐克', gold: 0, silver: 1, copper: 3, value: 4},
        {name: '比利时', gold: 0, silver: 1, copper: 2, value: 3},
        {name: '芬兰', gold: 0, silver: 1, copper: 2, value: 3},
        {name: '亚美尼亚', gold: 0, silver: 1, copper: 2, value: 3},
        {name: '马来西亚', gold: 0, silver: 1, copper: 1, value: 2},
        {name: '中华台北', gold: 0, silver: 1, copper: 1, value: 2},
        {name: '爱沙尼亚', gold: 0, silver: 1, copper: 1, value: 2},
        {name: '保加利亚', gold: 0, silver: 1, copper: 1, value: 2},
        {name: '印度尼西亚', gold: 0, silver: 1, copper: 1, value: 2},
        {name: '波多黎各', gold: 0, silver: 1, copper: 1, value: 2},
        {name: '黑山', gold: 0, silver: 1, copper: 0, value: 1},
        {name: '博茨瓦纳', gold: 0, silver: 1, copper: 0, value: 1},
        {name: '塞浦路斯', gold: 0, silver: 1, copper: 0, value: 1},
        {name: '葡萄牙', gold: 0, silver: 1, copper: 0, value: 1},
        {name: '加蓬', gold: 0, silver: 1, copper: 0, value: 1},
        {name: '危地马拉', gold: 0, silver: 1, copper: 0, value: 1},
        {name: '卡塔尔', gold: 0, silver: 0, copper: 2, value: 2},
        {name: '新加坡', gold: 0, silver: 0, copper: 2, value: 2},
        {name: '希腊', gold: 0, silver: 0, copper: 2, value: 2},
        {name: '摩尔多瓦', gold: 0, silver: 0, copper: 2, value: 2},
        {name: '巴林', gold: 0, silver: 0, copper: 1, value: 1},
        {name: '塔吉克斯坦', gold: 0, silver: 0, copper: 1, value: 1},
        {name: '中国香港', gold: 0, silver: 0, copper: 1, value: 1},
        {name: '摩洛哥', gold: 0, silver: 0, copper: 1, value: 1},
        {name: '沙特阿拉伯', gold: 0, silver: 0, copper: 1, value: 1},
        {name: '科威特', gold: 0, silver: 0, copper: 1, value: 1},
        {name: '阿富汗', gold: 0, silver: 0, copper: 1, value: 1}
      ],
      // 全球地域中文映射
      nameMap : {
        'Afghanistan':'阿富汗',
        'Albania':'阿尔巴尼亚',
        'Algeria':'阿尔及利亚',
        'Andorra':'安道尔',
        'Angola':'安哥拉',
        'Antarctica':'南极洲',
        'Antigua and Barbuda':'安提瓜和巴布达',
        'Argentina':'阿根廷',
        'Armenia':'亚美尼亚',
        'Australia':'澳大利亚',
        'Austria':'奥地利',
        'Azerbaijan':'阿塞拜疆',
        'The Bahamas':'巴哈马',
        'Bahrain':'巴林',
        'Bangladesh':'孟加拉国',
        'Barbados':'巴巴多斯',
        'Belarus':'白俄罗斯',
        'Belgium':'比利时',
        'Belize':'伯利兹',
        'Benin':'贝宁',
        'Bermuda':'百慕大',
        'Bhutan':'不丹',
        'Bolivia':'玻利维亚',
        'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那',
        'Botswana':'博茨瓦纳',
        'Brazil':'巴西',
        'Brunei':'文莱',
        'Bulgaria':'保加利亚',
        'Burkina Faso':'布基纳法索',
        'Burundi':'布隆迪',
        'Cambodia':'柬埔寨',
        'Cameroon':'喀麦隆',
        'Canada':'加拿大',
        'Cape Verde':'佛得角',
        'Central African Rep.':'中非共和国',
        "Côte d'Ivoire":'象牙海岸',
        'Chad':'乍得',
        'Chile':'智利',
        'China':'中国',
        'Colombia':'哥伦比亚',
        'Comoros':'科摩罗',
        'Dem. Rep. Congo':'刚果共和国',
        'Congo':'刚果',
        'Costa Rica':'哥斯达黎加',
        'Croatia':'克罗地亚',
        'Cuba':'古巴',
        'Cyprus':'塞浦路斯',
        'Czech Republic':'捷克共和国',
        'Denmark':'丹麦',
        'Djibouti':'吉布提',
        'Dominica':'多米尼加',
        'Dominican Republic':'多明尼加共和国',
        'Ecuador':'厄瓜多尔',
        'Egypt':'埃及',
        'El Salvador':'萨尔瓦多',
        'Equatorial Guinea':'赤道几内亚',
        'Eritrea':'厄立特里亚',
        'Estonia':'爱沙尼亚',
        'Ethiopia':'埃塞俄比亚',
        'Falkland Islands':'福克兰群岛',
        'Faroe Islands':'法罗群岛',
        'Fiji':'斐济',
        'Finland':'芬兰',
        'France':'法国',
        'French Guiana':'法属圭亚那',
        'French Southern and Antarctic Lands':'法属南半球和南极领地',
        'Gabon':'加蓬',
        'Gambia':'冈比亚',
        'Gaza Strip':'加沙',
        'Georgia':'格鲁吉亚',
        'Germany':'德国',
        'Ghana':'加纳',
        'Greece':'希腊',
        'Greenland':'格陵兰',
        'Grenada':'格林纳达',
        'Guadeloupe':'瓜德罗普',
        'Guatemala':'危地马拉',
        'Guinea':'几内亚',
        'Guinea Bissau':'几内亚比绍',
        'Guyana':'圭亚那',
        'Haiti':'海地',
        'Honduras':'洪都拉斯',
        'Hong Kong':'香港',
        'Hungary':'匈牙利',
        'Iceland':'冰岛',
        'India':'印度',
        'Indonesia':'印尼',
        'Iran':'伊朗',
        'Iraq':'伊拉克',
        'Iraq-Saudi Arabia Neutral Zone':'伊拉克阿拉伯中立区',
        'Ireland':'爱尔兰',
        'Isle of Man':'马恩岛',
        'Israel':'以色列',
        'Italy':'意大利',
        'Ivory Coast':'科特迪瓦',
        'Jamaica':'牙买加',
        'Jan Mayen':'扬马延岛',
        'Japan':'日本',
        'Jordan':'约旦',
        'Kazakhstan':'哈萨克斯坦',
        'Kenya':'肯尼亚',
        'Kerguelen':'凯尔盖朗群岛',
        'Kiribati':'基里巴斯',
        'Dem. Rep. Korea':'朝鲜',
        'Korea':'韩国',
        'Kuwait':'科威特',
        'Kyrgyzstan':'吉尔吉斯斯坦',
        'Lao PDR':'老挝',
        'Latvia':'拉脱维亚',
        'Lebanon':'黎巴嫩',
        'Lesotho':'莱索托',
        'Liberia':'利比里亚',
        'Libya':'利比亚',
        'Liechtenstein':'列支敦士登',
        'Lithuania':'立陶宛',
        'Luxembourg':'卢森堡',
        'Macau':'澳门',
        'Macedonia':'马其顿',
        'Madagascar':'马达加斯加',
        'Malawi':'马拉维',
        'Malaysia':'马来西亚',
        'Maldives':'马尔代夫',
        'Mali':'马里',
        'Malta':'马耳他',
        'Martinique':'马提尼克',
        'Mauritania':'毛里塔尼亚',
        'Mauritius':'毛里求斯',
        'Mexico':'墨西哥',
        'Moldova':'摩尔多瓦',
        'Monaco':'摩纳哥',
        'Mongolia':'蒙古',
        'Morocco':'摩洛哥',
        'Mozambique':'莫桑比克',
        'Myanmar':'缅甸',
        'Namibia':'纳米比亚',
        'Nepal':'尼泊尔',
        'Netherlands':'荷兰',
        'New Caledonia':'新喀里多尼亚',
        'New Zealand':'新西兰',
        'Nicaragua':'尼加拉瓜',
        'Niger':'尼日尔',
        'Nigeria':'尼日利亚',
        'Northern Mariana Islands':'北马里亚纳群岛',
        'Norway':'挪威',
        'Oman':'阿曼',
        'Pakistan':'巴基斯坦',
        'Panama':'巴拿马',
        'Papua New Guinea':'巴布亚新几内亚',
        'Paraguay':'巴拉圭',
        'Peru':'秘鲁',
        'Philippines':'菲律宾',
        'Poland':'波兰',
        'Portugal':'葡萄牙',
        'Puerto Rico':'波多黎各',
        'Qatar':'卡塔尔',
        'Reunion':'留尼旺岛',
        'Romania':'罗马尼亚',
        'Russia':'俄罗斯',
        'Rwanda':'卢旺达',
        'San Marino':'圣马力诺',
        'Sao Tome and Principe':'圣多美和普林西比',
        'Saudi Arabia':'沙特阿拉伯',
        'Senegal':'塞内加尔',
        'Seychelles':'塞舌尔',
        'Sierra Leone':'塞拉利昂',
        'Singapore':'新加坡',
        'Slovakia':'斯洛伐克',
        'Slovenia':'斯洛文尼亚',
        'Solomon Islands':'所罗门群岛',
        'Somalia':'索马里',
        'S. Sudan':'苏丹',
        'South Africa':'南非',
        'Spain':'西班牙',
        'Sri Lanka':'斯里兰卡',
        'St. Christopher-Nevis':'圣',
        'St. Lucia':'圣露西亚',
        'St. Vincent and the Grenadines':'圣文森特和格林纳丁斯',
        'Sudan':'苏丹',
        'Suriname':'苏里南',
        'Svalbard':'斯瓦尔巴特群岛',
        'Swaziland':'斯威士兰',
        'Sweden':'瑞典',
        'Switzerland':'瑞士',
        'Syria':'叙利亚',
        'Taiwan':'台湾',
        'Tajikistan':'塔吉克斯坦',
        'United Republic of Tanzania':'坦桑尼亚',
        'Thailand':'泰国',
        'Togo':'多哥',
        'Tonga':'汤加',
        'Trinidad and Tobago':'特里尼达和多巴哥',
        'Tunisia':'突尼斯',
        'Turkey':'土耳其',
        'Turkmenistan':'土库曼斯坦',
        'Tanzania':'坦桑尼亚',
        'Turks and Caicos Islands':'特克斯和凯科斯群岛',
        'Uganda':'乌干达',
        'Ukraine':'乌克兰',
        'United Arab Emirates':'阿联酋',
        'United Kingdom':'英国',
        'United States':'美国',
        'Uruguay':'乌拉圭',
        'Uzbekistan':'乌兹别克斯坦',
        'Vanuatu':'瓦努阿图',
        'Venezuela':'委内瑞拉',
        'Vietnam':'越南',
        'Western Sahara':'西撒哈拉',
        'Western Samoa':'西萨摩亚',
        'Yemen':'也门',
        'Yugoslavia':'南斯拉夫',
        'Democratic Republic of the Congo':'刚果民主共和国',
        'Zambia':'赞比亚',
        'Zimbabwe':'津巴布韦',
        'South Sudan':'南苏丹',
        'Somaliland':'索马里兰',
        'Montenegro':'黑山',
        'Kosovo':'科索沃',
        'Republic of Serbia':'塞尔维亚',
      },
    }
  },
  created(){
    //   循环注册地图
    /* for (let index in this.jsonMap) {
      this.$echarts.registerMap(index, this.jsonMap[index])
    }  */
  },
  mounted() {
    this.getHomeInfo()
    this.getFlowDataList()
    // 地图初始化
    // this.chinaConfigure(this.value);
    this.getPublish()
    this.newData()
  },
  methods: {
    newData() {
      let dateArray = [];
      let myDate = new Date()
      myDate.setDate(myDate.getDate() - 7)
      let dateTemp = '' 
      let flag = 1; 
      for (let i = 0; i < 7; i++) {
        dateTemp = myDate.getFullYear() + '-' +(myDate.getMonth()+1)+"-"+myDate.getDate()
        dateArray.push({
          date:dateTemp
        });
        myDate.setDate(myDate.getDate() + flag)
      }
      this.newDataList = dateArray.map(item => {
        return item.date
      })
    },
    getPublish() {
      api.getPublish().then(res => {
        if(res.code === 0 && res.data.data.length > 0) {
          this.affiche = res.data.data[0].content
          this.title = res.data.data[0].title
          this.afficheVisible = JSON.parse(window.sessionStorage.getItem('visible'))
        }
      })
    },
    getHomeInfo() {
      let form = {}
      let user_id = this.userInfo.data.i
      form.user_id = user_id
      api.getUserHomeInfo(form).then(res => {
        if(res.code === 0) {
          this.port = res.data.port_info
          this.taskFollow = res.data.task_follow_info
          
          // this.flow = res.data.flow_info
          
          this.tasklist = res.data.task_info
          this.taskLetter = res.data.task_letter_info
          this.over_count = parseInt(this.taskFollow.over_count/this.taskFollow.count*100)
          this.running_count = parseInt(this.taskFollow.running_count/this.taskFollow.count*100)
          this.today_count = parseInt(this.taskLetter.today_count/this.taskLetter.count*100)
          this.today_over_count = parseInt(this.taskLetter.today_over_count/this.taskLetter.count*100)
          this.getEchartData()
        }
      }).catch(err => {
        this.$message.error(err.msg)
        console.log(err)
      })
    },
    getFlowDataList() {
      let form = {}
      let user_id = this.userInfo.data.i
      form.user_id = user_id
       api.getUseGetFlow(form).then(res => {
         if(res.code === 0) {
          //  console.log(res)
           this.flow = res.data
           this.getEchartData()
         }
       }).catch(err => {
         this.$message.error(err.msg)
       })
    },
    handleOk() {
      this.afficheVisible = false
      window.sessionStorage.setItem('visible', this.afficheVisible)
    },
    handleCancel() {
      this.afficheVisible = false
      window.sessionStorage.setItem('visible', this.afficheVisible)
    },
    handleSetLineChartData() {},
    getEchartData() {
      const traffic = this.$refs.traffic;
      const ports = this.$refs.ports;
      const task = this.$refs.task;
      const gaugeData = [
        {
          value: this.flow.second,
          detail: {
            valueAnimation: true,
            offsetCenter: ['0%', '0%']
          }
        }
      ]
      if(task) {
        let myTask= this.$echarts.init(task)
        let option = {
          xAxis: {
            type: 'category',
            data: this.newDataList
          },
          legend: {
            data: [this.$t('admin.accountsNumber'), this.$t('user.followTheTotal'), this.$t('user.refocusTotal'),
            this.$t('user.addedAttentionYesterday'), this.$t('user.YesterdayCustomsClearance'), this.$t('user.abnormalAccount')]
          },
          yAxis: {
            type: 'value'
          },
          grid: {
            x: 50,
            // y: 25,
            x2: 40,
            y2: 50
          },
          series: [
            {
              name: this.$t('admin.accountsNumber'),
              data: this.tasklist.account,
              type: 'bar',
              showBackground: true,
              label: {
                show: true,
                position: 'top'
              },
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            },
            {
              name: this.$t('user.followTheTotal'),
              data: this.tasklist.account_record_count,
              type: 'bar',
              showBackground: true,
              label: {
                show: true,
                position: 'top'
              },
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            },
            {
              name: this.$t('user.refocusTotal'),
              data: this.tasklist.follower_count,
              type: 'bar',
              showBackground: true,
              label: {
                show: true,
                position: 'top'
              },
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            },
            {
              name: this.$t('user.addedAttentionYesterday'),
              data: this.tasklist.yestoday_follwer_count,
              type: 'bar',
              showBackground: true,
              label: {
                show: true,
                position: 'top'
              },
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            },
            {
              name: this.$t('user.YesterdayCustomsClearance'),
              data: this.tasklist.today_new_record_count,
              type: 'bar',
              showBackground: true,
              label: {
                show: true,
                position: 'top'
              },
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            },
            {
              name: this.$t('user.abnormalAccount'),
              data: this.tasklist.panic_account_count,
              type: 'bar',
              showBackground: true,
              label: {
                show: true,
                position: 'top'
              },
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        }
        myTask.setOption(option)
        /* window.onresize = function() {
          myTask.resize()
        } */
        window.addEventListener("resize", function () {
          myTask.resize()
        });
      }
      if(ports) {
        let myPorts= this.$echarts.init(ports);
        let option = {
          tooltip: {
            show: true
          },
          title: {
            text: this.port.count,
            top: "45%",
            left: 'center',
            textStyle: {
              color: '#FFA86D',
              fontSize: 16
            }
          },
          legend: {
            orient: 'horizontal',
            bottom: 'bottom',
            icon: 'circle',
          },
          series: [
            {
              type: "pie",
              radius: ["60%", "70%"],
              center: ["50%", "50%"],
              hoverAnimation: true,
              z: 10,
              itemStyle: {    
                normal: {
                  borderRadius: '50%',
                }
              },
              data: [ 
                { value: this.port.good_count, name: this.$t('user.normalPort'),
                  itemStyle: {
                      normal: {
                        borderRadius: '50%',
                        color: {
                          x: 0,
                          y: 1,
                          x2: 0,
                          y2: 0,
                          type: "linear",
                          colorStops: [{
                              offset: 1,
                              color: "#ffa70d"
                          },{
                              offset: 0,
                              color: "#ff7857"
                          }]
                        },
                      }
                    }
                  },
                // { value: this.port.will_expire, name: '即将过期' },
                { value: this.port.is_expire, name: this.$t('user.expired'),
                  itemStyle: {
                    normal: {
                      borderRadius: '50%',
                      color: "#dfe5f1",
                    }
                  }
                }
              ],
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              }
            },
            {
              type: "pie",
              radius: ["60%", "70%"],
              center: ["50%", "50%"],
              hoverAnimation: true,
              z: 1,
              itemStyle: {
                normal: {
                  color: "#dfe5f1",
                }
              },
              label: {
                show: false
              },
              color: "#dfe5f1",
              data: [this.port.count],
              labelLine: {
                show: false
              }
            }
          ]
        }
        myPorts.setOption(option);
        window.addEventListener("resize", function () {
          myPorts.resize()
        });
      }
      if (traffic) {
        let myTraffic= this.$echarts.init(traffic)
        let option = {
          tooltip: {
            show: true
          },
          title: {
            text: this.flow.second+'M',
            top: "45%",
            left: 'center',
            textStyle: {
              color: '#FFA86D',
              fontSize: 16
            }
          },
          legend: {
            orient: 'horizontal',
            bottom: 'bottom',
            icon: 'circle',
          },
          series: [
            {
              type: "pie",
              radius: ["60%", "70%"],
              center: ["50%", "50%"],
              hoverAnimation: true,
              z: 10,
              data: [
                { value: this.flow.second, name: this.$t('user.remainingFlow'),
                  itemStyle: {
                    normal: {
                      borderRadius: '50%',
                      color: {
                        x: 0,
                        y: 1,
                        x2: 0,
                        y2: 0,
                        type: "linear",
                        colorStops: [{
                            offset: 1,
                            color: "#bf26fc"
                        },{
                            offset: 0,
                            color: "#3e74fe"
                        }]
                      },
                    }
                  },
                },
                { value: this.flow.useing, name: this.$t('user.used'),
                  itemStyle: {
                    normal: {
                      borderRadius: '50%',
                      color: "#dfe5f1",
                    }
                  },
                },
              ],
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              }
            },
            {
              type: "pie",
              radius: ["60%", "70%"],
              center: ["50%", "50%"],
              hoverAnimation: true,
              z: 1,
              itemStyle: {
                normal: {
                  color: '#dfe5f1',
                }
              },
              label: {
                show: false
              },
              color: "#dfe5f1",
              data: [this.flow.count],
              labelLine: {
                show: false
              }
            }
          ]
        }
        myTraffic.setOption(option)
        window.addEventListener("resize", function () {
          myTraffic.resize()
        })
        
        /* this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function () {
         myTraffic.resize()
        })
      }); */
      }
      
      
    },
    chinaConfigure(area) {
      this.myChart = this.$echarts.init(document.getElementById("chart6")); //这里是为了获得容器所在位置        
      window.onresize = this.myChart.resize;
      let option6={ // 进行相关配置
      backgroundColor: "#778899",
      tooltip: {
        formatter: `{b0}:{c0}`
      }, // 鼠标移到图里面的浮动提示框
      visualMap: {
        calculable: true,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
      },
      series: [
        {
          type: 'map',
          map: area,
          data: this.worldData,
          nameMap:this.nameMap
        }
      ]
    }
    this.myChart.setOption(option6,true);
  },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  div{
    border: 2px solid #777;
    border-radius:30px;
    padding: 20px;
    margin: 0px 20px 10px 0px;
  }
}
.flowP{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
}
.homeBJ{
  width: 200px;
  height: 200px;
  background: url('../../assets/缺省图.svg')  no-repeat;
  position: absolute;
  top: 50px;
  left: 35px;
}
.homeBJbar{
  width: 200px;
  height: 200px;
  background: url('../../assets/缺省图.svg')  no-repeat;
  position: absolute;
  top: 35%;
  left: 40%;
}
.affiche{
  white-space: pre-wrap;
  background: #FFCFAF1C 0% 0% no-repeat padding-box;
  border: 1px solid #FFC9A7A8;
  border-radius: 10px;
  opacity: 1;
  padding: 10px;
}
.describeText{
  font-size: 14px;
}
.textColor{
  font-size: 18px;
  font-weight: 600;
  padding-top: 10px;
  img{
    width: 2vw;
    height: 3vh;
  }
}
.taskFollowam{
  margin-bottom: 20px;
}
.taskLetterm{
  margin-bottom: 20px;
}

</style>
