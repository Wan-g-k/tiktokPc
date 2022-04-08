<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="套餐信息">
          <a-input v-model="searchData.name" placeholder="套餐信息" allow-clear />
        </a-form-item>
        <a-form-item :label="this.$t('admin.pleaseChoose')">
          <a-select v-model="keyValue" :placeholder="this.$t('admin.pleaseChoose')" style="width:213px" allow-clear>
            <a-select-option :value="'comboAgent'">代理商套餐</a-select-option>
            <a-select-option :value="'comboAgentUpdate'">代理商下级套餐</a-select-option>
            <a-select-option :value="'comboUser'">用户套餐</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="init()">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{ $t(item.slotName) }}</span>
        </templete>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :page-size="searchData.page_size" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '套餐名称',
  dataIndex: 'name',
  width: '100',
  align: 'center'
},
{
  title: '套餐价格',
  dataIndex: 'price',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '描述',
  dataIndex: 'describe',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '赠送积分',
  dataIndex: 'points',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '代理商购买等级',
  dataIndex: 'agent_level',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '购买等级',
  dataIndex: 'limit_level',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '是否可用',
  dataIndex: 'enable',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value === true ? '是' : '否'
  }
},
{
  title: '是否显示',
  dataIndex: 'show',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value === true ? '是' : '否'
  }
}]
const columnsUpdate = [{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '套餐名称',
  dataIndex: 'name',
  width: '100',
  align: 'center'
},
{
  title: '描述',
  dataIndex: 'describe',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '套餐价格',
  dataIndex: 'price',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '代理商购买等级',
  dataIndex: 'agent_level',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: 'XX代理商购买等级',
  dataIndex: 'target_level',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '购买等级',
  dataIndex: 'limit_level',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  }
},
{
  title: '是否可用',
  dataIndex: 'enable',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value === true ? '是' : '否'
  }
},
{
  title: '是否显示',
  dataIndex: 'show',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value === true ? '是' : '否'
  }
}]
const columnsUser = [{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '100',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '套餐名称',
  dataIndex: 'name',
  width: '100',
  align: 'center'
},
{
  title: '套餐价格',
  dataIndex: 'price',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '描述',
  dataIndex: 'describe',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '端口数量',
  dataIndex: 'port_num',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '端口时长',
  dataIndex: 'port_duration',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '赠送流量',
  dataIndex: 'flow',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '是否可用',
  dataIndex: 'enable',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value === true ? '是' : '否'
  }
},
{
  title: '是否显示',
  dataIndex: 'show',
  width: '100',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value === true ? '是' : '否'
  }
}]
import * as api from '@/api/index'
export default {
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      columns: [],
      tableData: [],
      total: 0,
      searchData: {
        name: null,
        order_created_at: true,
        page: 1,
        page_size: 10
      },
      keyValue: 'comboAgent'
    }
  },
  mounted() {
    this.columns = []
    columns.forEach(item => {
      this.columns.push(item)
    })
    this.getTableData()
  },
  methods: {
    init() {
      this.searchData.page = 1
      this.searchData.page_size = 10
      this.getTableData()
    },
    getTableData() {
      this.searchData.name = this.searchData.name !== '' ? this.searchData.name : null
      if (this.keyValue === 'comboAgent') {
        this.comboAgent()
      } else if (this.keyValue === 'comboAgentUpdate') {
        this.columns = []
        columnsUpdate.forEach(item => {
          this.columns.push(item)
        })
        this.comboAgentUpdate()
      } else if (this.keyValue === 'comboUser') {
        this.columns = []
        columnsUser.forEach(item => {
          this.columns.push(item)
        })
        this.comboUser()
      }
    },
    comboAgent() {
      api.getAccountingComboAgent(this.searchData).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.total = res.data.count
        }
      })
    },
    comboAgentUpdate() {
      api.getAccountingComboAgentUpdate(this.searchData).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.total = res.data.count
        }
      })
    },
    comboUser() {
      api.getAccountingComboUser(this.searchData).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.data
          this.total = res.data.count
        }
      })
    },
    handleCurrentChange() {

    },
    handleSizeChange() {}
  }
}
</script>

<style lang="scss">
.affiche{
  white-space: pre-wrap;
  background: #FFCFAF1C 0% 0% no-repeat padding-box;
  border: 1px solid #FFC9A7A8;
  border-radius: 10px;
  opacity: 1;
  padding: 10px;
}
</style>
