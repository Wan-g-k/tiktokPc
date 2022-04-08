<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <a-form-item label="支付信息">
          <a-input v-model="searchData.name" placeholder="支付信息" allow-clear />
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
  title: '名称',
  dataIndex: 'name',
  width: '100',
  align: 'center'
},
{
  title: '描述',
  dataIndex: 'desc',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '支付信息',
  dataIndex: 'info',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '支付链接',
  dataIndex: 'link',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '备注',
  dataIndex: 'remark',
  width: '100',
  ellipsis: true,
  align: 'center'
},
{
  title: '是否显示',
  dataIndex: 'is_show',
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
      }
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
      api.getAccountingReceivePaymentChannel(this.searchData).then(res => {
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
