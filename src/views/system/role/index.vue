<template>
  <div>
    <a-card  >
      <a-button type="primary" @click="createRoleVisible=true">添加</a-button>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-table :row-key="record=>record.roleId" :columns="columns" :pagination="false" :data-source="data">
        <div slot="action" slot-scope="text,record">
          <a-button type="link" @click="openEditRole(record)">编辑</a-button>
        </div>
      </a-table>
    </a-card>

    <a-modal v-model="createRoleVisible" title="添加角色" >
      <a-form :form="roleCreateForm" layout="vertical" hide-required-mark>
        <a-form-item label="角色名">
          <a-input v-decorator="[
                  'roleName',
                  {
                    rules: [{ required: true, message: '请输入角色名 类似 员工' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="角色标识">
          <a-input  v-decorator="[
                  'roleValue',
                  {
                    rules: [{ required: true, message: '请输入角色标识 类似 ROLE_USER',pattern:'^ROLE_\\w' }],
                  },
                ]"/>
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-button type="primary" @click="createRole">提交</a-button>
      </template>
    </a-modal>

    <a-drawer :visible="editRoleVisible" title="编辑角色" @close="editRoleVisible=false" width="800px">
      <a-form :form="roleEditForm" layout="vertical" hide-required-mark>
        <a-form-item label="角色名">
          <a-input style="width: 200px;" v-decorator="[
                  'roleName',
                  {
                    rules: [{ required: true, message: '请输入角色名 类似 员工' }],
                  },
                ]"/>
        </a-form-item>
      </a-form>
      <a-tree
        show-line
        v-model="editFormModel.checkedMenu"
        checkable
        :replaceFields="{key:'menuId',title:'menuName',children:'children'}"
        auto-expand-parent
        blockNode
        defaultExpandAll
        :tree-data="menuData"
      >

        <div slot="customTitle" slot-scope="menu">
          <span>
            {{menu.menuName}}
          </span>
          <a-checkbox-group v-model="editFormModel.checkedAction" :options="menu.actions" v-if="menu.actions&&menu.actions.length>0"  @change="changeAction">
            <span slot="label" slot-scope="option" style="color: red">{{ checkBoxValue(option) }}</span>
          </a-checkbox-group>
        </div>

      </a-tree>
      <a-form-item >
        <a-button type="primary" @click="editRole">提交</a-button>
      </a-form-item>
    </a-drawer>

  </div>
</template>

<script>
import {listRoles} from "@/api/system/role";
import {listMenus} from "@/api/system/menu";

const columns = [
  {
    title:'角色名',
    dataIndex:'roleName',
    key:'roleName'
  },
  {
    title:'角色标识',
    dataIndex:'roleValue',
    key:'roleValue'
  },
  {
    title:'创建时间',
    dataIndex:'createTime',
    key:'createTime'
  },
  {
    title:'更新时间',
    dataIndex:'updateTime',
    key:'updateTime'
  },
  {
    title:'操作',
    key:'action',
    scopedSlots:{customRender:'action'}
  }
];
export default {
  name: 'role',
  data(){
    return{
      menuData:[],
      editFormModel:{
        checkedMenu:[],
        checkedAction:[]
      },
      data:[],
      createRoleVisible:false,
      editRoleVisible:false,
      roleEditForm:this.$form.createForm(this),
      columns:columns,
      roleCreateForm:this.$form.createForm(this)
    }
  },
  mounted() {
    this.loadRole();
  },
  methods:{
    loadRole(){
      listRoles().then(res=>this.data = res.data)
    },
    createRole(){

    },
    openEditRole(role){
      console.info(role)
      this.editRoleVisible = true;
      this.roleEditForm.getFieldDecorator('roleName',{initialValue:role.roleName})
      listMenus().then(res=>{
        let menu  =res.data;
        setScopeSlot(menu);
        this.menuData = menu;
      });
    },
    editRole(){
      console.info(this.editFormModel)
    },
    changeAction(e){
      console.info(e);
    },
    changeMenu(e){
      console.info(e);

    },
    checkBoxValue(e){
      return"1";
    }

  }
}

function setScopeSlot(arr){
  arr.forEach(v=>{
    v.scopedSlots= {title:'customTitle'}
    if(v.children&&v.children.length>0){
      setScopeSlot(v.children)
    }
  })
}
</script>

<style scoped>

</style>