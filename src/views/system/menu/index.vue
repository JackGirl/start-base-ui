<template>
  <div>
    <a-card style="margin-top: 20px;">
      <div style="margin: 10px">
        <a-button type="primary" @click="openAdd">添加菜单</a-button>
      </div>
      <a-table height="600px" :pagination="false" :row-key="record=>record.menuId" :columns="menuColumns" :data-source="menuData">
        <div slot="icon" slot-scope="record">
          <a-icon :type="record.icon"/>
        </div>
        <div slot="action" slot-scope="text,record">
          <a-button type="link" @click="openMenuEdit(record)">编辑</a-button>
        </div>
      </a-table>
    </a-card>

    <!--删改菜单-->
    <a-modal :body-style="{height:'600px',overflowY:'auto'}" :visible="reuseFormVisible" :title="modalTitle"
             @ok="saveOrUpdateMenu" @cancel="reuseFormVisible=false" width="700px">
      <a-form :form="reuseForm">
        <a-form-item  label="上级菜单">
          <a-select
            show-search
            mode="default"
            v-model="reuseModal.pid"
            placeholder="不选为根菜单"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="(e)=>{this.filteredMenu = this.sourceData.filter(v=>e?v.menuName.indexOf(e)!=-1:v);}"
            @change="(e)=>{this.reuseModal.pid = e;this.filteredMenu = this.sourceData.filter(v=>e?v.menuName.indexOf(e)!=-1:v);}"
          >
            <a-select-option v-for="d in filteredMenu" :value="d.menuId" :key="d.menuId">
              {{ d.menuName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item  label="菜单名称">
          <a-input v-decorator="[
                   'menuName',
                  {
                    rules: [{ required: true, message: '菜单名必输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="菜单路径">
          <a-input v-decorator="[
                   'path',
                  {
                    rules: [{ required: true, message: '菜单名必输入' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="菜单组件">
          <a-input placeholder="/system/user...." v-decorator="[
                   'component',
                ]"/>
        </a-form-item>
        <a-form-item label="链接类型">
          <a-input placeholder="默认null为组件 _blank外部链接" v-decorator="[
                   'target',  ]"/>
        </a-form-item>
        <a-form-item label="优先级">
          <a-input v-decorator="[
                   'priority',
                  {
                    rules: [{ required: true, message: '一般父子组件使用' }],
                  },
                ]"/>
        </a-form-item>
        <a-form-item label="默认跳转">
          <a-input placeholder="/system/user...." v-decorator="[
                   'redirect', ]"/>
        </a-form-item>
        <a-form-item label="图标">
          <IconSelect :prefixCls="'iconSelect'" :value="reuseModal.icon" @change="($event)=>reuseModal.icon=$event"/>
        </a-form-item>

      </a-form>


    </a-modal>

  </div>
</template>

<script>
import {listMenus, updateMenu, removeMenu,createMenu} from "@/api/system/menu";
import IconSelect from "@/components/IconSelector/IconSelector";
import {listToTree} from "@/utils";
import {isSuccessRequest} from "@/utils/request";

const columns = [
  {
    title: '菜单名',
    dataIndex: 'menuName',
    key: 'menuName'
  },
  {
    title: '路由地址',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: '链接类型',
    dataIndex: 'target',
    key: 'target',
    customRender(text) {
      return text === '_blank' ? '外部' : '内部组件'
    }
  },
  {
    title: '图标',
    key: 'icon',
    scopedSlots: {customRender: 'icon'}
  },
  {
    title: '组件路径',
    dataIndex: 'component',
    key: 'component'
  },
  {
    title: '默认跳转',
    dataIndex: 'redirect',
    key: 'redirect',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'}
  }
];

export default {
  name: 'user',
  components: {IconSelect},
  data() {
    return {
      menuData: [],
      sourceData: [],
      filteredMenu: [],
      menuColumns: columns,
      reuseForm: this.$form.createForm(this),
      reuseFormVisible: false,
      modalTitle: '新增菜单',
      reuseModal: {
        icon: '',
        pid: '',
        actionType: 'add',
        menuId: ''
      }
    }
  },
  mounted() {
    this.loadMenu();
  },
  methods: {
    loadMenu() {
      listMenus().then(res => {
        const data = [];
        this.sourceData = res.data;
        listToTree(res.data, data, "0", 'menuId', 'parentId')
        this.menuData = data
      });
    },
    openAdd() {
      this.reuseFormVisible = true;
      /**
       * 这里赋不了  有时间再看 。。。。。懂得都懂
       */
      this.$nextTick(()=> this.reuseForm.setFieldsValue({
        'menuName': '',
        "path":'',
        "component": '',
        "target":null,
        'priority': 0,
        "redirect": null
      }))
      this.modalTitle = "添加菜单";
      this.reuseModal.pid = 0;
      this.reuseModal.icon='';
      this.reuseModal.actionType = 'add';

    },
    openMenuEdit(menu) {
      this.reuseFormVisible = true;
      this.modalTitle = "修改菜单";
      this.reuseModal.actionType = 'edit';
      this.$nextTick(()=>{
        this.reuseForm.setFieldsValue({
          'menuName': menu.menuName,
          "path": menu.path,
          "component": menu.component,
          "target": menu.target,
          'priority': menu.priority,
          "redirect": menu.redirect
        })
      })

      this.reuseModal.icon = menu.icon;
      this.reuseModal.pid = menu.parentId
      this.reuseModal.menuId = menu.menuId;
    },
    saveOrUpdateMenu() {
      this.reuseForm.validateFields((err, values) => {
        if (!err) {
          if (this.reuseModal.actionType == 'add') {
            createMenu({...values,parentId:this.reuseModal.pid,icon:this.reuseModal.icon})
            .then(res=>{
              if(isSuccessRequest(res)){
                this.reuseFormVisible = false;
                this.$notification['success']({
                  message:'已添加'
                })
                this.loadMenu();
              }
            })
          } else {
              updateMenu({...values,parentId:this.reuseModal.pid,icon:this.reuseModal.icon,menuId:this.reuseModal.menuId})
            .then(res=>{
              if(isSuccessRequest(res)){
                this.reuseFormVisible = false;
                this.$notification['success']({
                  message:'已添加'
                })
                this.loadMenu();
              }
            })
          }

        }

      })
    }


  }
}
</script>

<style scoped>
.iconSelect {
  /*
    overflow-y: auto;
  */
}
</style>