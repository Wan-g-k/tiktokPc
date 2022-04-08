<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <!-- <a-form-item :label="$t('user.privateMessageType')">
          <a-select v-model="type" style="width:150px" @change="changeSelect">
            <a-select-option :value="5">{{$t('admin.businessCard')}}</a-select-option>
            <a-select-option :value="2">{{$t('admin.text')}}</a-select-option>
            <a-select-option :value="1">{{$t('admin.video')}}</a-select-option>
            <a-select-option :value="3">{{$t('admin.richText')}}</a-select-option>
            <a-select-option :value="6">{{$t('admin.richText')}}V2</a-select-option>
            <a-select-option :value="4">图片</a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item :label="$t('user.privateMessageType')">
          <!-- <a-button type="primary" @click="init">{{this.$t('admin.Inquire')}}</a-button> -->
          <a-button style="margin-left:10px;" type="primary" @click="addDialogVisible">{{ this.$t('admin.Add') }}</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- <div>点击刷新：查看实时数据</div> -->
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :loading="tableLoading" :row-key="record => record.id" class="tableLimit" :scroll="{ x: 1500}" :bordered="true" :pagination="false">
        <templete v-for="(item, index) in columns" :key="index" :slot="item.slotName">
          <span>{{$t(item.slotName)}}</span>
        </templete>
        <span slot="created_at" slot-scope="text, row">
          {{ ((new Date(row.created_at).getMonth(row.created_at) + 1) < 10 ? '0' + (new Date(row.created_at).getMonth(row.created_at) + 1) : new Date(row.created_at).getMonth(row.created_at) + 1 ) + '-' + (new Date(row.created_at).getDate(row.created_at)) + '  ' + (new Date(row.created_at).getHours(row.created_at) < 10 ? '0' + new Date(row.created_at).getHours(row.created_at) : new Date(row.created_at).getHours(row.created_at)) + ':' + (new Date(row.created_at).getMinutes(row.created_at) < 10 ? '0' + new Date(row.created_at).getMinutes(row.created_at) : new Date(row.created_at).getMinutes(row.created_at)) + ':' + (new Date(row.created_at).getSeconds(row.created_at) < 10 ? '0' + new Date(row.created_at).getSeconds(row.created_at) : new Date(row.created_at).getSeconds(row.created_at)) }}
          <!-- {{ new Date(row.created_at) | getTime }} -->
        </span>
        <span slot="action" slot-scope="text, row">
          <a-button @click="view(row)">{{ $t('user.check') }}</a-button>
          <a-button style="margin-left: 8px;" @click="Refresh(row.id)">刷新</a-button>
          <a-button style="margin-left:8px" type="primary" @click="beforeCreate(row)">{{ $t('user.create') }}</a-button>
          <!-- <a-button style="margin-left: 8px;background:#E6A23C;color:white" @click="stop(row.id)">停止</a-button> -->
          <a-popconfirm :title="$t('admin.deleteOrNot')" :ok-text="$t('admin.Yes')" :cancel-text="$t('admin.No')" @confirm="del(row.id)">
            <a-button style="margin-left: 8px" type="danger">{{ $t('admin.delete') }}</a-button>
          </a-popconfirm>
        </span>
      </a-table>
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :total="total" :current="searchData.page" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>
      <a-modal v-model="dialogVisible" :title="$t('admin.Add')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="500px" @ok="addTask">
        <a-form-model ref="form" layout="horizontal" :model="form" :rules="form_rule" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <!-- <a-form-model-item :label="$t('user.privateMessageType')">
            <a-select v-model="type" @change="changeFormSelect">
              <a-select-option v-for="(item, index) in exchangeType" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item> -->
          <!-- <a-form-model-item label="版本" v-if="type == 3">
            <a-radio-group v-model="richTextVal">
              <a-radio :value="1">
                富文本
              </a-radio>
              <a-radio :value="2">
                富文本V2
              </a-radio>
            </a-radio-group>
          </a-form-model-item> -->
          <a-form-model-item :label="$t('user.taskPort')">
            <a-input v-model="form.executives" @click="dialogGroupId = true" readOnly />
          </a-form-model-item>
          <a-form-model-item :label="$t('user.intervals')">
            <a-input-number style="width: 175px;" v-model="form.min" :min="3" :max="100"/> ---- <a-input-number style="width: 175px;" v-model="form.max" :min="0" :max="100" />
            <!-- <a-input v-model="form.intervals" placeholder="间隔时间" /> -->
          </a-form-model-item>
          <!-- <a-form-model-item label="任务账号">
            <a-input v-model="form.executives" placeholder="(如有多个使用,分割)" />
          </a-form-model-item> -->
          <a-form-model-item :label="$t('user.area')">
            <a-input v-model="form.region" :placeholder="$t('user.segmentation')" oninput="value=value.replace(/\s/g,'')" prop="region" />
          </a-form-model-item>
          <!-- <a-form-model-item label="发送数量">
            <a-input v-model.number="form.number" placeholder="发送数量" />
          </a-form-model-item> -->
          <a-form-model-item label="代理区域">
            <!-- <a-input v-model="form.proxy_region" placeholder="代理区域" /> -->
            <a-select v-model="form.proxy_region">
              <a-select-option v-for="(item, index) in proxy_region" :key="index" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('admin.remark')">
            <a-input v-model="form.remark" :placeholder="$t('admin.remark')" />
          </a-form-model-item>
          <a-form-model-item :label="$t('user.send')">
            <a-select v-model="form.send_all" @change="changeFormSelectFslse">">
              <a-select-option :value="false">
                {{$t('user.sendNew')}}
              </a-select-option>
              <a-select-option :value="true">
                {{$t('user.sendAll')}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item :label="$t('user.sendSubscript')">
            <a-input-number style="width: 175px;" v-model="form.send_start_cursor" :min="0" :max="10000"/> ---- <a-input-number style="width: 175px;" v-model="form.send_end_cursor" :min="0" :max="10000"/>
          </a-form-model-item>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <a-form-model-item v-for="(domain, index) in form.video" :key="index" :label="$t('admin.video')" class="short-input btn-item" prop="video">
            <a-input v-model="domain.value" width="100px" @click="tiktokParseVideo" readOnly/>
            <a-button class="add-btn" type="success" @click="form.video.push({ value: '' })">{{$t('admin.Add')}}</a-button>
            <a-button class="delete-btn" type="danger" @click.prevent="form.video.length === 1 ? '' : form.video.splice(index, 1)">{{$t('admin.delete')}}</a-button>
          </a-form-model-item>
          <!-- <a-form-model-item v-for="(domain, index) in form.video_text" v-if="type === 1" :key="index" :label="'文本'" class="short-input btn-item" prop="video_text">
            <a-input v-model="domain.value"/>
            <a-button class="add-btn" type="success" plain @click="form.video_text.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.video_text.length === 1 ? '' : form.video_text.splice(index, 1)">删除</a-button>
          </a-form-model-item> -->

          <!-- <a-form-model-item v-for="(domain, index1) in form.text" v-if="form.resourceName == '' && type == 2 && resources" :key="index1 + 'info'" label="私信文字" class="short-input btn-item" prop="text">
            <a-input v-model="domain.value"/>
            <a-button class="add-btn" type="success" plain @click="form.text.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.text.length === 1 ? '' : form.text.splice(index1, 1)">删除</a-button>
          </a-form-model-item> -->
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <a-form-model-item :label="$t('admin.richText')" prop="rich_text">
            <a-input v-model="form.rich_text" type="textarea" @click.prevent="setRichText()" readOnly/>
            <!-- <a-button class="add-btn" type="success" plain @click="form.rich_text.push({ value: '' })">{{$t('admin.Add')}}</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.rich_text.length === 1 ? '' : form.rich_text.splice(index2, 1)">{{$t('admin.delete')}}</a-button> -->
          </a-form-model-item>
          <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
          <!-- 图片 -->
          <a-form-model-item v-for="(domain, index) in form.image" v-if="form.resourceName == '' && type == 4" :key="index + 'info2'" :label="$t('admin.pictureURL')" class="short-input btn-item" prop="image">
            <a-input v-model="domain.value" readOnly/>
            <a-button class="add-btn" type="success" plain @click="form.image.push({ value: '' })">{{$t('admin.Add')}}</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.image.length === 1 ? '' : form.image.splice(index, 1)">{{$t('admin.delete')}}</a-button>
          </a-form-model-item>
          <a-form-model-item v-for="(domain, index) in form.name_card" :key="index + 'info3'" :label="$t('admin.businessCard')" class="short-input btn-item" prop="name_card">
            <a-input v-model="domain.value"  @click="tiktokParseNameCard" readOnly/>
            <a-button class="add-btn" type="success" plain @click="form.name_card.push({ value: '' })">{{$t('admin.Add')}}</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.name_card.length === 1 ? '' : form.name_card.splice(index, 1)">{{$t('admin.delete')}}</a-button>
          </a-form-model-item>
          <!-- <a-form-model-item v-for="(domain, index) in form.card_text" v-if="type == 5" :key="index" :label="'文本'" class="short-input btn-item" prop="card_text">
            <a-input v-model="domain.value"/>
            <a-button class="add-btn" type="success" plain @click="form.card_text.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.card_text.length === 1 ? '' : form.card_text.splice(index, 1)">删除</a-button>
          </a-form-model-item> -->
          <!-- <a-form-model-item v-for="(domain, index) in form.tips" :key="index + 'info4'" :label="'外链文本'" class="short-input btn-item">
            <a-input v-model="domain.value"  @click="bookTextResources"/>
            <a-button class="add-btn" type="success" plain @click="form.tips.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.tips.length === 1 ? '' : form.name_card.splice(index, 1)">删除</a-button>
          </a-form-model-item> -->
          <!-- <a-form-model-item :label="$t('user.textResource')" prop="text">
            <a-button class="add-btn" type="success" plain @click="resourcesText">{{$t('user.selectResource')}}</a-button><br/><span v-if="!resources">{{$t('user.resourceSelected')}}</span>
          </a-form-model-item> -->
          <a-form-model-item v-for="(domain, index) in form.card_text" :key="index" :label="'文本'" class="short-input btn-item" prop="card_text">
            <a-input v-model="domain.value" @click="resourcesText" readOnly />
            <a-button class="add-btn" type="success" plain @click="form.card_text.push({ value: '' })">新增</a-button>
            <a-button class="delete-btn" type="danger" plain @click.prevent="form.card_text.length === 1 ? '' : form.card_text.splice(index, 1)">删除</a-button>
          </a-form-model-item>
          <!-- <a-form-model-item :label="$t('user.textResource')"  v-if="type === 5 || type === 1">
            <a-button class="add-btn" type="success" plain @click="resourcesText">{{$t('user.selectResource')}}</a-button><br/><span v-if="!resources">{{$t('user.resourceSelected')}}</span>
          </a-form-model-item> -->
          <!-- <a-form-model-item label="资源内容">
            <a-button v-if="form.resourceName == ''" @click="getResouce">获取</a-button>
            <a-tag v-else closable @close="closeTag">
              {{ form.resourceName }}
            </a-tag>
            <span> (使用资源手填将会失效)</span>
          </a-form-model-item> -->
        </a-form-model>
        <span slot="footer">
          <a-button style="margin-left:10px;" class="add-btn" type="success" @click="dialogVisible = false, loading = false">{{$t('admin.cancel')}}</a-button>
          <a-button style="margin-left:10px;" type="primary" :loading="loading" @click="addTask">{{$t('admin.confirm')}}</a-button>
        </span>
      </a-modal>
      <!-- 视频 -->
      <a-modal v-model="videoVisible" title="视频" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="550px" @ok="handleVideo">
        <a-form-model ref="rich_video_form" :model="rich_text_form" :rules="rich_text_form_rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-model-item label="video_user_id" prop="title">
            <a-input v-model="rich_video_form.video_user_id" />
          </a-form-model-item>
          <a-form-model-item label="video_id" prop="desc">
            <a-input v-model="rich_video_form.video_id" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 名片 -->
      <a-modal v-model="nameCardTextVisible" title="名片" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="550px" @ok="handleNameCard">
        <a-form-model ref="user_card_form" :model="user_card_form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-form-model-item label="user_card_id" prop="title">
            <a-input v-model="user_card_form.user_card_id" />
          </a-form-model-item>
          <a-form-model-item label="名片信息" prop="desc">
            <a-input v-model="user_card_form.card_detail" />
          </a-form-model-item>
          <a-form-model-item label="图片1" prop="desc">
            <a-input v-model="user_card_form.bg_image_list1" />
          </a-form-model-item>
          <a-form-model-item label="图片2" prop="desc">
            <a-input v-model="user_card_form.bg_image_list2" />
          </a-form-model-item>
          <a-form-model-item label="图片3" prop="desc">
            <a-input v-model="user_card_form.bg_image_list3" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 富文本 -->
      <a-modal v-model="disalogRichText" :title="this.$t('admin.richText')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="450px" @ok="handleAddRichText">
        <a-form-model ref="rich_text_form" :model="rich_text_form" :rules="rich_text_form_rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item label="标题">
            <a-input v-model="rich_text_form.title" />
          </a-form-model-item>
          <a-form-model-item label="schema">
            <a-input v-model="rich_text_form.schema" />
          </a-form-model-item>
          <a-form-model-item label="外链地址" prop="card_text">
            <a-input v-model="rich_text_form.url" />
            <!-- <a-button class="add-btn" type="primary" :loading="shortLinkLoading" @click="shortLink(rich_text_form.url)">生成</a-button> -->
          </a-form-model-item>
          <a-form-model-item label="图片">
            <a-input v-model="rich_text_form.image" />
          </a-form-model-item>
          <a-form-model-item label="root_id">
            <a-input v-model="rich_text_form.root_id" />
          </a-form-model-item>
          <a-form-model-item label="prev_id">
            <a-input v-model="rich_text_form.prev_id" />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-input v-model="rich_text_form.desc" type="textarea" />
          </a-form-model-item>
          <a-form-model-item label="数量">
            <a-input v-model="frequency" type="textarea" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
      <!-- 解析名片 -->
      <!-- <a-modal v-model="nameCardVisible" :title="$t('user.analyzeBusinessCards')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="550px" @ok="handleNameCard">
        <a-form-model ref="nameCardFrom" :model="nameCardFrom" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="$t('user.enterURL')" prop="avatar">
            <a-input v-model="nameCardFrom.url" />
          </a-form-model-item>
        </a-form-model>
      </a-modal> -->
      <!-- 视频解析 -->
      <!-- <a-modal v-model="videoVisible" :title="$t('user.videoAnalysis')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="550px" @ok="handleVideo">
        <a-form-model ref="videoFrom" :model="videoFrom" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-model-item :label="$t('user.enterURL')" prop="avatar">
            <a-input v-model="videoFrom.url" />
          </a-form-model-item>
        </a-form-model>
      </a-modal> -->
      <!-- 外链文本 -->
      <a-modal v-model="bookTextVisible" title="选择外链信息资源" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitResourcesBookText">
        <a-table :columns="columnsResource" :data-source="bookTextData" :row-key="record => record.id" :row-selection="{onChange:onSelectChangeBookText ,selectedRowKeys: selectedRowBookText,type:'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsResource" :key="index" :slot="item.slotName">
            <span>{{$t(item.slotName)}}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(bookTextTotal, range) => `${range[0]}-${range[1]} 条，总数:${bookTextTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :total="bookTextTotal" :current="bookTextForm.page" @change="bookTextChange" @showSizeChange="bookTextSizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>
      <!-- 选择名片 -->
      <!-- <a-modal v-model="nameCardTextVisible" :title="$t('user.businessCardResources')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitResourcesNameCard">
        <a-table :columns="columnsResource" :data-source="nameCardData" :row-key="record => record.id" :row-selection="{onChange:onSelectChangeNameCard ,selectedRowKeys: selectedRowNameCard}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsResource" :key="index" :slot="item.slotName">
            <span>{{$t(item.slotName)}}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(nameCardTotal, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${nameCardTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :total="nameCardTotal" :current="dataForm.page" @change="nameCardChange" @showSizeChange="nameCardSizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal> -->
      <!-- 选择视频资源 -->
      <a-modal v-model="videoTextVisible" :title="$t('user.videoResource')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitResourcesVideo">
        <a-table :columns="columnsResource" :data-source="nameCardData" :row-key="record => record.id" :row-selection="{onChange:onSelectChangeVideo, selectedRowKeys: selectedRowVideo}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsResource" :key="index" :slot="item.slotName">
            <span>{{$t(item.slotName)}}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(videoTotal, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${videoTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :total="videoTotal" :current="videoForm.page" @change="videoChange" @showSizeChange="videoSizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>
      <a-modal v-model="resourcesTextVisible" :title="$t('user.resourceTemplate')" :ok-text="this.$t('admin.confirm')" :cancel-text="this.$t('admin.cancel')" width="600px" @ok="submitResourcesText">
        <a-table :columns="columnsResource" :data-source="ResourceData" :row-key="record => record.id" :row-selection="{onChange:onSelectChange,type:'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <templete v-for="(item, index) in columnsResource" :key="index" :slot="item.slotName">
            <span>{{$t(item.slotName)}}</span>
          </templete>
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(textTotal, range) => `${range[0]}-${range[1]} 条，${$t('admin.total')}:${textTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :total="textTotal" :current="textForm.page" @change="textChange" @showSizeChange="textSizeChange">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>

      <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="cancelGetGroupId" />

      <resource v-if="dialogResource" :type="resourceType" @cancel="dialogResource = false" @getData="getResource" />
    </div>
  </div>
</template>

<script>
import mixin from './mixin/mixin'
import { columns } from './mixin/mixin'
import * as api from '@/api/index'
import { logout } from '@/api/user';
// 防抖动
function debounce(func, wait=2000){
 let timeout;
 return function(event){
  clearTimeout(timeout)
  timeout = setTimeout(()=>{
      func.call(this, event)
    },wait)
  }
}
const columnsResource = [{
  // title: '资源名称',
  slotName: 'admin.resource',
  dataIndex: 'name',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'name', title:'admin.resource' }
},
{
  // title: '资源内容',
  slotName: 'admin.resourceContent',
  dataIndex: 'data',
  width: '80px',
  ellipsis: true,
  align: 'center',
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  },
  scopedSlots: { customRender: 'data', title:'admin.resourceContent' }
},
{
  // title: '创建时间',
  slotName: 'admin.creationTime',
  dataIndex: 'created_at',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'created_at', title: 'admin.creationTime' }
},
]
export default {
  mixins: [mixin],
  data() {
    let checkPending
    const checkNum = (rule, value, callback) => {
      clearTimeout(checkPending)
      if (!value) {
        return callback(new Error('请输入数量'))
      }
      checkPending = setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      }, 1000)
    }
    const checkAddress = (rule, value, callback) => {
      const re = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
      let isOk = true
      value.forEach(item => {
        if (!re.test(item.value)) {
          isOk = false
          callback(new Error('请检查是否是正确的网址'))
        }
      })
      if (isOk) callback()
    }
    const checkRegion = (rule, value, callback) => {
      const re = /[A-Z]{2,}/
      let isOk = true
      value.forEach(item => {
        if (!re.test(item.value)) {
          isOk = false
          callback(new Error('仅支持大写和,'))
        }
      })
      if (isOk) callback()
    }
    const checkNull = (rule, value, callback) => {
      let isOk = true
      // console.log(value)
      value.forEach(item => {
        if (item.value === '') {
          isOk = false
          // callback(new Error('请检查是否有为空的值'))
        }
      })
      if (isOk) callback()
    }
    return {
      searchData: {
        page: 1,
        type: 4,
        page_size: 10,
        order_created_at: true
      },
      video_textValue: [],
      columnsResource: [],
      ResourceData: [],
      exchangeObj: {
        1: 'is_not_null_video',
        2: 'is_not_null_text',
        // 富文本
        3: 'is_not_null_rich_text',
        // 富文本V2
        // 6: 'is_not_null_rich_text_v2',
        // 4: 'is_not_null_image',
        5: 'is_not_null_name_card'
      },
      type: 5,
      total: 0,
      columns: [],
      tableLoading: false,
      resources: true,
      loading: false,
      shortLinkLoading: false, // 短链生成
      form: {
        type: 3,
        executive_group: '',
        executives: '',
        // intervals: 5,
        max: 3,
        min: 10,
        card_text: '',
        video_text: '',
        proxy_region: '',
        remark: '',
        region: '',
        send_all: false,
        send_start_cursor: 0,
        send_end_cursor: 0,
        // 文本外链
        // tips: '',
        bookText: '',
        rich_text: [],
        video: [{ value: '' }]
      },
      // 富文本版本
      // richTextVal: 1,
      resourceType: '',
      disalogRichText: false,
      nameCardVisible: false,
      videoVisible: false,
      resourcesTextVisible: false,
      nameCardTextVisible: false,
      videoTextVisible: false,
      bookTextVisible: false,
      nameCardData: [],
      bookTextData: [],
      dataForm: {
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      videoForm: {
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      bookTextForm: {
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      rich_video_form: {
        video_user_id: '',
        video_id: ''
      },
      textForm: {
        page: 1,
        page_size: 10,
        order_created_at: true
      },
      textTotal: 0,
      user_card_form: {
        user_card_id: '',
        card_detail: '',
        bg_image_list: [],
        bg_image_list1: '',
        bg_image_list2: '',
        bg_image_list3: ''
      },
      proxy_region: [
        { label: '空', value: '' },
        { label: 'BR+ip:311155', value: 'BR' },
        { label: 'FR+ip:72877', value: 'FR' },
        { label: 'PK+ip:52106', value: 'PK' },
        { label: 'SA+ip:46973', value: 'SA' },
        { label: 'US+ip:42044', value: 'US' },
        { label: 'EC+ip:38207', value: 'EC' },
        { label: 'MY+ip:37913', value: 'MY' },
        { label: 'RU+ip:36454', value: 'RU' },
        { label: 'MX+ip:33768', value: 'MX' },
        { label: 'UA+ip:33696', value: 'UA' },
        { label: 'MA+ip:32206', value: 'MA' },
        { label: 'PH+ip:30748', value: 'PH' },
        { label: 'CA+ip:25115', value: 'CA' },
        { label: 'ES+ip:22480', value: 'ES' },
        { label: 'IT+ip:19447', value: 'IT' },
        { label: 'VN+ip:17955', value: 'VN' },
        { label: 'AR+ip:16978', value: 'AR' },
        { label: 'ID+ip:15997', value: 'ID' },
        { label: 'GB+ip:14884', value: 'GB' },
        { label: 'TH+ip:13081', value: 'TH' },
        { label: 'BD+ip:12389', value: 'BD' },
        { label: 'SG+ip:11911', value: 'SG' },
        { label: 'UZ+ip:11632', value: 'UZ' },
        { label: 'KZ+ip:10856', value: 'KZ' },
        { label: 'DE+ip:10694', value: 'DE' },
        { label: 'IN+ip:10413', value: 'IN' }
      ],
      nameCardTotal: 0,
      videoTotal: 0,
      bookTextTotal: 0,
      selectedRowKeys: [],
      selectedRowNameCard: [],
      selectedRowBookText: [],
      valueBookText: [],
      valueNameCard: [],
      selectedRowVideo: [],
      valueVideo: [],
      selectedRowKeysChange: [],
      /* form_rule: {
        video: [
          { required: true, message: '请输入视频', trigger: 'blur' }
        ],
        text: [
          { required: true },
          { validator: checkNull, trigger: 'blur' }
        ],
        rich_text: [
          { required: true },
          { validator: checkNull, trigger: 'blur' }
        ],
        image: [
          { required: true },
          { validator: checkAddress, trigger: 'blur' }
        ],
        name_card: [
          { required: true, message: '请输入名片', trigger: 'blur' },
          // { validator: checkNull, trigger: 'blur' }
        ],
        number: [
          { required: true },
          { validator: checkNum, trigger: 'change' }
        ],
        region: [
          { required: true },
          { validator: checkRegion, trigger: 'blur' }
        ]
      }, */
      rich_text_index: 0,
      rich_text_form: {
        schema: '',
        url: '',
        desc: '',
        title: '',
        image: '',
        root_id: 0,
        prev_id: 0
      },
      rich_text_form_rules: {
        /* title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ], */
        /* avatar: [
          { required: true, message: '请输入头像地址', trigger: 'blur' },
          { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确头像地址', trigger: 'blur' }
        ], */
        link: [
          { required: true, message: '请输入地址', trigger: 'blur' }
          // { required: true, pattern: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/, message: '请输入正确地址', trigger: 'blur' }
        ]
      },
      nameCardFrom: {
        url: ''
      },
      videoFrom: {
        url: ''
      },
      frequency: 1
    }
  },
  mounted() {
    this.columnsResource = []
    columnsResource.forEach(item => {
      if (item.role != null && !item.role.includes(this.role)) {
        return
      }
      this.columnsResource.push(item)
    })
    this.getColums()
    this.form.send_all = false
    this.init()
  },
  methods: {
    async getTableData() {
      const form = {}
      this.tableLoading = true
      this.selectedRowNameCard = []
      this.selectedRowVideo = []
      // form[this.exchangeObj[this.type]] = true
      const res = await api.getTask({ ...this.searchData, ...form })
      if (res && res.code === 0 && res.data) {
        this.tableLoading = false
        this.tableData = res.data.data
        this.total = res.data.count
      }
    },
    Refresh(id) {
      this.tableLoading = true
      api.putUserTaskRefresh(id).then(res => {
        if (res.code === 0) {
          this.init()
        }
        // console.log(res)
      })
    },
    getGroupId(ids) {
      /* if (this.form.executives != '') {
        this.form.executives = this.form.executives + ',' + ids
      } else {
        this.form.executives = ids
      } */
      this.form.executives = ids
    },
    cancelGetGroupId() {
      this.dialogGroupId = false
    },
    // addTask:debounce(function(e){
    addTask() {
      this.loading = true
      this.$refs['form'].validate(async valid => {
        if (valid) {
          // if (this.validateForm()) return
          const form = {}
          form.type = 4
          form.remark = this.form.remark
          form.proxy_region = this.form.proxy_region === '' ? '' : this.form.proxy_region
          // form.intervals = this.form.intervals === '' ? 5 : Number(this.form.intervals)
          form.max = this.form.max === '' ? 5 : Number(this.form.max)
          form.min = this.form.min === '' ? 5 : Number(this.form.min)
          form.text = this.computeArr(this.form.card_text)
          if (this.form.card_text[0].value === '') {
            form.text = null
          } else {
            let textList = []
            form.text = []
            // form.video = this.computeArr(this.form.video)
            textList = this.computeArr(this.form.card_text)
            textList.forEach(item => {
              form.text.push(item)
            })
          }
          /* if (this.type === 1) {
            if (this.form.video_text[0].value === '') {
              this.form.video_text = null
            }
            form.text = this.form.video_text
            this.type = 1
          }
          if (this.type === 2) {
            form.text = this.form.text
            this.type = 2
          }
          if (this.type === 5) {
            if (this.form.card_text === undefined) {
              form.text = null
            } else if (this.form.card_text.length === 1 && this.form.card_text[0].value === '') {
              form.text = null
            } else if (this.form.card_text != undefined) {
              form.text = this.form.card_text
            }
            this.type = 5
          } */
          // form.tips = this.computeArr(this.form.tips)
          if (this.form.video[0].value === '') {
            form.video = null
          } else {
            // let videoList = []
            form.video = []
            form.video = this.computeArr(this.form.video)
            /* videoList = this.computeArr(this.form.video)
            videoList.forEach(item => {
              form.video.push(JSON.parse(item))
            }) */
          }
          form.tips = null
          // form.rich_text = this.computeArr(this.form.rich_text)
          // rich_text 富文本    rich_text_v2   富文本v2
          form.rich_text_v2 = null
          if (this.form.rich_text.length < 1) {
            form.card = null
          } else {
            // let rich_textList = []
            form.card = []
            form.card = this.form.rich_text
            /* rich_textList = this.computeArr(this.form.rich_text)
            rich_textList.forEach(item => {
              form.rich_text.push(JSON.parse(item))
            }) */
          }
          /* if(this.type === 3) {
            form.rich_text_v2 = null
            form.rich_text = this.computeArr(this.form.rich_text)
          } else if (this.type === 6) {
            form.rich_text = null
            form.rich_text_v2 = this.computeArr(this.form.rich_text)
          } */
          form.image = this.computeArr(this.form.image)
          if (this.form.name_card[0].value === '') {
            form.name_card = null
          } else {
            // let name_cardList = []
            form.name_card = []
            form.name_card = this.computeArr(this.form.name_card)
            /* name_cardList = this.computeArr(this.form.name_card)
            name_cardList.forEach(item => {
              form.name_card.push(JSON.parse(item))
            }) */
          }
          // form.name_card = this.computeArr(this.form.name_card)
          // form.number = this.form.number === '' ? 0 : Number(this.form.number)
          form.region = this.form.region === '' ? '' : this.form.region
          form.send_all = this.form.send_all
          form.send_start_cursor = this.form.send_start_cursor
          form.send_end_cursor = this.form.send_end_cursor
          // console.log(form)
          this.postTask(form)
        }
      })
    },
    resourcesText() {
      this.resourcesTextVisible = true
      this.selectedRowKeysChange = []
      let form = {
        // status: 2,
        type: 1,
        page: this.textForm.page,
        page_size: this.textForm.page_size,
        order_created_at: true
      }
      api.getResourceUser(form).then((res) => {
        this.ResourceData = res.data.data
        this.textTotal = res.data.count
      })
    },
    onSelectChange(selectedRowKeys, value) {
      this.selectedRowKeysChange = []
      this.video_textValue = value
      selectedRowKeys.forEach(item => {
        this.selectedRowKeysChange.push(item)
      })
      this.resources = false
      /* if (this.type === 2) {
        this.type = 2
        this.form.text = []
        valueas[0].data.map((item) => {
          return this.form.text.push(item)
        })
      } else if (this.type === 5) {
        this.type = 5
        this.form.card_text = []
        valueas[0].data.map((item) => {
          return this.form.card_text.push(item)
        })
      } else if (this.type === 1) {
        this.type = 1
        this.form.video_text = []
        valueas[0].data.map((item) => {
          return this.form.video_text.push(item)
        })
      } */
    },
    onSelectChangeNameCard(selectedRowKeys, value) {
      this.selectedRowNameCard = []
      this.valueNameCard = []
      this.selectedRowNameCard = selectedRowKeys
      this.valueNameCard = value
      this.form.name_card = []
      this.valueNameCard.map(item => {
        item.data.map(items => {
          return this.form.name_card.push({ value: items })
        })
      })
    },
    submitResourcesNameCard() {
      this.nameCardTextVisible = false
    },
    submitResourcesText() {
      this.resourcesTextVisible = false
      this.form.card_text = []
      this.video_textValue.map(item => {
        item.data.map(items => {
          return this.form.card_text.push({ value: items })
        })
      })
    },
    onSelectChangeVideo(selectedRowKeys, value) {
      this.selectedRowVideo = []
      this.valueVideo = []
      this.selectedRowVideo = selectedRowKeys
      this.valueVideo = value

      this.form.video = []
      this.valueVideo.map(item => {
        item.data.map(items => {
          return this.form.video.push({ value: items})
        })
      })
    },
    submitResourcesVideo() {
      this.videoTextVisible = false
    },
    validateForm() {
      switch (this.type) {
        case 1:
          if (this.form.video.findIndex(item => item.value === '') !== -1) {
            this.$message.error('视频地址有未填写的')
            return true
          }
          break
        case 2:
          if (this.form.text.findIndex(item => item.value === '') !== -1) {
            this.$message.error('文本有未填写的')
            return true
          }
          break
        case 3:
          if (this.form.rich_text.findIndex(item => item.value === '') !== -1) {
            this.$message.error('富文本有未填写的')
            return true
          }
          break
        case 4:
          if (this.form.image.findIndex(item => item.value === '') !== -1) {
            this.$message.error('图片地址有未填写的')
            return true
          }
          break
        case 5:
          if (this.form.name_card.findIndex(item => item.value === '') !== -1) {
            this.$message.error('名片有未填写的')
            return true
          }
          break
      }
      return false
    },
    changeFormSelect() {
      this.form.video = [{ value: '' }]
      this.form.text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
      this.form.card_text = [{ value: '' }]
      this.form.video_text = [{ value: '' }]
      // this.form.tips = [{ value: '' }]
    },
    changeFormSelectFslse(value) {
      this.form.send_all = value
    },
    addDialogVisible() {
/*       if(this.type === 6) {
        this.type = 3
      } */
      this.dialogVisible = true
      this.resources = true
      this.form.type = 3
      this.form.executive_group = ''
      this.form.executives = ''
      // this.form.intervals = 5
      this.form.max = 10
      this.form.min = 3
      this.form.remark = ''
      this.form.proxy_region = ''
      this.form.region = ''
      this.form.send_all = false
      this.form.rich_text = []
      this.form.video = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
      this.form.card_text = [{ value: '' }]
      this.form.video_text = [{ value: '' }]
      // this.form.tips = [{ value: '' }]
    },
    // 外链文本
    bookTextResources() {
      this.bookTextVisible = true
      let form = {}
      form.type = 8
      form.page = this.bookTextForm.page
      form.page_size = this.bookTextForm.page_size
      form.order_created_at = true
      api.getResourceUser(form).then(res => {
        if (res.code === 0) {
          this.bookTextData = res.data.data
          this.bookTextTotal = res.data.count
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    // 选择 文本外链
    onSelectChangeBookText(selectedRowKeys, value) {
      this.selectedRowBookText = []
      this.valueBookText = []
      this.selectedRowBookText = selectedRowKeys
      this.valueBookText = value

      this.form.tips = []
      // console.log(this.valueBookText)
      this.valueBookText.map(item => {
        item.data.map(items => {
          return this.form.tips.push({ value: items })
        })
      })
    },
    submitResourcesBookText() {
      this.bookTextVisible = false
    },
    // 选择视频
    tiktokParseVideo() {
      this.videoVisible = true
      this.rich_video_form = {}
    },
    handleVideo() {
      this.videoVisible = false
      let videoList = []
      if (this.form.video[0].value === '') {
        this.form.video = []
        this.form.video.push({ value: JSON.stringify(this.rich_video_form) })
      } else {
        this.form.video.push({ value: JSON.stringify(this.rich_video_form) })
        videoList = this.form.video.filter(word => word.value !== '')
        this.form.video = videoList
      }
    },
    // 选择名片资源
    tiktokParseNameCard() {
      this.nameCardTextVisible = true
      this.user_card_form.user_card_id = ''
      this.user_card_form.card_detail = ''
      this.user_card_form.bg_image_list = []
      this.user_card_form.bg_image_list1 = ''
      this.user_card_form.bg_image_list2 = ''
      this.user_card_form.bg_image_list3 = ''
    },
    // 名片
    handleNameCard() {
      this.nameCardTextVisible = false
      let nameCardList = []
      this.user_card_form.bg_image_list.push(this.user_card_form.bg_image_list1, this.user_card_form.bg_image_list2, this.user_card_form.bg_image_list3)
      const userCard = {
        user_card_id: this.user_card_form.user_card_id,
        card_detail: this.user_card_form.card_detail,
        bg_image_list: this.user_card_form.bg_image_list
      }
      if (this.form.name_card[0].value === '') {
        this.form.name_card = []
        this.form.name_card.push({ value: JSON.stringify(userCard) })
      } else {
        this.form.name_card.push({ value: JSON.stringify(userCard) })
        nameCardList = this.form.name_card.filter(word => word.value !== '')
        this.form.name_card = nameCardList
      }
    },
    textChange(page) {
      this.textForm.page = page
      this.resourcesText()
    },
    textSizeChange(p, s) {
      this.textForm.page = p
      this.textForm.page_size = s
      this.resourcesText()
    },
    nameCardChange(page) {
      this.dataForm.page = page
      this.tiktokParseNameCard()
    },
    nameCardSizeChange(p, s) {
      this.dataForm.page = p
      this.dataForm.page_size = s
      this.tiktokParseNameCard()
    },
    bookTextChange(page) {
      this.bookTextForm.page = page
      this.bookTextResources()
    },
    bookTextSizeChange(p, s) {
      this.bookTextForm.page = p
      this.bookTextForm.page_size = s
      this.bookTextResources()
    },
    videoChange(page) {
      this.videoForm.page = page
      this.tiktokParseNameCard()
    },
    videoSizeChange(p, s) {
      this.videoForm.page = p
      this.videoForm.page_size = s
      this.tiktokParseVideo()
    },
    setRichText(index) {
      /* this.rich_text_index = index
      if (this.form.rich_text[this.rich_text_index].value !== '') {
        this.rich_text_form = JSON.parse(this.form.rich_text[this.rich_text_index].value)
      } */
      this.rich_text_form = {
        schema: '',
        url: '',
        desc: '',
        title: '',
        image: '',
        root_id: 0,
        prev_id: 0
      }
      this.frequency = 1
      this.disalogRichText = true
    },
    beforeCreate(row) {
      if (row.video && row.text) this.type = 1
      if (row.text && !row.video) this.type = 2
      if (row.rich_text) this.type = 3
      // if (row.image) this.type = 4
      if (row.name_card) this.type = 5
      this.create(row)
    },
    changeSelect(value) {
      this.form.send_all = false
      this.getColums(value)
      this.init()
    },
    getColums(value = 5) {
      this.columns = []
      columns.forEach(item => {
        if (!item.type.includes(2)) {
          return
        }
        if (item.role) {
          if (!item.role.includes(this.role)) {
            return
          }
        }
        if (item.exchange != null && item.exchange !== value) {
          return
        }
        this.columns.push(item)
      })
    },
    // 生成短链
    shortLink() {
      // this.shortLinkLoading = true
      let form = {
        url: this.rich_text_form.url
      }
      api.postShortLinkGen(form).then(res => {
        if (res.code === 0) {
          this.rich_text_form.url = res.data.url
          this.form.rich_text.push(JSON.stringify(this.rich_text_form))
          let frequency = Number(this.frequency)
          let richTextLength = Number(this.form.rich_text.length)
          if (frequency === richTextLength) {
            this.disalogRichText = false
          }
          // console.log(this.form.rich_text)
          // this.shortLinkLoading = false
        }
      }).catch(err => {
        // this.shortLinkLoading = false
        this.$message.error(err.msg)
      })
    },
    // 执行次数
    numberImplement(num) {
      for (let i = 0; i < num; i++) {
        this.shortLink()
      }
    },
    // 确定富文本
    handleAddRichText() {
      this.form.rich_text = []
      this.numberImplement(Number(this.frequency))
      /* this.$refs['rich_text_form'].validate(async valid => {
        if (valid) {
          this.form.rich_text[this.rich_text_index].value = JSON.stringify(this.rich_text_form)
          this.rich_text_form = {
            title: '',
            desc: '',
            avatar: '',
            link: '',
            text: ''
          }
          this.disalogRichText = false
        }
      }) */
    },
    getResouce() {
      const type = {
        1: 3,
        2: 1,
        3: 2,
        4: 5,
        5: 6,
        6: 4
      }
      this.resourceType = type[this.type]
      this.dialogResource = true
    },
    getResource(data) {
      const value = []
      data.data.forEach(item => {
        value.push({
          value: item
        })
      })
      switch (this.type) {
        case 1:
          this.form.video = value
          break
        case 2:
          this.form.text = value
          break
        case 3:
          this.form.rich_text = value
          break
        case 4:
          this.form.image = value
          break
        case 5:
          this.form.name_card = value
          break
      }
      this.form.resourceName = data.name
    },
    closeTag() {
      this.form.resourceName = ''
      this.form.video = [{ value: '' }]
      this.form.text = [{ value: '' }]
      this.form.rich_text = [{ value: '' }]
      this.form.image = [{ value: '' }]
      this.form.name_card = [{ value: '' }]
      this.form.card_text = [{ value: '' }]
      this.form.video_text = [{ value: '' }]
    }
  }
}
</script>

<style lang="scss">
</style>
