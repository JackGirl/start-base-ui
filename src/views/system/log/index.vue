<template>
  <div>
    <a-card>
      <a-form :form="searchForm" layout="inline" hide-required-mark>
        <a-form-item label="服务id">
          <a-input v-decorator="[  'serviceId', ]"/>
        </a-form-item>
        <a-form-item label="请求路径">
          <a-input v-decorator="[  'path', ]"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSearch" >查询</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-table :rowKey="record=>record.id" :loading="tableLoading" :data-source="logs" bordered :columns="logColumns" :pagination="pager"
               @change="changePage">

      </a-table>
    </a-card>

  </div>
</template>

<script>
import {logList} from "@/api/system/log";

const columns = [
  {
    title: '服务Id',
    key: 'serviceId',
    dataIndex: 'serviceId',
  },
  {
    title: 'path',
    key: 'path',
    dataIndex: 'path',
  },
  {
    title: 'ip',
    key: 'ip',
    dataIndex: 'ip',
  },
  {
    title: '请求方法',
    key: 'method',
    dataIndex: 'method',
  },
  {
    title: '用户设备',
    key: 'userAgent',
    dataIndex: 'userAgent',
  },
  {
    title: 'url参数',
    key: 'queryParam',
    dataIndex: 'queryParam',
  },

  {
    title: '请求时间',
    key: 'requestTime',
    dataIndex: 'requestTime',
  },
  {
    title: '响应时间',
    key: 'responseTime',
    dataIndex: 'responseTime',
  },
  {
    title: '响应状态',
    key: 'responseStatus',
    dataIndex: 'responseStatus',
  },

];


export default {
  name: "index",
  data(){
    return{
      searchForm:this.$form.createForm(this),
      logs:[],
      logColumns:columns,
      tableLoading:false,
    }
  },
  mounted() {
    this.loadLog(this.pager);
  },
  methods:{
    loadLog(params){
      this.tableLoading = true;
      logList(params).then(res=>{
        this.setPager(res)
        this.tableLoading = false;
        this.logs = res.data.records
      })
    },
    onSearch(){
      this.pager.current = 1;
      this.changePage(this.pager);
    },
    changePage(pagination) {
      console.info(pagination)
      this.pager = pagination;
      this.loadLog({...this.pager,...this.searchForm.getFieldsValue()})
    }
  }
}
</script>

<style scoped>

</style>