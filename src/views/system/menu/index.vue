<template>
  <div>
        <a-card style="margin-top: 20px;height: 600px">
          <a-table :pagination="false" :row-key="record=>record.menuId" :columns="menuColumns" :data-source="menuData" >
            <div slot="icon" slot-scope="record">
              <a-icon :type="record.icon" />
            </div>
            <div slot="action" slot-scope="text,record">
              <a-button type="link" @click="openMenuEdit(record)">编辑</a-button>
            </div>
          </a-table>
        </a-card>
  </div>
</template>

<script>
import {listMenus} from "@/api/system/menu";

const columns = [
  {
    title:'菜单名',
    dataIndex:'menuName',
    key:'menuName'
  },
  {
    title:'路由地址',
    dataIndex:'path',
    key:'path'
  },
  {
    title:'链接类型',
    dataIndex:'target',
    key:'target',
    customRender(text){
      return text==='_blank'?'外部':'内部组件'
    }
  },
  {
    title:'图标',
    key:'icon',
    scopedSlots: {customRender :'icon'}
  },
  {
    title:'组件路径',
    dataIndex:'component',
    key:'component'
  },
  {
    title:'默认跳转',
    dataIndex:'redirect',
    key:'redirect',
  },
  {
    title:'操作',
    key:'action',
    scopedSlots:{customRender:'action'}
  }
];

const actionColumns = [
    {
    title:'接口名称',
    dataIndex:'resourceName',
    key:'resourceName',
  },
  {
    title:'接口路径',
    dataIndex:'path',
    key:'path',
  },
  {
    title:'资源服务器',
    key:'resourceServer',
    scopedSlots:{customRender:'resourceServer'}
  }
]
export default {
  name: 'user',
  data(){
    return{
      menuData:[],
      menuColumns:columns,
      actionColumns:actionColumns,
      actionData:[],

    }
  },
  mounted() {
    this.loadMenu();
  },
  methods:{
    loadMenu(){
        listMenus().then(res=>this.menuData = res.data);
    },
    openMenuEdit(menu){

    },
    openActionEdit(action){}
  }
}
</script>

<style scoped>

</style>