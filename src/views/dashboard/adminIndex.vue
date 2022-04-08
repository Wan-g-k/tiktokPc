<template>
  <div>
    <a-row :gutter="20">
      <a-col :span="16" >
        <div style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px;">
          <div class="textColor">
            <img src="../../assets/IntegralIcon.svg">{{$t('admin.Integralrecord')}}
          </div>
          <div ref="integralRecord" class="integralRecord" style="height: 50vh;  margin: 0px 0px 20px 0px;"></div>
        </div>
      </a-col>
      <a-col :span="8" >
        <div style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px;  height: 27vh; margin: 0px 0px 10px 0px;">
          <div class="textColor">
            <img src="../../assets/userIcon.svg">{{$t('admin.userRecord')}}
          </div>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.accountsNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#4BA794'" :stroke-width="10" :percent="100" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.account_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.usersNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#FFA86D'" :stroke-width="10" :percent="50" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.user_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.agentsNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#3598F1'" :stroke-width="10" :percent="30" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.agent_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.suppliersNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#F86400'" :stroke-width="10" :percent="20" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.dealer_count}}</a-col>
          </a-row>
        </div>
        <div style="box-shadow: 0px 3px 10px #00000029; border-radius: 15px;  height: 27vh; margin: 0px 0px 13px 0px;">
          <div class="textColor">
            <img src="../../assets/addUserIcon.svg">{{$t('admin.AddUsersToday')}}
          </div>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.accountsNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#4BA794'" :stroke-width="10" :percent="100" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.account_new_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.usersNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#FFA86D'" :stroke-width="10" :percent="50" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.user_new_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.agentsNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#3598F1'" :stroke-width="10" :percent="30" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.agent_new_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.suppliersNumber')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#F86400'" :stroke-width="10" :percent="20" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.user_record.dealer_new_count}}</a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="20">
      <a-col :span="8" >
        <div style="box-shadow: 0px 3px 10px #00000029; height: 29vh; border-radius: 15px; ">
          <a-col :span="12">
            <div>
              <div class="portColor">
                <img src="../../assets/portIcon.svg">{{$t('admin.portRecord')}}
              </div>
              <div ref="portCount" class="portCount" style="width: 100%; height: 20vh;"></div>
              <div class="portTexeColor">{{$t('admin.portNumber')}}:{{this.port_record.port_count}}</div>
            </div>
          </a-col>
          <a-col :span="12">
            <div>
              <div class="portColor">
                <img src="../../assets/addPortIcon.svg">{{$t('admin.addedToday')}}
              </div>
              <div ref="todayNewPortCount" class="todayNewPortCount" style="width: 100%; height: 20vh;"></div>
              <div class="portTodayColor">{{$t('admin.addedNumber')}}:{{this.port_record.today_new_port_count}}</div>
            </div>
          </a-col>
        </div>
      </a-col>
      <a-col :span="6" >
        <div style="box-shadow: 0px 3px 10px #00000029; height: 29vh; border-radius: 15px;">
          <div class="textColor">
            <img src="../../assets/auditIcon.svg">{{$t('admin.resourceReview')}}
          </div>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.totalResources')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#4BA794'" :stroke-width="10" :percent="100" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.resource_audit.resource_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.pendingReview')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#FFA86D'" :stroke-width="10" :percent="parseInt(this.resource_audit.now_audit_resource_count/this.resource_audit.resource_count*100)" :format="() => ''"/></a-col>
            <a-col :span="3" >{{this.resource_audit.now_audit_resource_count}}</a-col>
          </a-row>
          <a-row class="adText">
            <a-col :span="5" >{{$t('admin.audited')}}</a-col>
            <a-col :span="16"><a-progress :stroke-color="'#3598F1'" :stroke-width="10" :percent="parseInt(this.resource_audit.audit_resource_count/this.resource_audit.resource_count*100)" :format="() => ''"/></a-col>
            <a-col :span="3">{{this.resource_audit.audit_resource_count}}</a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="10">
        <div style="box-shadow: 0px 3px 10px #00000029; height: 14vh; border-radius: 10px; margin: 0px 0px 10px 0px;">
          <div class="textColor"><img src="../../assets/trafficIcon.svg">{{$t('admin.flowInformation')}}</div>
          <div class="usedFlowColor">
            <div>{{$t('admin.trafficUsage')}}</div>
            <p>{{this.flow_shop.used_flow}}M</p>
          </div>
          <!-- <a-row>
            <a-col :span="12">
              <p>流量使用</p>
            </a-col>
            <a-col :span="12">
              <p>{{this.flow_shop.used_flow}}M</p>
            </a-col>
          </a-row> -->
        </div>
        <div style="box-shadow: 0px 3px 10px #00000029; height: 14vh; border-radius: 10px; margin: 0px 0px 10px 0px;">
          <div class="textColor">
            <img src="../../assets/putawayIcon.svg">{{$t('admin.commodity')}}
          </div>
          <div class="shopsCountColor">
            <div>{{$t('admin.commoditysNumber')}}</div>
            <p>{{this.flow_shop.shops_count}}</p>
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
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import statementDuty from '../../components/statement/index.vue'
import world from '../../mapData/world.json'
import * as api from '@/api/index'
export default {
  name: "Dashboard",
  data() {
    return {
      value: "world",
      afficheVisible: false,
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      affiche: null,
      title: null,
      dateTemp: '',
      user_id: null,
      dateList: [],
      flow_shop: {},
      points: {},
      port_record: {},
      resource_audit: {},
      user_record: {}
    }
  },
  components: {
    PanelGroup,
    statementDuty
  },
  mounted() {
    this.getPublish()
    this.newDate()
  },
  methods: {
    getPublish() {
      api.getPublish().then(res => {
        if(res.code === 0 && res.data.data.length > 0) {
          this.affiche = res.data.data[0].content
          this.title = res.data.data[0].title
          this.afficheVisible = JSON.parse(window.sessionStorage.getItem('visible'))
        }
      })
    },
    newDate() {
      let myDate = new Date()
      this.dateTemp = ''
      this.user_id = this.userInfo.data.i
      let getFullYear = myDate.getFullYear()
      let getMonth = myDate.getMonth()+1
      let getDate = myDate.getDate()
      if(getMonth < 10) {
        getMonth = '0'+getMonth
      }
      if(getDate < 10) {
        getDate = '0'+getDate
      }
      this.dateTemp = getFullYear+'-'+getMonth+'-'+getDate
      if(this.dateTemp) {
        let form = {}
        form.date = this.dateTemp
        // form.user_id = this.user_id
        api.getAdminAdminHomePage(form).then(res => {
          if(res.code === 0) {
            this.dateList = res.data.date
            this.flow_shop = res.data.flow_shop
            this.points = res.data.points
            this.port_record = res.data.port_record
            this.resource_audit = res.data.resource_audit
            this.user_record = res.data.user_record
            this.getEchartData()
          }
        }).catch(err => {
          console.log(err)
        })
      }
      console.log(this.dateTemp)
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
      const integralRecord = this.$refs.integralRecord
      const portCount = this.$refs.portCount
      const todayNewPortCount = this.$refs.todayNewPortCount
      
      if(integralRecord) {
        let myIntegralRecord= this.$echarts.init(integralRecord)
        let option = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.dateList
          },
          yAxis: {
            type: 'value'
          },
          grid: {
            x: 50,
            y: 60,
            x2: 30,
            y2: 50
          },
          legend: {
            data: [this.$t('admin.AgentRecharge'), this.$t('admin.supplierRecharge')]
          },
          series: [
            {
              name: this.$t('admin.AgentRecharge'),
              data: this.points.agentPoints,
              type: 'line',
              symbolSize: 8,
              itemStyle: {
                color:'rgba(141,204,229)',
              },
              lineStyle: {
                color:'rgba(141,204,229)',
                width: 3,
              },
              areaStyle: {
                color:'rgba(141,204,229, .5)',
              }
            },
            {
              name: this.$t('admin.supplierRecharge'),
              data: this.points.dealerPoints,
              type: 'line',
              symbolSize: 8,
              itemStyle: {
                color:'rgba(237,147,83)',
              },
              lineStyle: {
                normal: {
                  color:'rgba(237,147,83)',
                  width: 3,
                }
              },
              areaStyle: {
                normal:{
                  color:'rgba(237,147,83, .5)',
                }
              }
            }
          ]
        }
        myIntegralRecord.setOption(option);
        window.addEventListener("resize", function () {
          myIntegralRecord.resize()
        });
      }
      if(portCount) {
        let myPortCount= this.$echarts.init(portCount);
        let option = {
          tooltip: {
            show: true
          },
          title: {
            text: this.port_record.port_count,
            top: "45%",
            left: 'center',
            textStyle: {
              color: '#3598F1',
              fontSize: '16px'
            }
          },
          legend: {
            orient: 'horizontal',
            top: 'top',
            icon: 'circle',
          },
          series: [
            {
              type: "pie",
              radius: ["55%", "70%"],
              center: ["50%", "50%"],
              hoverAnimation: true,
              z: 1,
              itemStyle: {
                normal: {
                  color: '#3598F1',
                }
              },
              label: {
                show: false
              },
              data: [
                { value: this.port_record.port_count}
              ],
              labelLine: {
                show: false
              }
            }
          ]
        }
        myPortCount.setOption(option);
        window.addEventListener("resize", function () {
          myPortCount.resize()
        });

      }
      if(todayNewPortCount) {
        let myTodayNewPortCount= this.$echarts.init(todayNewPortCount);
        let option = {
          tooltip: {
            show: true
          },
          title: {
            text: this.port_record.today_new_port_count,
            top: "45%",
            left: 'center',
            textStyle: {
              color: '#FFA86D',
              fontSize: '16px'
            }
          },
          legend: {
            orient: 'horizontal',
            top: 'top',
            icon: 'circle',
          },
          series: [
            {
              type: "pie",
              radius: ["55%", "70%"],
              center: ["50%", "50%"],
              hoverAnimation: true,
              z: 1,
              itemStyle: {
                normal: {
                  color: '#F86400',
                }
              },
              label: {
                show: false
              },
              data: [
                { value: this.port_record.today_new_port_count === 0 ? 10 : this.port_record.today_new_port_count}
              ],
              labelLine: {
                show: false
              }
            }
          ]
        }
        myTodayNewPortCount.setOption(option);
        window.addEventListener("resize", function () {
          myTodayNewPortCount.resize()
        });

      }
      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function () {
         myTraffic.resize()
        });
      });
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
.affiche{
  white-space: pre-wrap;
  background: #FFCFAF1C 0% 0% no-repeat padding-box;
  border: 1px solid #FFC9A7A8;
  border-radius: 10px;
  opacity: 1;
  padding: 10px;
}
.describeText{
  font-size: .6vw;
}
.textColor{
  font-size: 20px;
  font-weight: 600;
  margin-left: 20px;
  padding-top: 25px;
  img{
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }
}
.usedFlowColor{
  font-size: 22px;
  display: flex;
  justify-content: center;
  font-weight: 600;
  p{
    font-size: 22px;
    margin-left: 70px;
    color: #FFA86D;
  }
}
.shopsCountColor{
  font-size: 22px;
  display: flex;
  justify-content: center;
  font-weight: 600;
  p{
    font-size: 22px;
    margin-left: 70px;
    color: #3598F1;
  }
}
.portColor{
  font-size: 20px;
  font-weight: 600;
  margin-left: 60px;
  padding-top: 20px;
  img{
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
}
.portTexeColor{
  color: #3598F1;
  font-size: 20px;
  font-weight: 600;
  margin-left: 70px;
}
.portTodayColor{
  color: #F86400;
  font-size: 20px;
  font-weight: 600;
  margin-left: 70px;
}
.adText{
  font-size: 14px;
  margin-top: 10px;
  margin-left: 10px;
}

</style>
