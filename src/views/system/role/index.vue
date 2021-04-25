<template>
  <div>
    <a-card title="搜索" >
      <a-form-model layout="inline" :model="search"  :pagination="pager" >
        <a-form-model-item label="角色名">
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
    scopeSlots:{customRender:'action'}
  }
];
export default {
  name: 'role',
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
    loadRole(){

    }
  }
}
</script>

<style scoped>

</style>