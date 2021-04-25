<template>
  <div>
    <a-row :gutter="10">
      <a-col span="24" :xl="14">
        <a-card style="margin-top: 20px">
          <a-table :columns="menuColumns" :data-source="menuData" :rowSelection="menuRowSelection">
            <div slot="action" slot-scope="record">
            </div>
          </a-table>
        </a-card>
        </a-col>
      <a-col span="24" :xl="10">
          <a-card style="margin-top: 20px">
            <a-table :columns="actionColumns" :data-source="actionData">
              <div slot="action" slot-scope="record">
              </div>
            </a-table>
          </a-card>
      </a-col>
    </a-row>

  </div>
</template>

<script>
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
    dataIndex:'icon',
    key:'icon'
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
    scopeSlots:{customRender:'action'}
  }
];

const actionColumns = [
    {
    title:'操作名',
    dataIndex:'actionName',
    key:'actionName',
  },
  {
    title:'操作权限值',
    dataIndex:'actionValue',
    key:'actionValue',
  },
  {
    title:'操作',
    key:'action',
    scopeSlots:{customRender:'action'}
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
      menuRowSelection:{
        type:'radio',
        onChange(key,row){}
      }
    }
  },
  mounted() {

  },
  methods:{
    loadMenu(){

    }
  }
}
</script>

<style scoped>

</style>