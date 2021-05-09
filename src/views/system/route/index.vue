<template>
  <div>
    <a-card style="margin-top: 20px;height: 600px">
      <div style="margin: 10px">
        <a-button type="primary" @click="openAdd">添加路由</a-button>
      </div>
      <a-table :pagination="false" :row-key="record=>record.serviceId" :columns="columns" :data-source="servers">
        <div slot="action" slot-scope="text,record">
          <a-button type="link" @click="openEditServer(record)">编辑</a-button>
        </div>
      </a-table>
    </a-card>

    <!--删改菜单-->
    <a-modal :body-style="{height:'600px',overflowY:'auto'}" :visible="reuseFormVisible" :title="actionTitle"
             @ok="saveServer" @cancel="reuseFormVisible=false" width="500px">
      <a-form :form="reuseForm">

        <a-form-item  label="服务id">
          <a-input v-decorator="[
                   'serviceId',
                  {
                    rules: [{ required: true, message: '服务id必须输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="服务名">
          <a-input v-decorator="[
                   'serviceName',
                  {
                    rules: [{ required: true, message: '服务名必须输入 名称为注册中心服务名称' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="匹配路径">
          <a-input v-decorator="[
                   'routerMatch',
                  {
                    rules: [{ required: true, message: '路由匹配必须输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="是否可用">
          <a-radio-group name="statusGroup" v-decorator="['status',{initialValue:1}]">
            <a-radio :value="1">
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
import {listServer,updateResourceServer,addResourceServer} from "@/api/system/route";

const columns = [
  {
    title: '资源服务ID',
    dataIndex: 'serviceId',
    key: 'serviceId'
  },
  {
    title: '服务名称',
    dataIndex: 'serviceName',
    key: 'serviceName'
  },
  {
    title: '路由匹配',
    dataIndex: 'routerMatch',
    key: 'routerMatch',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: "createTime"
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender(text){
      return text===1?'可用':"不可用"
    }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'}
  },

];

export default {
  name: 'user',
  data() {
    return {
      servers:[],
      columns:columns,
      reuseFormVisible:false,
      reuseForm:this.$form.createForm(this),
      actionType:'add',
      actionTitle:'添加服务'
    }
  },
  mounted() {
    this.serverList();
  },
  methods: {
    serverList(){
      listServer({}).then(res=>this.servers = res.data);
    },
    saveServer(){
      this.reuseForm.validateFields((err,values)=>{
        if(!err){
            if(this.actionType==='add'){
              addResourceServer({...values}).then(res=>{
                if(this.isSuccessRequest(res)){
                  this.serverList();
                  this.reuseFormVisible = false
                }
              })
            }else{
              updateResourceServer({...values}).then(res=>{
                if(this.isSuccessRequest(res)){
                  this.serverList();
                  this.reuseFormVisible = false
                }
              })
            }
        }
      })
    },
    openAdd(){
      this.reuseFormVisible = true;
      this.actionType ='add'
      this.actionTitle = "添加服务"
      this.$nextTick(()=>{
        this.reuseForm.setFieldsValue({
          serviceId:'',
          serviceName:'',
          status:1,
          routerMatch:''
        })
      })
    },
    openEditServer(server){
      this.reuseFormVisible = true;
      this.actionType ='edit'
      this.actionTitle = "编辑服务"
      this.reuseForm.getFieldDecorator('serviceId',{disabled:true})
      this.$nextTick(()=>{
        this.reuseForm.setFieldsValue({
          serviceId:server.serviceId,
          serviceName:server.serviceName,
          status:server.status,
          routerMatch:server.routerMatch
        })
      })
    }

  }
}
</script>

<style scoped>

</style>