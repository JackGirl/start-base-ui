<template>
  <div>
    <a-card title="搜索" >
      <a-form-model layout="inline" :model="search"  :pagination="pager" >
        <a-form-model-item label="用户名">
          <a-input v-model="search.name" />
        </a-form-model-item>
        <a-form-model-item >
          <a-button type='primary'  >查询</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-table :columns="columns" :data-source="data">
        <div slot="action" slot-scope="record">
        </div>
      </a-table>
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    title:'账号',
    dataIndex:'account',
    key:'account'
  },
  {
    title:'用户名',
    dataIndex:'username',
    key:'username'
  },
  {
    title:'备注',
    dataIndex:'remark',
    key:'remark'
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
    title:'账号锁定',
    dataIndex:'accountLocked',
    key:'accountLocked',
    customRender(text){
      return text==1?'是':'否'
    }
  },
  {
    title:'是否启用',
    dataIndex:'enable',
    key:'enable',
    customRender(text){
      return text==1?'是':'否'
    }
  },
  {
    title:'操作',
    key:'action',
    scopeSlots:{customRender:'action'}
  }
];
export default {
  name: 'user',
  data(){
    return{
      search:{
        name:''
      },
      data:[],
      columns:columns
    }
  },
  mounted() {

  },
  methods:{
    loadUser(){

    }
  }
}
</script>

<style scoped>

</style>