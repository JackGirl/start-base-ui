<template>
  <div>
    <a-card>
      <a-button type="primary" @click="createRoleVisible=true">添加</a-button>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-table :row-key="record=>record.roleId" :columns="columns" :pagination="false" :data-source="data">
        <div slot="action" slot-scope="text,record">
          <a-button type="link" @click="openEditRole(record)">编辑</a-button>
        </div>
      </a-table>
    </a-card>

    <a-modal v-model="createRoleVisible" title="添加角色">
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
          <a-input v-decorator="[
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

    <a-modal :body-style="{height:'600px',overflowY:'auto'}" :visible="editRoleVisible" class="editRoleModal"  title="编辑角色" @ok="editRole" @cancel="editRoleVisible=false" width="50%">
      <a-tabs default-active-key="role" >
        <a-tab-pane key="role" tab="角色菜单">
          <a-form :form="roleEditForm" layout="inline" hide-required-mark>
            <a-form-item label="角色名">
              <a-input style="width: 200px;" v-decorator="[
                  'roleName',
                  {
                    rules: [{ required: true, message: '请输入角色名 类似 员工' }],
                  },
                ]"/>

            </a-form-item>
            <a-form-item>
              <a-input v-show="false" style="width: 200px;" v-decorator="[
                  'roleId',
                ]"/>
            </a-form-item>
            <a-form-item label="角色权限标识">
              <a-input style="width: 200px;" v-decorator="[
                   'roleValue',
                  {
                    rules: [{ required: true, message: '请输入角色标识 类似 ROLE_USER',pattern:'^ROLE_\\w' }],
                  },
                ]"/>
            </a-form-item>

          </a-form>
          <a-table :columns="[
        {title:'菜单名称',
        dataIndex:'menuName', width:'250px',
        key:'menuName'},
        ]" :data-source="menuData"   v-if="menuData.length>0" defaultExpandAllRows :row-key="record=>record.menuId"
                   :pagination="false"
                   :rowSelection="{type:'checkbox',onChange:changPermission,selectedRowKeys:editFormModel.checkedMenu}">
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="permission" tab="角色权限">
          <a-transfer
            :rowKey="record => record.resourceId"
            :titles="['可选','已选']"
            :data-source="resources"
            :target-keys="targetKeys"
            show-search
            :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
            :show-select-all="false"
            @change="(newKey)=>this.targetKeys = newKey"
          >
            <template
              slot="children"
              slot-scope="{
          props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
            >
              <a-table
                :row-selection="
            getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })
          "
                :columns="[ {
                dataIndex: 'title',
                title: '接口名',
              },{
                dataIndex: 'resourceServerName',
                title: '服务器',
              }]"
                :data-source="filteredItems"
                size="small"
              />
            </template>
          </a-transfer>
        </a-tab-pane>
      </a-tabs>



    </a-modal>

  </div>
</template>

<script>
import difference from 'lodash/difference';

import {listRoles, listRoleMenu,updateRolePermissions,newRole,listRoleResources} from "@/api/system/role";
import {listMenus} from "@/api/system/menu";
import {listResources} from "@/api/system/resources";
import {listToTree} from "@/utils";

const columns = [
  {
    title: '角色名',
    dataIndex: 'roleName',
    key: 'roleName'
  },
  {
    title: '角色标识',
    dataIndex: 'roleValue',
    key: 'roleValue'
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
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'}
  }
];
export default {
  name: 'role',
  data() {
    return {
      menuData: [],
      resources:[],
      //选中打权限
      targetKeys:[],
      editFormModel: {
        checkedMenu: [],
      },

      data: [],
      createRoleVisible: false,
      editRoleVisible: false,
      roleEditForm: this.$form.createForm(this),
      columns: columns,
      roleCreateForm: this.$form.createForm(this)
    }
  },
  mounted() {
    this.loadRole();
  },
  methods: {
    loadRole() {
      listRoles().then(res => this.data = res.data)
    },
    createRole() {
      this.roleCreateForm.validateFields((err,values)=>{
        if(!err){
          newRole(values).then((res)=>{
            if(this.isSuccessRequest(res)){
              this.loadRole();
              this.createRoleVisible = false;
              this.$notification['success']({
                message:'已添加'
              })
            }
          })
        }
      })
    },
    openEditRole(role) {
      Promise.all([listRoleResources(role.roleId),listResources({status:1}),listMenus(),listRoleMenu(role.roleId)])
      .then(res=>{
        let roleResources = res[0].data;
        this.targetKeys = roleResources.map(r=>r.resourceId);

        let resources = res[1].data;
        resources.forEach(resource=>{
          resource.key = resource.resourceId;
          resource.title = resource.resourceName;
        });
        this.resources = resources;

        let menu = res[2].data;
        let tree = [];
        listToTree(menu,tree,"0",'menuId','parentId')
        this.menuData = tree;

        let roleMenu = res[3].data;
        let mu = []
        roleMenu.forEach(v=>mu.push(v.menuId))
        this.editFormModel.checkedMenu = mu;


      });

      this.editRoleVisible = true;
      this.roleEditForm.getFieldDecorator('roleName', {initialValue: role.roleName})
      this.roleEditForm.getFieldDecorator('roleId', {initialValue: role.roleId})

    },
    editRole() {
      let values = this.roleEditForm.getFieldsValue();
      updateRolePermissions({...values,
        menus:this.editFormModel.checkedMenu,
        authorities:this.targetKeys
      }).then(res=>{
        if(this.isSuccessRequest(res)){
          this.editRoleVisible = false;
          this.$notification['success']({
            message:'已修改'
          })
          this.loadRole();
        }
      })
    },
    /**
     * 选中菜单
     * @param selectedRowKeys
     * @param selectedRows
     */
    changPermission(selectedRowKeys, selectedRows) {
      this.editFormModel.checkedMenu = selectedRowKeys;
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled }}),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys)
          itemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected)
        },
        selectedRowKeys: selectedKeys
      }
    }


  }
}


</script>

<style scoped>

</style>