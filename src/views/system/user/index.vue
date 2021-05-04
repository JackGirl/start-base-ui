<template>
  <div>
    <a-card title="搜索">
      <a-form-model layout="inline" :model="search" :pagination="pager">
        <a-form-model-item label="用户名">
          <a-input v-model="search.username"/>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type='primary' @click="onSearch">查询</a-button>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type='primary' @click="createDrawVisible=true">添加</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-table :row-key="record=>record.id" :columns="columns"
               @chang="pageChange"
               :pagination="pager" :data-source="data">
        <template slot="accountLock" slot-scope="text,record">
          <a-switch checked-children="是" un-checked-children="否" @change="changeLock($event,record)"
                    v-model="record.accountLocked===1"/>
        </template>
        <template slot="enable" slot-scope="text,record">
          <a-switch checked-children="是" un-checked-children="否" @change="changeEnable($event,record)"
                    v-model="record.enable===1"/>
        </template>
        <template slot="action" slot-scope="text,record">
          <a-button type="link" @click="openEditUser(record)">编辑</a-button>
        </template>
      </a-table>
    </a-card>


    <div>
      <a-drawer
        :maskClosable="false"
        title="创建用户"
        :width="600"
        :visible="createDrawVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="createDrawVisible=false"
      >
        <a-form :form="userCreateForm" layout="vertical" hide-required-mark>
          <a-form-item label="姓名">
            <a-input v-decorator="[
                  'username',
                  {
                    rules: [{ required: true, message: 'Please enter user name' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="账号">
            <a-input v-decorator="[
                  'account',
                  {
                    rules: [{ required: true, message: 'Please enter user account' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="手机号">
            <a-input type="password" v-decorator="[ 'phone',]"/>
          </a-form-item>
          <a-form-item label="密码">
            <a-input type="password" v-decorator="[
                  'password',
                  {
                    rules: [{ required: true, message: 'Please enter user password' }],
                  },
                ]"/>
          </a-form-item>

          <a-form-item label="备注">
            <a-input v-decorator="['remark']"/>
          </a-form-item>
          <a-form-item >
            <a-button type="primary" @click="createUser">添加</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>

    <div id="editUserPanel">
      <a-drawer
        :maskClosable="false"
        title="修改用户"
        :width="600"
        :visible="editDrawVisible"
        :body-style="{ paddingBottom: '80px' }"
        @close="editDrawVisible=false">
        <a-tabs default-active-key="user" >
          <a-tab-pane key="user" tab="用户信息">
            <a-form :form="userEditForm" layout="vertical" hide-required-mark>
              <a-form-item label="姓名">
                <a-input v-decorator="[
                  'username',
                  {
                    rules: [{ required: true, message: 'Please enter user name' }],
                  },
                ]"/>
              </a-form-item>
              <a-form-item label="手机号">
                <a-input type="phone" v-decorator="[ 'phone',]"/>
              </a-form-item>
              <a-form-item >
                <a-input v-show="false"  v-decorator="[
                  'id',
                ]"/>
              </a-form-item>

              <a-form-item label="备注">
                <a-input v-decorator="['remark']"/>
              </a-form-item>
              <a-form-item >
                <a-button type="primary" @click="editUser">确定</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="role" tab="分配角色" >
            <a-checkbox-group
              :value="editModel.userRoles"
              name="roles"
              :options="editModel.rolesOption"
              @change="(checkedValues)=>editModel.userRoles = checkedValues"
            />
          </a-tab-pane>

        </a-tabs>
      </a-drawer>

    </div>
  </div>
</template>

<script>
import {listUser, updateUser, createUser,getRoleByUserId,updateUserAndPermission} from "@/api/system/user";
import {listRoles} from "@/api/system/role";
import {convertToLabelArr} from "@/utils/antComponentUtil";

const columns = [
  {
    title: '账号',
    dataIndex: 'account',
    key: 'account'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime'
  },
  {
    title: '账号锁定',
    dataIndex: 'accountLocked',
    key: 'accountLocked',
    scopedSlots: {customRender: 'accountLock'}

  },
  {
    title: '是否启用',
    dataIndex: 'enable',
    key: 'enable',
    scopedSlots: {customRender: 'enable'}
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'}
  }
];
export default {
  name: 'user',
  data() {
    return {
      search: {
        username: ''
      },
      editModel:{
        userRoles:[],
        rolesOption:[],
      },
      createDrawVisible: false,
      editDrawVisible:false,
      userCreateForm: this.$form.createForm(this),
      userEditForm: this.$form.createForm(this),
      data: [],
      columns: columns
    }
  },
  mounted() {
    this.loadUser({...this.pager});
  },
  methods: {
    loadUser(params) {
      listUser(params).then(res => {
        this.setPager(res)
        this.data = res.data.records;
      });
    },
    changeLock(checked, record) {
      updateUser({...record, accountLocked: checked ? 1 : 0}).then(res => {
        if (this.isSuccessRequest(res)) {
          checked ? record.accountLocked = 1 : record.accountLocked = 0;
          this.$notification['success']({
            description: '切换成功'
          })
        }
      })
    },
    changeEnable(checked, record) {
      updateUser({...record, enable: checked ? 1 : 0}).then(res => {
        if (this.isSuccessRequest(res)) {
          checked ? record.enable = 1 : record.enable = 0;
          this.$notification['success']({
            description: '切换成功'
          })
        }
      })
    },
    pageChange(pagination) {
      this.pager = pagination;
      this.loadUser({...this.pager, ...this.search});
    },
    onSearch() {
      this.pager.current = 1;
      this.loadUser({...this.pager, ...this.search});
    },
    createUser() {
      this.userCreateForm.validateFields((error, values) => {
        if (!error) {
          createUser(values).then(res => {
            if (this.isSuccessRequest(res)) {
              this.loadUser({...this.search, ...this.pager})
              this.userCreateForm.resetFields();
              this.createDrawVisible = false;
            }
          });
        }
      });
    },
    openEditUser(user){
      this.editDrawVisible = true;
      Promise.all([listRoles(),getRoleByUserId(user.id)])
      .then(res=>{
        const roles = res[0].data;
        const userRoles = res[1].data;
        this.editModel.rolesOption = convertToLabelArr(roles,"roleName","roleId");
        this.editModel.userRoles = userRoles.map(item=>{return item.roleId});
      })
      this.$nextTick(()=>{
        this.userEditForm.setFieldsValue({
          username:user.username,
          remark:user.remark,
          phone:user.phone,
          id:user.id
        })
      })
    },
    editUser(){
      this.userEditForm.validateFields((err,values)=>{
        if(!err){
          updateUserAndPermission({user:values,roles:this.editModel.userRoles}).then(res=>{
            if(this.isSuccessRequest(res)){
              this.editDrawVisible=false;
              this.$notification['success']({
                message: '已修改'
              })
              this.loadUser({...this.pager,...this.search});
            }
          });
        }
      })
    }


  },

}
</script>

<style scoped>

</style>