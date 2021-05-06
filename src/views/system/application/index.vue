<template>
  <div>
    <a-card style="margin-top: 20px;height: 600px">
      <div style="margin: 10px">
        <a-button type="primary" @click="()=>{this.saveVisible=true;addForm.resetFields()}">添加应用</a-button>
      </div>
      <a-table :row-key="record=>record.appId" bordered :pagination="false" :columns="columns" :data-source="apps">
        <div slot="appIcon" slot-scope="record">
          aaa
        </div>
        <div slot="action" slot-scope="text,record">
          <a-button type="link" @click="showEditForm(record)">编辑</a-button>
          <a-button type="link" @click="showEditAuthorities(record)">权限配置</a-button>
        </div>
      </a-table>
    </a-card>

    <!--删改-->
    <a-modal :body-style="{height:'600px',overflowY:'auto'}" :visible="saveVisible" title="添加应用"
             @ok="saveApplication" @cancel="saveVisible=false" width="500px">
      <a-form :form="addForm">
        <a-form-item label="应用名称">
          <a-input v-decorator="[
                   'appName',
                  {
                    rules: [{ required: true, message: '应用名必输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="应用密钥">
          <a-input type="password" v-decorator="[
                   'appSecret',
                  {
                    rules: [{ required: true, message: '密钥必须输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="应用类型">
          <a-radio-group v-decorator="['appType',{initialValue:'WEB'}]" name="appTypeGroup">
            <a-radio v-for="type in appType" :value="type.value">
              {{ type.name }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="回调地址">
          <a-input v-decorator="[
                   'redirectUri',
                  {
                    rules: [{ required: true, message: '回调地址必填多个逗号隔开' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="认证类型">
          <a-checkbox-group
            v-decorator="['grantTypes', { valuePropName: 'checked',rules: [{ required: true, message: '认证类型必选' }] }]"
            name="grantGroup"
            :options="grantTypes"
          />
        </a-form-item>
        <a-form-item label="token有效时间(秒)">
          <a-input type="number" v-decorator="[
                   'tokenValidSeconds',
                  {
                    initialValue:7200,
                    rules: [{ required: true, message: 'token有效期必填' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="refreshToken有效时间(秒)">
          <a-input type="number" v-decorator="[
                   'refreshTokenValidSeconds',
                  {
                    initialValue:7200,
                    rules: [{ required: true, message: 'token有效期必填' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="是否自动授权">
          <a-radio-group name="autoGroup" v-decorator="['autoApproval',{initialValue:0}]">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否内部应用">
          <a-radio-group name="internalGroup" v-decorator="['internal',{initialValue:0}]">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否有效">
          <a-radio-group name="statusGroup" v-decorator="['status',{initialValue:1}]">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="扩展信息(json格式)">
          <a-input type="textarea" v-decorator="[ 'jsonInformation', ]"/>
        </a-form-item>
      </a-form>


    </a-modal>

    <a-modal :body-style="{height:'600px',overflowY:'auto'}" :visible="editVisible" title="修改应用"
             @ok="editApplication" @cancel="editVisible=false" width="500px">
      <a-form :form="editForm" ref="editForm">
        <a-form-item label="应用名称">
          <a-input v-decorator="[
                   'appName',
                  {
                    rules: [{ required: true, message: '应用名必输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item v-show="false">
          <a-input v-decorator="[ 'appId',  ]"/>
        </a-form-item>
        <a-form-item label="应用类型">
          <a-radio-group v-decorator="['appType',{initialValue:'WEB'}]" name="appTypeGroup">
            <a-radio v-for="type in appType" :value="type.value">
              {{ type.name }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="回调地址">
          <a-input v-decorator="[
                   'redirectUri',
                  {
                    rules: [{ required: true, message: '回调地址必填多个逗号隔开' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="认证类型">
          <a-checkbox-group
            v-decorator="['grantTypes', { initialValue:[],rules: [{ required: true, message: '认证类型必选' }] }]"
            name="grantGroup"
            :options="grantTypes"
          />
        </a-form-item>
        <a-form-item label="token有效时间(秒)">
          <a-input type="number" v-decorator="[
                   'tokenValidSeconds',
                  {
                    rules: [{ required: true, message: 'token有效期必填' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="refreshToken有效时间(秒)">
          <a-input type="number" v-decorator="[
                   'refreshTokenValidSeconds',
                  {
                    rules: [{ required: true, message: 'token有效期必填' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="是否自动授权">
          <a-radio-group name="autoGroup" v-decorator="['autoApproval',{initialValue:0}]">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否内部应用">
          <a-radio-group name="internalGroup" v-decorator="['internal',{initialValue:0}]">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否有效">
          <a-radio-group name="statusGroup" v-decorator="['status',{initialValue:1}]">
            <a-radio :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>

        </a-form-item>
        <a-form-item label="扩展信息(json格式)">
          <a-input type="textarea" v-decorator="[ 'jsonInformation', ]"/>
        </a-form-item>
      </a-form>


    </a-modal>


    <a-modal :body-style="{height:'600px',overflowY:'auto'}" :visible="authoritiesModel.showVisible" title="修改应用"
             @cancel="authoritiesModel.showVisible=false" width="70%" :footer="null" :maskClosable="false">
      <a-transfer
        :row-key="record => record.resourceId"
        :titles="['可选','已选']"
        :data-source="authoritiesModel.resources"
        :target-keys="authoritiesModel.selectedRowKeys"
        show-search
        :filter-option="(inputValue, item) => item.resourceName.indexOf(inputValue) !== -1"
        :show-select-all="false"
        @change="changeAuthority"
      >
        <template
          slot="children"
          slot-scope="{
          props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
        >
          <a-table
            :loading="authoritiesModel.loadingFlag"
            :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          "
            :columns="authoritiesModel.AuthorityColumns"
            :data-source="filteredItems"
            size="small"
          >
            <template slot="expireTime" slot-scope="text,record">
              <div v-if="direction==='left'">
              </div>
              <div v-else>
                <a-date-picker valueFormat="YYYY-MM-DD HH:mm:ss" showTime :defaultValue="record.expireTime"
                               @change="changeAuthorityTime($event,record)"/>
              </div>
            </template>
          </a-table>
        </template>
      </a-transfer>

    </a-modal>

  </div>
</template>

<script>
import {
  createApp,
  listApplication,
  updateApp,
  listAppAuthorities,
  updateAppAuthority,
  addAppAuthorities,
  removeAppAuthorities
} from "@/api/system/application";
import {listResources} from "@/api/system/resources";

import {concat, difference, pullAllBy,findIndex} from "lodash/index";

const appType = [{value: 'WEB', name: 'web应用'}, {name: 'app', VALUE: 'APP'}, {value: 'APPLETS', name: '小程序'}]
const grantTypes = ["authorization_code", "password", "implicit", "refresh_token", "client_credentials"]
const AuthorityColumns = [

  {
    title: '资源服务器',
    dataIndex: 'resourceServerName',
    key: 'resourceServerName'
  },
  {
    title: '接口名',
    dataIndex: 'resourceName',
    key: 'resourceName'
  },
  {
    title: '接口',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: '到期时间',
    key: 'expireTime',
    scopedSlots: {customRender: 'expireTime'}
  },
]
const columns = [
  {
    title: '应用id',
    dataIndex: 'appId',
    key: 'appId'
  },
  {
    title: '应用名称',
    dataIndex: 'appName',
    key: 'appName'
  },
  {
    title: 'app类型',
    dataIndex: 'appType',
    key: 'appType',
  },
  {
    title: '回调地址',
    dataIndex: 'redirectUri',
    key: 'redirectUri'
  },
  {
    title: '认证类型',
    key: 'grantTypes',
    dataIndex: "grantTypes"
  },
  {
    title: 'token有效期(秒)',
    key: 'tokenValidSeconds',
    dataIndex: 'tokenValidSeconds',
  },
  {
    title: 'refreshToken有效期',
    key: 'refreshTokenValidSeconds',
    dataIndex: "refreshTokenValidSeconds"
  },
  {
    title: '是否自动授权',
    key: 'autoApproval',
    dataIndex: "autoApproval",
    customRender(text) {
      return text == 1 ? "是" : "否"
    }
  },
  {
    title: '是否内部应用',
    key: 'internal',
    dataIndex: "internal",
    customRender(text) {
      return text == 1 ? "是" : "否"
    }
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: "status",
    customRender(text) {
      return text == 1 ? "是" : "否"
    }
  },
  {
    title: '创建日期',
    key: 'createTime',
    dataIndex: "createTime"
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'}
  },
];

export default {
  name: 'application',
  data() {
    return {
      search: {
        appId: '',
        appName: ''
      },
      apps: [],
      appType: appType,
      columns: columns,
      editForm: this.$form.createForm(this),
      addForm: this.$form.createForm(this),
      editVisible: false,
      saveVisible: false,
      grantTypes: grantTypes,
      authoritiesModel: {
        appId: '',
        showVisible: false,
        //选中项
        selectedRowKeys: [],
        //可选权限
        resources: [],
        AuthorityColumns: AuthorityColumns,
        loadingFlag: false

      }
    }
  },
  mounted() {
    this.loadApps({...this.search, ...this.pager})
  },
  methods: {
    loadApps(params) {
      listApplication(params).then(res => {
        this.apps = res.data.records;
        this.setPager(res);
      })
    },
    saveApplication() {
      this.addForm.validateFields((err, values) => {
        if (!err) {
          createApp({...values, grantTypes: values.grantTypes + ''}).then(res => {
            if (this.isSuccessRequest(res)) {
              this.saveVisible = false;
              this.$notification['success']({
                message: "已添加"
              });
              this.loadApps({...this.search, ...this.pager})
            }
          })
        }
      })
    },
    showEditForm(app) {
      console.info(app.grantTypes.split(","))
      this.editVisible = true;
      this.$nextTick(() => {
        this.editForm.setFieldsValue({
          appId: app.appId,
          appName: app.appName,
          status: app.status,
          internal: app.internal,
          refreshTokenValidSeconds: app.refreshTokenValidSeconds,
          tokenValidSeconds: app.tokenValidSeconds,
          autoApproval: app.autoApproval,
          redirectUri: app.redirectUri,
          grantTypes: app.grantTypes.split(","),
          appType: app.appType,
          appIcon: app.appIcon,
          jsonInformation: app.jsonInformation
        })
      })

    },
    getRowSelection({disabled, selectedKeys, itemSelectAll, itemSelect}) {
      return {
        getCheckboxProps: item => ({props: {disabled: disabled || item.disabled}}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({key}) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({key}, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    },
    editApplication() {
      this.editForm.validateFields((err, values) => {
        if (!err) {
          updateApp({
            ...values, grantTypes: values.grantTypes + ''
          }).then(res => {
            if (this.isSuccessRequest(res)) {
              this.editVisible = false;
              this.$notification['success']({
                message: "已修改"
              });
              this.loadApps({...this.search, ...this.pager})
            }
          })
        }
      })
    },
    loadAppAuthoritiesByAppId(appId) {
      this.authoritiesModel.loadingFlag = true;
      Promise.all([ listAppAuthorities(appId),listResources({status: 1}),])
        .then(res => {
          this.authoritiesModel.loadingFlag = false;
          const resources = res[1].data;
          const authorities = res[0].data;
          let resultResources = pullAllBy(resources, authorities, "resourceId");
          const result = concat(resultResources, authorities);
          this.authoritiesModel.resources =result
          this.authoritiesModel.selectedRowKeys = authorities.map(row => row.resourceId)
        }).catch(() => this.authoritiesModel.loadingFlag = false);

    },
    showEditAuthorities(app) {
      this.loadAppAuthoritiesByAppId(app.appId);
      this.authoritiesModel.showVisible = true;
      this.authoritiesModel.appId = app.appId;
      //查找app已有权限
    },
    changeAuthority(targetKeys, direction, moveKeys) {
      //movekey为 left就是删除
      if (direction === 'left') {
          let removeKeys = [];
          moveKeys.forEach((key)=>{
            let idx = findIndex(this.authoritiesModel.resources,function (item){return item.resourceId === key});
            removeKeys.push(this.authoritiesModel.resources[idx].appResourceId);
          })
        removeAppAuthorities(removeKeys).then(res=>{
          if(this.isSuccessRequest(res)){
            this.$notification['success']({
              message:'移除'
            })
          }
          this.loadAppAuthoritiesByAppId(this.authoritiesModel.appId);

        })
      } else {
        //添加权限
        addAppAuthorities({appId:this.authoritiesModel.appId,authorities:moveKeys}).then(res=>{
          if(this.isSuccessRequest(res)){
            this.$notification['success']({
              message:'已添加'
            })
          }
          this.loadAppAuthoritiesByAppId(this.authoritiesModel.appId);
        })
      }
      // this.authoritiesModel.selectedRowKeys = targetKeys;
    },
    changeAuthorityTime(time, record) {
      updateAppAuthority({expireTime:time,relationId:record.appResourceId}).then(res=>{
        this.$notification['info']({
          message:res.message
        })
      })
    },



  }
}
</script>

<style scoped>

</style>