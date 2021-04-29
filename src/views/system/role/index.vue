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

    <a-drawer :visible="editRoleVisible" title="编辑角色" @close="editRoleVisible=false" width="50%">
      <a-form :form="roleEditForm" layout="vertical" hide-required-mark>
        <a-form-item label="角色名">
          <a-input style="width: 200px;" v-decorator="[
                  'roleName',
                  {
                    rules: [{ required: true, message: '请输入角色名 类似 员工' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="editRole">提交</a-button>
        </a-form-item>
      </a-form>
      <a-table :columns="[
        {title:'菜单名称',
        dataIndex:'menuName', width:'250px',
        key:'menuName'},
        {title:'操作按钮',
        key:'action',
        scopedSlots:{customRender:'action'}
        }]" :data-source="menuData" :row-key="record=>record.menuId"
               :pagination="false"
               :rowSelection="{type:'checkbox',onChange:changPermission}">
        <template slot="action" slot-scope="text,record">
          <a-checkbox-group
            v-model="editFormModel.checkedAction"
            name="menuGroup"
            :options="record.actions"
          />
        </template>
      </a-table>


    </a-drawer>

  </div>
</template>

<script>
import {listRoles, rolePermission} from "@/api/system/role";
import {listMenus} from "@/api/system/menu";
import {delArrElement,findElementInTreeArr} from "@/utils";


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
      editFormModel: {
        checkedMenu: [],
        checkedAction: []
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

    },
    openEditRole(role) {
      this.editRoleVisible = true;
      this.roleEditForm.getFieldDecorator('roleName', {initialValue: role.roleName})
      listMenus().then(res => {
        let menu = res.data;
        setActionLabel(menu);
        this.menuData = menu;
      });
      rolePermission(role.roleId).then(res => {
      })
    },
    editRole() {
      console.info(this.editFormModel)
    },
    /**
     * 选中菜单
     * @param selectedRowKeys
     * @param selectedRows
     */
    changPermission(selectedRowKeys, selectedRows) {

      let actions = this.editFormModel.checkedAction;
      this.editFormModel.checkedMenu.forEach(menuId => {
        let exist = selectedRows.filter(row => row.menuId === menuId);
        if (!exist || exist.length === 0) {
          //拿到已经没选择的菜单
          let menu = findElementInTreeArr(this.menuData,"menuId",menuId,"children")
          //移除当前菜单下的action
          if (menu.actions && menu.actions.length > 0) {
            menu.actions.forEach(ac => {
              delArrElement(actions, ac.actionId)
            })
          }
        }
      })
      this.editFormModel.checkedMenu = selectedRowKeys;
      this.editFormModel.checkedAction = actions;
    }


  }
}

function setActionLabel(arr) {
  arr.forEach(v => {
    if (v.actions && v.actions.length > 0) {
      v.actions.forEach(ac => {
        ac.label = ac.actionName;
        ac.value = ac.actionId;
      })
    }
    if (v.children && v.children.length > 0) {
      setActionLabel(v.children)
    }
  })
}
</script>

<style scoped>

</style>