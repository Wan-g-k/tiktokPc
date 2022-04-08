<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <!-- <a-form-item label="账号UID">
          <a-input v-model="searchData.unique_id" placeholder="账号UID" allow-clear />
        </a-form-item> -->
        <a-form-item :label="$t('dealer.userNickname')">
          <a-input v-model="searchData.nickname" :placeholder="$t('dealer.userNickname')" allow-clear />
        </a-form-item>
        <a-form-item label="ID">
          <a-input v-model="searchData.id" placeholder="ID" allow-clear />
        </a-form-item>
        <a-form-item :label="$t('admin.state')">
          <a-select v-model="searchData.status" style="width:213px" allow-clear>
            <a-select-option :value="''">{{ $t('admin.normal') }}</a-select-option>
            <a-select-option :value="'被封禁'">{{ $t('user.banned') }}</a-select-option>
            <a-select-option :value="'Token失效'">{{ $t('user.TokenInvalid') }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-left: 10px;" @click="init()">{{ this.$t('admin.Inquire') }}</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="add">{{ $t('user.bindingPort') }}</a-button>
          <a-button v-if="role == 1" type="primary" style="margin-left: 10px" @click="assign">{{ $t('dealer.assignAccount') }}</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="changeNickname">{{ $t('user.changeUsername') }}</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="changeSignature">{{ $t('user.modifySignature') }}</a-button>
          <!-- <a-button type="primary" style="margin-left: 10px" @click="changeImg">修改头像</a-button> -->
          <a-button type="primary" style="margin-left: 10px" @click="changeHeadImg">修改头像</a-button>

          <!-- <a-popconfirm :title="$t('admin.deleteOrNot')" :ok-text="$t('admin.Yes')" :cancel-text="$t('admin.No')" @confirm="deleteVisible">
            <a-button v-if="form.account_list.length != 0" type="danger" style="margin-left: 10px">{{ $t('dealer.batchDeletion') }}</a-button>
          </a-popconfirm> -->
          <a-button v-if="form.account_list.length != 0" type="danger" style="margin-left: 10px" @click="deleteVisible">{{ $t('dealer.batchDeletion') }}</a-button>

          <!-- <a-button type="primary" style="margin-left: 10px" @click="checkAccount()">查看封禁账号</a-button> -->
          <!-- 新增 绑定IP设备 取消 -->
          <!-- <a-button type="primary" style="margin-left: 10px">绑定IP设备</a-button> -->
          <!-- <a-button v-if="isBundle_id" type="primary" style="margin-left: 10px;" @click="dialogAccount = true">新增账号</a-button> -->

          <!-- <a-button v-if="role == 1" type="primary" style="margin-left: 10px;width:88px" @click="create('Collection')">采集</a-button> -->
          <!-- <a-button v-if="role == 1" type="primary" style="margin-left: 10px" @click="exportAccount">导出</a-button> -->
          <!-- <a-button type="primary" style="margin-left: 10px;width:88px" @click="exportAccount">
            导出
          </a-button> -->
          <!-- <a-modal
            title="下载链接"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <p>{{ ModalText }}</p>
          </a-modal> -->

          <!-- <a-button type="primary" @click="create('Comment')">评论</a-button> -->
        </a-form-item>
        <!-- <a-form-item>
          <a-button type="primary" style="margin-left: 10px" @click="add">{{$t('user.bindingPort')}}</a-button>
        </a-form-item>
        <a-form-item>
          <a-button v-if="role == 1" type="primary" style="margin-left: 10px" @click="assign">{{$t('dealer.assignAccount')}}</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-left: 10px" @click="changeNickname">{{$t('user.changeUsername')}}</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" style="margin-left: 10px" @click="changeSignature">{{$t('user.modifySignature')}}</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="danger" style="margin-left: 10px" v-if="form.account_list.length != 0" @click="deleteVisible">{{$t('dealer.batchDeletion')}}</a-button>
        </a-form-item> -->
      </a-form>
      <span v-if="form.account_list.length != 0">{{ $t('dealer.accountSelected') }}:{{ form.account_list.length }}</span>
    </div>

    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :loading="tableLoading" :row-key="record => record.id" :scroll="{ x: 1200}" class="tableLimit" :row-selection="{selectedRowKeys: form.account_list ,onChange: rowSelection}" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{ $t(item.slotName) }}</span>
        </templete>
        <span slot="avatar" slot-scope="text, row ">
          <a-badge v-if="row.id == bundle_id" color="#87d068">
            <a-avatar :src="row.avatar" />
          </a-badge>
          <a-avatar v-else :src="row.avatar" />
          <p>{{ row.nickname }}</p>
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="port_id" slot-scope="text, row">
          {{ row.port_no }}
        </span>
        <span slot="status" slot-scope="text, row ">
          {{ row.status == '' ? '正常' : row.status }}
        </span>
        <span slot="device_remarks">
          {{ deviceInfo.remarks }}
        </span>
        <!-- <span slot="remarks" slot-scope="text, row">
          <a-input v-model="row.remarks" size="small" @blur="handleInputBlur(row)" />
        </span> -->
        <span slot="action" slot-scope="text, row">
          <!-- <el-button v-if="isBundle_id" :disabled="scope.row.id == device_id" size="small" type="success" plain @click="handCheck(scope.row)">{{ scope.row.id == device_id ? '当前账号' : '切换账号' }}</el-button>
          <el-button size="small" type="primary" plain @click="handPut(scope.row.id)">重置次数</el-button>
          <el-button size="small" type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button> -->
          <a-button style="margin-left: 10px; margin-top: 5px" type="primary" @click="UserTaskDetail(row.id)">任务详情</a-button>
          <a-button v-if="role == 0 || role == 1" style="margin-left: 10px; margin-top: 5px" type="primary" @click="privateMessage(row.id)">{{ $t('user.privateMessageTask') }}</a-button>
          <a-button v-if="role == 0 || role == 1" style="margin-left: 10px; margin-top: 5px" type="primary" @click="attention(row.id)">{{ $t('user.ConcernTask') }}</a-button>
          <a-button style="margin-left: 10px; margin-top: 5px" type="primary" @click="tokenPage(row.id)">{{ $t('user.viewToken') }}</a-button>

          <!-- <a-button v-if="isBundle_id" :disabled="row.id == bundle_id" @click="handCheck(row)">{{ row.id == bundle_id ? '当前账号' : '切换账号' }}</a-button> -->
          <!-- <a-button style="margin-left: 8px" type="primary" @click="handPut(row.id)">重置次数</a-button> -->
          <!-- 新增修改资料页面   修改资料页面 绑定IP设备 -->
          <!-- <a-button v-if="role == 0 || role == 1" style="margin-left: 10px" @click="openRunInfo(row.id)">修改资料</a-button> -->

          <a-popconfirm :title="$t('admin.deleteOrNot')" :ok-text="$t('admin.Yes')" :cancel-text="$t('admin.No')" @confirm="handleDelete(row.id)">
            <a-button style="margin-left: 10px; margin-top: 5px" type="danger">{{ $t('admin.delete') }}</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" :title="$t('dealer.assignAccount')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="handleAdd">
        <a-form ref="form" :model="form" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item :label="$t('user.portID')">
            <!-- <a-input v-model="form.group_id" @click="dialogGroupId = true" /> -->
            <a-input v-model="form.group_id" read-only @click="dialogPortVisible" />
          </a-form-item>
        </a-form>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="dialogVisible = false">{{ this.$t('admin.cancel') }}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="dialogLoading" @click="handleAdd">{{ this.$t('admin.confirm') }}</a-button>
        </span>
      </a-modal>
      <!-- 查看账号token -->
      <a-modal v-if="tokenVisible" v-model="tokenVisible" :title="$t('user.accountToken')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="tokenVisible = false">
        <div style="height:450px; overflow-y:auto;">
          {{ tokenVal }}
        </div>
      </a-modal>
      <!-- 修改头像 -->
      <a-modal v-model="accountImgVisible" title="修改头像" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="uploadImgphone">
        <a-upload :multiple="true" :file-list="fileList" list-type="picture-card" :remove="handleRemove" :before-upload="beforeUpload">
          <div v-if="fileList.length < 21">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
        <p>*图片上传格式需为：image/jpeg，image/jpg，image/png，image/pneg。图片大小：20KB,单次上传不可超过20张</p>
      </a-modal>
      <!-- 修改昵称 -->
      <a-modal v-model="nicknameDialogAccount" :title="$t('user.changeUsername')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="changeAccountNickname">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item :label="$t('dealer.userNickname')">
            <a-button class="add-btn" type="success" plain @click="Nickname">{{ $t('user.selectResource') }}</a-button><br>
            <a-tag v-for="(item, index) in selectedNicknameValue" :key="index" v-model="selectedNicknameValue" color="#2db7f5" closable @close="tagNickname">{{ $t('dealer.userNickname') }}：{{ item.name }}</a-tag>
            <!-- <a-textarea v-model="changeAccountForm.account_nickname" :rows="4"/> -->
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model="signatureDialogAccount" :title="$t('user.modifySignature')" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="changeAccountSignature">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <!-- <a-form-item label="个签">
            <a-textarea v-model="changeAccountForm.account_signale" :rows="4"/>
          </a-form-item> -->

          <a-form-item :label="$t('admin.resourceContent')">
            <a-button class="add-btn" type="success" plain @click="resourcesText">{{ $t('user.selectResource') }}</a-button><br>
            <a-tag v-for="(item, index) in selectedRowKeysValue" :key="index" v-model="selectedRowKeysValue" color="#2db7f5" closable @close="tagID">{{ $t('admin.signature') }}：{{ item.name }}</a-tag>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model="headImgDialogAccount" title="修改头像" width="500px" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @ok="changeAccountHeadImg">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="头像">
            <!-- <a-textarea v-model="changeAccountForm.account_headimg" :rows="4"/> -->
            <a-button class="add-btn" type="success" plain @click="Headimg">{{ $t('user.selectResource') }}</a-button><br>
            <a-tag v-for="(item, index) in selectedHeadimgValue" :key="index" v-model="selectedHeadimgValue" color="#2db7f5" closable @close="tagNickname">头像：{{ item.name }}</a-tag>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model="resourcesTextVisible" :title="$t('admin.signature')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitResourcesText">
        <a-table :columns="columnsResource" :data-source="ResourceData" :row-key="record => record.id" :row-selection="{onChange:onSelectChange,selectedRowKeys: selectedRowKeysId,type: 'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsResource" :key="index" :slot="item.slotName">
            <span>{{ $t(item.slotName) }}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${ResourceTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="ResourcePage" :total="ResourceTotal" @change="handleASign" @showSizeChange="handleSizeASign">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>

      <a-modal v-model="nicknameVisible" :title="$t('dealer.userNickname')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitNickname">
        <a-table :columns="columnsResource" :data-source="ResourceData" :row-key="record => record.id" :row-selection="{onChange:onSelectChangeNickname,selectedRowKeys: selectedNicknameId,type: 'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsResource" :key="index" :slot="item.slotName">
            <span>{{ $t(item.slotName) }}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${NicknameTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="NicknamePage" :total="NicknameTotal" @change="handleNickname" @showSizeChange="handleSizeNickname">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>

      <a-modal v-model="headimgVisible" title="选择头像资源" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitHeadimg">
        <a-table :columns="columnsResource" :data-source="ResourceData" :row-key="record => record.id" :row-selection="{onChange:onSelectChangeHeadimg,selectedRowKeys: selectedHeadimgId,type: 'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsResource" :key="index" :slot="item.slotName">
            <span>{{ $t(item.slotName) }}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${HeadimgTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="HeadimgPage" :total="HeadimgTotal" @change="handleHeadimg" @showSizeChange="handleSizeHeadimg">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>

      <a-modal v-model="batchDeleteVisible" :title="this.$t('dealer.batchDeletion')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitBatchDelete">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item :label="$t('user.accountID')">
            <a-textarea v-model="changeAccountForm.delete_nickname" :rows="4" />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" /> -->
      <user v-if="dialogUserId" @getGroupId="assignNewUser" @cancelGetGroupId="dialogUserId = false" />
      <port v-if="dialogPortId" :dialog-port-id="dialogPortId" @getPortId="getPortId" @cancelGetPortId="dialogPortId = false" />

      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <!-- // 任务详情 -->
      <div>
        <a-modal v-if="taskDetailsVisible" v-model="taskDetailsVisible" title="任务详情" width="60%" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @cancel="cancelTaskDetails" @ok="cancelTaskDetails">
          <a-table :columns="columnsTaskDetails" :data-source="taskDetailsData" :row-key="record => record.id" class="tableLimit" :pagination="false">
            <span slot="created_at" slot-scope="text, row">
              {{ new Date(row.created_at) | getTime }}
            </span>
          </a-table>
          <div class="page">
            <a-pagination :show-total="(taskDetailsTotal, range) => `${$t('admin.total')}:${taskDetailsTotal} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="taskDetailsPage" :total="taskDetailsTotal" @change="taskDetailsCurrentChange" @showSizeChange="taskDetailshandleSizeChange">
              <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }}条/页</span>
              </template>
            </a-pagination>
          </div>
        </a-modal>
      </div>

      <!-- // 私信运行记录 -->
      <div>
        <a-modal v-if="runInfoGroupId" v-model="runInfoGroupId" :title="$t('user.privateMessageTask')" width="60%" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @cancel="cancelPrivateLetter" @ok="cancelPrivateLetter">
          <a-table :columns="runInfocolumns" :data-source="runInfoData" :row-key="record => record.id" class="tableLimit" :pagination="false">
            <templete v-for="(item, index) in runInfocolumns" :key="index" :slot="item.slotName">
              <span>{{ $t(item.slotName) }}</span>
            </templete>
            <span slot="created_at" slot-scope="text, row">
              {{ new Date(row.created_at) | getTime }}
            </span>
          </a-table>
          <div class="page">
            <a-pagination :show-total="(runInfoTotal, range) => `${$t('admin.total')}:${runInfoTotal} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="runInfoCurrentPage" :total="runInfoTotal" @change="runInfoCurrentChange" @showSizeChange="runInfohandleSizeChange">
              <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }}条/页</span>
              </template>
            </a-pagination>
          </div>
        </a-modal>
      </div>
      <!-- // 关注运行记录 -->
      <div>
        <a-modal v-if="followRunInfoGroupId" v-model="followRunInfoGroupId" :title="$t('user.ConcernTask')" width="60%" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" @cancel="cancelFollow" @ok="cancelFollow">
          <a-table :columns="runInfocolumns" :data-source="runInfoData" :row-key="record => record.id" class="tableLimit" :pagination="false">
            <templete v-for="(item, index) in runInfocolumns" :key="index" :slot="item.slotName">
              <span>{{ $t(item.slotName) }}</span>
            </templete>
            <span slot="created_at" slot-scope="text, row">
              {{ new Date(row.created_at) | getTime }}
            </span>
          </a-table>
          <div class="page">
            <a-pagination :show-total="(followTotal, range) => `${$t('admin.total')}:${followTotal} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="followCurrentPage" :total="followTotal" @change="followCurrentChange" @showSizeChange="followHandleSizeChange">
              <template slot="buildOptionText" slot-scope="props">
                <span>{{ props.value }}条/页</span>
              </template>
            </a-pagination>
          </div>
        </a-modal>
      </div>

    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'
