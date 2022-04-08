<template>
  <div>
    <a-modal v-model="dialogGroupId" :title="$t('user.portInformation')" width="600px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @cancel="cancel" @ok="cancel">
      <div class="search-box">
        <a-form layout="inline" :model="searchData" class="demo-form-inline">
          <a-form-item :label="$t('user.portID')">
            <a-input v-model="searchData.port_no" :placeholder="$t('user.portID')" allow-clear />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="init">{{this.$t('admin.Inquire')}}</a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <!-- <span slot="action" slot-scope="text, row, index ">
          <a-radio :value="index" class="radio" @change="getCurrentRow(index)" />
        </span> -->
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/index'
const columns = [{
  // title: '设备ID',
  slotName: 'user.portID',
  dataIndex: 'id',
  ellipsis: true,
  width: '100px',
  align: 'center',
  scopedSlots: { customRender: 'id', title:'user.portID' }
}, {
  // title: '设备串码',
  slotName: 'user.uniqueString',
  dataIndex: 'port_no',
  ellipsis: true,
  width: '160px',
  align: 'center',
  scopedSlots: { customRender: 'port_no', title:'user.uniqueString' }
}, {
  // title: '备注',
  slotName: 'admin.remark',
  dataIndex: 'remark',
  ellipsis: true,
  width: '220px',
  align: 'center',
  scopedSlots: { customRender: 'remark', title:'admin.remark' }
}]
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogGroupId'],
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      role: 0,
      searchData: {
        page: 1,
        page_size: 10,
        order_id: true,
        order_created_at: true
        
      },
      selectedRowKeys: [],
      selectedRowVlaue: [],
      columns: [],
      // dialogGroupId: true,
      tableData: [],
      total: 0,
      size: 10,
      radioArr: []
    }
  },
  computed: {

  },
  mounted() {
    this.searchData.page = 1
    this.role = this.userInfo.data.r
    this.selectedRowKeys = []
    this.selectedRowVlaue = []
    this.columns = []
    columns.forEach(item => {
      if (item.role != null) {
        if (!item.role.includes(this.role)) {
          return
        }
      }
      this.columns.push(item)
      
    })
    this.init()
  },
  wathch: {
    dialogGroupId(newValue, oldValue) {
      this.radioArr.forEach(item => { 
        item.value = false 
        this.selectedRowKeys = []
        this.selectedRowVlaue = []
      })
      
    }
  },
  methods: {
    init() {
      this.getTableData()
    },
    async getTableData() {
      this.selectedRowKeys = []
      this.selectedRowVlaue = []
      var getDaviceParma = {
        user_id: this.userInfo.data.i,
        page: this.searchData.page,
        page_size: this.searchData.page_size,
        order_id: true,
        order_created_at: true
      }
      const res = await api.getDevice(getDaviceParma)
      if (res && res.code === 0 && res.data) {
        let before = new Date().getTime()
        this.tableData = []
        res.data.data.forEach(item => {
          /* console.log(before)
          console.log(new Date(item.updated_at).getTime()) */
          let time = new Date(item.expire_time).getTime() - before
          if(time > 0) {
            this.tableData.push(item)
          }
        })
        // this.tableData = res.data.data
        this.radioArr = []
        this.tableData.forEach((item, index) => {
          this.radioArr.push({
            index,
            value: false
          })
        })
        this.total = res.data.count
      }
    },
    onSelectChange(selectedRowKeys, value) {
      this.selectedRowKeys = []
      this.selectedRowVlaue = []
      this.selectedRowKeys = selectedRowKeys
      this.selectedRowVlaue = value
      this.$emit('getGroupId', this.selectedRowKeys)
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    getCurrentRow(index) {
      const id = this.tableData[index].id
      // console.log(id)
      this.$emit('getGroupId', this.tableData[index].id, this.tableData[index].port_no)
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    },
    cancel() {
      this.$emit('cancelGetGroupId')
      this.radioArr.map(item => { item.value = false })
      this.selectedRowKeys = []
      this.selectedRowVlaue = []
    },
    handRowClick(row) {
      return {
        on: {
          click: (e) => {
            // console.log(row)
            this.$emit('getGroupId', row.id, row.port_no)
            this.radioArr.map(item => { item.value = false })
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>
