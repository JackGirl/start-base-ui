<template>
  <div>
    <a-card style="margin-top: 20px;height: 600px">
      <div style="margin: 10px">
        <a-button type="primary" @click="()=>{this.saveVisible=true;addForm.resetFields()}">添加应用</a-button>
      </div>
      <a-table bordered :pagination="false" :row-key="record=>record.menuId" :columns="columns" :data-source="apps">
        <div slot="appIcon" slot-scope="record">
          aaa
        </div>
        <div slot="action" slot-scope="text,record">
          <a-button type="link" @click="showEditForm(record)">编辑</a-button>
        </div>
      </a-table>
    </a-card>

    <!--删改菜单-->
    <a-modal :body-style="{height:'600px',overflowY:'auto'}" :visible="saveVisible" title="添加应用"
             @ok="saveApplication" @cancel="saveVisible=false" width="500px">
      <a-form :form="addForm">
        <a-form-item  label="应用名称">
          <a-input v-decorator="[
                   'appName',
                  {
                    rules: [{ required: true, message: '应用名必输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item  label="应用密钥">
          <a-input v-decorator="[
                   'appSecret',
                  {
                    rules: [{ required: true, message: '密钥必须输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item  label="应用类型">
          <a-radio-group  v-decorator="['appType',{initialValue:'WEB'}]" name="appTypeGroup" >
            <a-radio v-for="type in appType" :value="type.value">
              {{ type.name }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item  label="回调地址">
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
        <a-form-item  label="token有效时间(秒)">
          <a-input type="number" v-decorator="[
                   'tokenValidTime',
                  {
                    initialValue:7200,
                    rules: [{ required: true, message: 'token有效期必填' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item  label="refreshToken有效时间(秒)">
          <a-input type="number" v-decorator="[
                   'refreshTokenValidTime',
                  {
                    initialValue:7200,
                    rules: [{ required: true, message: 'token有效期必填' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item  label="是否自动授权">
          <a-radio-group name="autoGroup" v-decorator="['autoApproval',{initialValue:0}]" >
            <a-radio  :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item  label="是否内部应用">
          <a-radio-group name="internalGroup" v-decorator="['internal',{initialValue:0}]">
            <a-radio  :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item  label="是否有效">
          <a-radio-group name="statusGroup" v-decorator="['status',{initialValue:1}]">
            <a-radio  :value="1">
              是
            </a-radio>
            <a-radio :value="0">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>


    </a-modal>

  </div>
</template>

<script>
import {createApp,listApplication,updateApp} from "@/api/system/application";

const appType = [{value:'WEB',name:'web应用'},{name:'app',VALUE:'APP'},{value:'APPLETS',name:'小程序'}]
const grantTypes= ["authorization_code","password","implicit","refresh_token","client_credentials"]
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
    title: 'appType',
    dataIndex: 'appType',
    key: 'appType',
  },
  {
    title: '应用图标',
    key: 'appIcon',
    scopedSlots: {customRender: 'appIcon'}
  },
  {
    title: '回调地址',
    dataIndex: 'redirectUri',
    key: 'redirectUri'
  },
  {
    title: 'scope',
    dataIndex: 'scope',
    key: 'scope',
  },
  {
    title: '认证类型',
    key: 'grantTypes',
  },
  {
    title: 'token有效期(秒)',
    key: 'tokenValidSeconds',
    dataIndex: 'tokenValidSeconds',
  },
  {
    title: 'refreshToken有效期',
    key: 'refreshTokenValidTime',
    dataIndex: "refreshTokenValidTime"
  },
  {
    title: '是否自动授权',
    key: 'autoApproval',
    dataIndex: "autoApproval",
    customRender(text){
      return text==1?"是":"否"
    }
  },
  {
    title: '是否内部应用',
    key: 'internal',
    dataIndex: "internal",
    customRender(text){
      return text==1?"是":"否"
    }
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: "status",
    customRender(text){
      return text==1?"是":"否"
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
  data(){
    return{
      apps:[],
      appType:appType,
      columns:columns,
      addForm:this.$form.createForm(this),
      saveVisible:false,
      grantTypes:grantTypes
    }
  },
  methods:{
    saveApplication(){
      this.addForm.validateFields((err,values)=>{
        if(!err){
          console.info(values)
        }
      })
    },
    showEditForm(app){}
  }
}
</script>

<style scoped>

</style>