import group from '@/components/group/index'
import user from '@/components/user/user'
import { message } from 'ant-design-vue'
import port from './components/port.vue'
import jsCookie from 'js-cookie'
import stringify from 'qs/lib/stringify'

const runInfocolumns = [{
  // title: '任务类型',
  slotName: 'user.taskType',
  dataIndex: 'type',
  width: '60px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'type', title: 'user.taskType' }
}, {
  // title: '昵称',
  slotName: 'dealer.userNickname',
  dataIndex: 'nickname',
  width: '60px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'nickname', title: 'dealer.userNickname' }
}, {
  // title: '目标用户',
  slotName: 'user.targetUsers',
  dataIndex: 'unique_id',
  width: '60px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'unique_id', title: 'user.targetUsers' }
}, {
  // title: '地区',
  slotName: 'user.area',
  dataIndex: 'region',
  width: '60px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'region', title: 'user.area' }
}, {
  // title: '状态',
  slotName: 'admin.state',
  dataIndex: 'status',
  width: '60px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'status', title: 'admin.state' }
}, {
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '60px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
}]

const columns = [{
  // title: '头像',
  slotName: 'dealer.account',
  dataIndex: 'avatar',
  align: 'center',
  width: '100px',
  scopedSlots: { customRender: 'avatar', title: 'dealer.account' }
},
{
  // title: '个签',
  slotName: 'admin.signature',
  dataIndex: 'signature',
  width: '100px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'signature', title: 'admin.signature' }
},
{
  // title: '帖子数量',
  slotName: 'dealer.numberOfPosts',
  dataIndex: 'posts_number',
  width: '150px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'posts_number', title: 'dealer.numberOfPosts' }
},
{
  // title: '关注人数',
  slotName: 'dealer.followers',
  dataIndex: 'follow_number',
  width: '150px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'follow_number', title: 'dealer.followers' }
},
{
  // title: '好友数量',
  slotName: 'dealer.numberOfFriends',
  dataIndex: 'friends_number',
  width: '150px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'friends_number', title: 'dealer.numberOfFriends' }
},
{
  // title: '状态',
  slotName: 'admin.state',
  dataIndex: 'status',
  width: '150px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'status', title: 'admin.state' }
},
{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '100',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
},
{
  // title: '操作',
  slotName: 'admin.operate',
  dataIndex: 'action',
  align: 'center',
  fixed: 'right',
  width: '600px',
  scopedSlots: { customRender: 'action', title: 'admin.operate' }
}]
const columnsResource = [{
  // title: '资源名称',
  slotName: 'admin.resource',
  dataIndex: 'name',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'name', title: 'admin.resource' }
},
/* {
  title: '资源内容',
  dataIndex: 'data',
  width: '80px',
  align: 'center',
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  },
  scopedSlots: { customRender: 'data' }
}, */
{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
}
]
const columnsTaskDetails = [{
  title: '创建时间',
  // slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '任务ID',
  // slotName: 'admin.resource',
  dataIndex: 'task_id',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'task_id' }
},
{
  title: '总计',
  dataIndex: 'total_num',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'total_num' }
},
{
  title: '成功数量',
  dataIndex: 'success_num',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'success_num' }
}
]
export default {
  components: {
    // group,
    user,
    port
  },
  data() {
    return {
      phonelist: [],
      imglist: [],
      fileList: [],
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        nickname: null,
        _like_r_nickname: '',
        status: '',
        page: 1,
        page_size: 10,
        order_created_at: true,
        port_id: null,
        user_id: null,
        is_bind: null,
        id: ''
      },
      runInfocolumns,
      tableData: [],
      runInfoData: [],
      columns: [],
      columnsResource: [],
      columnsTaskDetails: columnsTaskDetails,
      taskDetailsVisible: false,
      taskDetailsData: [],
      taskDetailsTotal: 0,
      taskDetailsSize: 10,
      taskDetailsPage: 1,
      ResourceData: [],
      groupTableData: [],
      selectDataId: [],
      selectedRowKeysId: [],
      selectedRowKeysValue: [],
      selectedNicknameValue: [],
      selectedNicknameId: [],
      selectedHeadimgValue: [],
      selectedHeadimgId: [],
      total: 0,
      runInfoTotal: 0,
      size: 10,
      runInfohandleSize: 10,
      runInfoCurrentPage: 1,
      followTotal: 0,
      followhandleSize: 10,
      followCurrentPage: 1,
      currentAccountId: '',
      dialogVisible: false,
      dialogLoading: false, // 绑定到端口 确定按钮
      batchDeleteVisible: false,
      nicknameDialogAccount: false,
      signatureDialogAccount: false,
      headImgDialogAccount: false,
      resourcesTextVisible: false,
      nicknameVisible: false,
      headimgVisible: false,
      dialogGroupId: false,
      dialogPortId: false,
      runInfoGroupId: false, // 私信任务信息
      followRunInfoGroupId: false, // 关注任务信息
      dialogAccount: false,
      dialogUserId: false,
      tokenVisible: false, // 账号token
      tableLoading: false,
      accountImgVisible: false,
      tokenVal: '',
      ResourceTotal: 0,
      ResourcePage: 1,
      ResourceASize: 10,
      NicknameTotal: 0,
      NicknamePage: 1,
      NicknameASize: 10,
      HeadimgTotal: 0,
      HeadimgPage: 1,
      HeadimgASize: 10,
      form: {
        account_list: [],
        group_id: ''
      },
      modifyForm: {
        account_list: [],
        group_id: ''
      },
      accountForm: {
        account_username: '',
        account_password: ''
      },
      changeAccountForm: {
        account_nickname: '',
        account_signale: '',
        account_headimg: '',
        delete_nickname: '',
        delete_ids: []
      },
      role: null,
      isBundle_id: false,
      deviceInfo: {},
      device_id: null,
      isDeviceId: null,
      bundle_id: null,
      port_id: null,
      ModalText: '',
      visible: false,
      confirmLoading: false
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.init()
  },
  methods: {
    async init() {
      this.searchData.group_id = this.$route.query.group_id || null
      this.searchData.port_id = this.$route.query.device_id || 0
      this.searchData.user_id = this.$route.query.bundle_id || null

      this.form.account_list = []
      this.selectedRowKeysId = []
      this.selectedNicknameId = []
      this.selectedHeadimgId = []
      this.selectedNicknameValue = []
      this.selectedRowKeysValue = []
      this.selectedHeadimgValue = []
      // this.searchData.port_id = this.$router.query.device_id || null
      /* if (this.searchData.port_id === null) {
        this.searchData.port_id = 0
        this.searchData.user_id = 0
      } */

      // 判断角色
      if (this.role === 0) {
        this.searchData.user_id = this.userInfo.data.i
      }

      if (this.searchData.device_id != null) {
        this.isDeviceId = true
      }

      // 判断状态
      if (this.searchData.is_bind != null) {
        this.searchData.port_id = null
        this.searchData.user_id = null
        // 全部
        if (this.searchData.is_bind == 2) {
          this.searchData.is_bind = null
        }
      }

      this.searchData.page = 1
      this.columns = []
      columns.forEach(item => {
        if (item.role != null && !item.role.includes(this.role)) {
          return
        }
        if (item.isDeviceId != null && !this.isDeviceId) {
          return
        }
        this.columns.push(item)
      })
      this.columnsResource = columnsResource
      this.searchData.id = this.searchData.id || null
      this.searchData.nickname = this.searchData.nickname || null
      this.getTableData()
    },
    rowSelection(selectedRowKeys, values) {
      // 批量端口续费 获取ID
      // console.log(selectedRowKeys)
      this.form.account_list = []
      selectedRowKeys.forEach(item => {
        this.form.account_list.push(item)
      })
    },
    async getTableData() {
      const name = ''
      const remarks = ''
      this.tableLoading = true
      if (this.searchData.group_id != null || this.searchData.device_id != null || this.searchData.unique_id != null || this.searchData.bundle_id != null || this.searchData.user_id != null) {
        if (this.searchData.device_id) {
          const deviceRes = await api.getDevice({ id: this.searchData.device_id })
          this.deviceInfo = deviceRes.data.data[0]
        }

        const res = await api.getAcount(this.searchData)
        if (res && res.code === 0 && res.data) {
          res.data.data.map(item => { item.device_name = name })
          res.data.data.map(item => { item.device_remarks = remarks })
          this.tableLoading = false
          this.tableData = res.data.data
          this.total = res.data.count
        }
      } else {
        if (this.role === 1) {
          const res = await api.getAcountAll(this.searchData)
          if (res && res.code === 0 && res.data) {
            this.tableLoading = false
            this.tableData = res.data.data
            this.tableData = res.data.data
            this.total = res.data.count
          }
        } else {
          this.searchData.user_id = this.userInfo.data.i
          const res = await api.getAcountAll(this.searchData)
          if (res && res.code === 0 && res.data) {
            this.tableLoading = false
            this.tableData = res.data.data
            this.tableData = res.data.data
            this.total = res.data.count
          }
        }
      }
    },
    // 查看Token
    tokenPage(id) {
      const form = {}
      form.id = id
      api.getUseToken(form).then(res => {
        if (res.code === 0) {
          this.tokenVal = res.data.token
          this.tokenVisible = true
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    add() {
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.dialogVisible = true
      this.form.group_id = ''
    },
    dialogPortVisible() {
      this.dialogPortId = true
    },
    getPortId(id) {
      if (id === undefined) {
        this.form.group_id = ''
      } else {
        this.form.group_id = id
      }
    },
    changeNickname() {
      // 修改昵称
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.nicknameDialogAccount = true
    },
    changeSignature() {
      // 修改个签
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.changeAccountForm.account_signale = ''
      this.signatureDialogAccount = true
    },
    // 上传头像
    changeImg() {
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.accountImgVisible = true
    },
    handleRemove(file) {
      console.log(file)
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/JPEG' || file.type === 'image/pneg' || file.type === 'image/png' || file.type === 'image/jpeg') {
        if (file.size / 1000 < 20) {
          this.imglist.push(file)
          if (this.imglist.length < 21) {
            this.getBase64(file, (imageUrl) => {
              const file2 = file
              file2.url = imageUrl
              this.fileList = [...this.fileList, file]
            })
          } else {
            this.$message.warning('单次上图片不可超过20张！')
            // console.log(2222)
          }
        } else {
          this.$message.error('图片大小须小于20KB')
        }
      } else {
        this.$message.error('请上传jpg或者png格式图片')
      }

      // this.fileList.push(file)
      return false
    },
    getBase64(file, callback) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          callback(reader.result)
          resolve('成功')
        }
      })
    },
    uploadImgphone() {
      this.form.account_list.forEach((t) => {
        this.phonelist.push(t)
      })
      // console.log(...this.form.account_list)
      const formData = new FormData()
      formData.append('Account', String(this.phonelist))
      this.fileList.forEach(file => {
        formData.append('file', file)
      })
      // console.log(this.fileList);
      // console.log(formData)
      api.avatarUpload(formData).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功')
          this.accountImgVisible = false
          this.fileList = []
          this.init()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    resourcesText() {
      this.resourcesTextVisible = true
      this.ResourcePage = 1
      this.ResourceASize = 10
      this.ResourceText()
    },
    ResourceText() {
      const form = {
        // status: 2,
        // name: '',
        type: 7,
        page: this.ResourcePage,
        page_size: this.ResourceASize,
        order_created_at: true
      }
      api.getResourceUser(form).then((res) => {
        this.ResourceData = res.data.data
        this.ResourceTotal = res.data.count
      }).catch((err) => {
        // console.log(err)
      })
    },
    // 个签资源
    handleASign(page) {
      this.ResourcePage = page
      this.ResourceText()
    },
    handleSizeASign(p, s) {
      this.ResourceASize = s
      this.ResourcePage = 1
      this.ResourceText()
    },
    onSelectChange(selectedRowKeys, value) {
      this.selectedRowKeysValue = []
      this.selectedRowKeysId = []
      selectedRowKeys.forEach(item => {
        this.selectedRowKeysId.push(item)
      })
      value.forEach(item => {
        this.selectedRowKeysValue.push(item)
      })
      this.changeAccountForm.account_signale = this.selectedRowKeysValue[0].data.join(',')
    },
    tagID(e) {
      this.selectedRowKeysId = []
    },
    submitResourcesText() {
      this.resourcesTextVisible = false
    },

    submitNickname() {
      this.nicknameVisible = false
    },
    Nickname() {
      this.nicknameVisible = true
      this.NicknamePage = 1
      this.NicknameASize = 10
      this.NicknameList()
    },
    NicknameList() {
      const form = {
        // status: 2,
        // name: '',
        type: 1,
        page: this.NicknamePage,
        page_size: this.NicknameASize,
        order_created_at: true
      }
      api.getResourceUser(form).then((res) => {
        this.ResourceData = res.data.data
        this.NicknameTotal = res.data.count
      }).catch((err) => {
        // console.log(err)
      })
    },
    // 昵称资源 分页
    handleNickname(page) {
      this.NicknamePage = page
      this.NicknameList()
    },
    handleSizeNickname(p, s) {
      this.NicknameASize = s
      this.NicknamePage = 1
      this.NicknameList()
    },
    onSelectChangeNickname(selectedRowKeys, value) {
      this.selectedNicknameValue = []
      this.selectedNicknameId = []
      selectedRowKeys.forEach(item => {
        this.selectedNicknameId.push(item)
      })
      value.forEach(item => {
        this.selectedNicknameValue.push(item)
      })
      this.changeAccountForm.account_signale = this.selectedNicknameValue[0].data.join(',')
    },
    tagNickname() {
      this.selectedNicknameId = []
    },
    // 头像
    Headimg() {
      this.headimgVisible = true
      this.HeadimgList()
    },
    HeadimgList() {
      const form = {
        // status: 2,
        // name: '',
        type: 5,
        page: this.HeadimgPage,
        page_size: this.HeadimgASize,
        order_created_at: true
      }
      api.getResourceUser(form).then((res) => {
        this.ResourceData = res.data.data
        this.HeadimgTotal = res.data.count
      }).catch((err) => {
        // console.log(err)
      })
    },
    // 头像资源 分页
    handleHeadimg(page) {
      this.HeadimgPage = page
      this.HeadimgList()
    },
    handleSizeHeadimg(p, s) {
      this.HeadimgASize = s
      this.HeadimgPage = 1
      this.HeadimgList()
    },
    onSelectChangeHeadimg(selectedRowKeys, value) {
      this.selectedHeadimgValue = []
      this.selectedHeadimgId = []
      selectedRowKeys.forEach(item => {
        this.selectedHeadimgId.push(item)
      })
      value.forEach(item => {
        this.selectedHeadimgValue.push(item)
      })
      this.changeAccountForm.account_signale = this.selectedHeadimgValue[0].data.join(',')
    },
    submitHeadimg() {
      this.headimgVisible = false
    },
    changeHeadImg() {
      // 修改头像
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.headImgDialogAccount = true
    },
    assign() {
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.dialogUserId = true
    },
    assignNewUser(id) { // 分配到新的用户
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.dialogUserId = false

      const data = {
        list: this.form.account_list,
        port_id: 0,
        user_id: id
      }

      api.putAcountAssign(data).then((res) => {
        if (res.code === 0) {
          // console.log("分配日志：\n用户ID " + id + "\n账号：" + this.form.account_list)
          message.success('分配成功')
          this.form.account_list = []
          this.getTableData()
        } else {
          this.form.account_list = []
          message.error(res.data.message)
        }
      })
    },
    exportAccount() {
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      // console.log(this.form.account_list.join(','))
      var downloadParamsList = []
      for (var i = 0; i < this.form.account_list.length; i++) {
        var dataTemp = 'id=' + this.form.account_list[i]
        downloadParamsList.push(dataTemp)
      }
      var downloadParam = downloadParamsList.join('&')
      var pullUrl = 'http://47.97.22.234:33411/api/v1/account/download?' + downloadParam
      // api.exportAccountInfo(downloadParam)
      this.ModalText = pullUrl
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
      this.confirmLoading = false
    },
    handleCancel(e) {
      this.visible = false
    },
    deleteVisible() {
      this.batchDeleteVisible = true
      this.changeAccountForm.delete_nickname = this.form.account_list.join(',')
      // console.log(this.form.account_list)
    },
    submitBatchDelete() {
      const form = {}
      form.ids = this.form.account_list
      api.postUserbatchDelete(form).then((res) => {
        if (res.code === 0) {
          this.form.account_list = 0
          this.batchDeleteVisible = false
          this.init()
          // console.log(res)
        }
      }).catch((err) => {
        // console.log(err)
      })
    },
    handleAdd() {
      if (this.form.group_id === '') {
        this.$message.error('请先选择设备端口')
        return
      }
      this.form.group_id = Number(this.form.group_id)
      this.dialogLoading = true
      const data = {
        list: this.form.account_list,
        port_id: this.form.group_id, // 设备Id
        user_id: this.userInfo.data.i // 用户ID
      }
      api.putAcountBindPortUser(data).then((res) => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.dialogLoading = false
          this.form.group_id = ''
          this.form.account_list = []
          this.getTableData()
        }
      }).catch(err => {
        this.dialogLoading = false
        this.$message.error(err.msg)
      })
    },
    privateMessage(id) {
      this.runInfoGroupId = true
      this.currentAccountId = id
      this.openRunInfo()
    },
    // 任务详情
    UserTaskDetail(id) {
      this.currentAccountId = id
      this.taskDetails()
    },
    taskDetails() {
      let form = {
        account_id: this.currentAccountId,
        page: this.taskDetailsPage,
        page_size: this.taskDetailsSize,
        order_created_at: true
      }
      api.getUserTaskDetail(form).then(res => {
        if (res.code === 0) {
          this.taskDetailsData = res.data.data
          this.taskDetailsTotal = res.data.count
          this.taskDetailsVisible = true
        }
      })
    },
    taskDetailsCurrentChange(page) {
      this.taskDetailsPage = page
      this.taskDetails()
    },
    taskDetailshandleSizeChange(p, s) {
      this.taskDetailsSize = s
      this.taskDetailsPage = 1
      this.taskDetails()
    },
    cancelTaskDetails() {
      this.taskDetailsVisible = false
      this.taskDetailsSize = 10
      this.taskDetailsPage = 1
    },
    // 私信任务记录
    openRunInfo() {
      var accountRecordParam = {
        account_id: this.currentAccountId,
        order_created_at: true,
        page: this.runInfoCurrentPage,
        page_size: this.runInfohandleSize,
        type: 2
      }
      api.getAccountRecordUser(accountRecordParam).then((res) => {
        if (res && res.code === 0 && res.data) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].type === 1) {
              res.data.data[i].type = this.$t('user.concern')
            } else {
              res.data.data[i].type = this.$t('user.privateMessage')
            }
          }
          this.runInfoData = res.data.data
          console.log(this.runInfoData)
          this.runInfoTotal = res.data.count
        }
      })
    },
    runInfoCurrentChange(page) {
      this.runInfoCurrentPage = page
      this.openRunInfo()
    },
    runInfohandleSizeChange(p, s) {
      this.runInfohandleSize = s
      this.runInfoCurrentPage = 1
      this.openRunInfo()
    },
    cancelPrivateLetter() {
      this.runInfoGroupId = false
      this.runInfohandleSize = 10
      this.runInfoCurrentPage = 1
    },

    // 关注任务信息
    attention(id) {
      this.followRunInfoGroupId = true
      this.currentAccountId = id
      this.openRunInfoFollow()
    },
    openRunInfoFollow() {
      var accountRecordParam = {
        account_id: this.currentAccountId,
        order_created_at: true,
        page: this.followCurrentPage,
        page_size: this.followhandleSize,
        type: 1
      }
      api.getAccountRecordUser(accountRecordParam).then((res) => {
        if (res && res.code === 0 && res.data) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].type == 1) {
              res.data.data[i].type = this.$t('user.concern')
            } else {
              res.data.data[i].type = this.$t('user.privateMessage')
            }
          }
          this.runInfoData = res.data.data
          this.followTotal = res.data.count
        }
      })
    },
    followCurrentChange(page) {
      this.followCurrentPage = page
      this.openRunInfoFollow()
    },
    followHandleSizeChange(p, s) {
      this.followhandleSize = s
      this.followCurrentPage = 1
      this.openRunInfoFollow()
    },
    cancelFollow() {
      this.followRunInfoGroupId = false
      this.followhandleSize = 10
      this.followCurrentPage = 1
    },

    cancel() {
      this.runInfoGroupId = false
      this.getTableData()
    },
    handleDelete(row) {
      api.delAcount(row).then(res => {
        if (res.code === 0) {
          this.init()
        }
      })
    },
    handleSelectionChange(row) {
      this.form.account_list = []
      row.forEach(item => {
        this.form.account_list.push(item.id)
      })
    },
    getGroupId(id) {
      this.dialogGroupId = false
      this.form.group_id = id
    },
    async handPut(id) {
      const res = await api.putSend(id)
      if (res.code === 0) {
        this.getTableData()
      }
    },
    async handleAddAccount() {
      if (this.accountForm.account_username !== '' && this.accountForm.account_password !== '') {
        const res = await api.postTask({
          type: 7,
          account_username: this.accountForm.account_username,
          account_password: this.accountForm.account_password,
          executive_bundle: Number(this.searchData.bundle_id)
        })
        if (res.code === 0) {
          this.dialogAccount = false
        }
      }
    },
    // 修改昵称
    async changeAccountNickname() {
      if (this.selectedNicknameId.length < 1) {
        this.$message.error('请选择资源')
        return
      }
      var dataList = this.selectedNicknameId[0]
      // var dataList = this.changeAccountForm.account_nickname.split('\n')
      // console.log(dataList)
      var changeAccountParam = {
        list: this.form.account_list,
        resource_id: dataList
      }
      const res = await api.setAccountNicknameUser(changeAccountParam)
      if (res.code === 0) {
        this.nicknameDialogAccount = false
        this.init()
      }
    },
    async changeAccountSignature() {
      if (this.selectedRowKeysId.length < 1) {
        this.$message.error('请选择资源')
        return
      }
      const dataList = this.selectedRowKeysId[0]
      // console.log(dataList)
      const changeAccountParam = {
        list: this.form.account_list,
        // list: [30],
        resource_id: dataList
      }
      const res = await api.setAccountSignatureUser(changeAccountParam)
      if (res.code === 0) {
        this.signatureDialogAccount = false
        this.changeAccountForm.account_signale = ''
        this.init()
      }
    },
    async changeAccountHeadImg() {
      // console.log(this.selectedHeadimgId)
      if (this.selectedHeadimgId.length < 1) {
        this.$message.error('请选择资源')
        return
      }
      var dataList = this.selectedHeadimgId[0]
      // var dataList = this.changeAccountForm.account_headimg.split('\n')
      // console.log(dataList)
      var changeAccountParam = {
        list: this.form.account_list,
        resource_id: dataList
      }

      const res = await api.setAccountAvatarUser(changeAccountParam)
      if (res.code === 0) {
        this.headImgDialogAccount = false
        this.init()
      }
    },
    async handRandom() {
      const res = await api.postTask({
        type: 8,
        switch_account: '',
        executive_bundle: Number(this.searchData.bundle_id)
      })
      if (res.code === 0) {
        this.init()
      }
    },
    async handCheck(row) {
      const res = await api.postTask({
        type: 8,
        switch_account: row.unique_id,
        executive_device: Number(this.searchData.bundle_id)
      })
      if (res.code === 0) {
        this.init()
      }
    },
    async handleInputBlur(row) {
      await api.putAcountRemarks({ id: row.id, remarks: row.remarks })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
.ant-tooltip {
  max-width: 480px;
}
.circle {
  width: 100px;
  height: 100px;
  text-align: right;
  background-color: green;
}
</style>
