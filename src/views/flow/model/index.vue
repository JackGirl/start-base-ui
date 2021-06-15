<template>
<div>
  <a-card>
    <a-form :form="searchForm" layout="inline" hide-required-mark>
      <a-form-item label="模型名称">
        <a-input v-decorator="[  'modelName', ]"/>
      </a-form-item>
      <a-form-item label="模型key">
        <a-input v-decorator="[  'modelKey', ]"/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="createRoleVisible=true">新建流程模型</a-button>
      </a-form-item>
    </a-form>
  </a-card>
  <a-card style="margin-top: 20px">
    <a-table :data-source="modelData" bordered :columns="modelColumns">

    </a-table>
  </a-card>

</div>
</template>

<script>
import {listModel} from "@/api/flow/model";

const columns = [
  {
    title: '模型id',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: '模型名称',
    key: 'name',
    dataIndex: 'name',
  },
  {
    title: '模型key',
    key: 'key',
    dataIndex: 'key',
  },
  {
    title: '模型分类',
    key: 'category',
    dataIndex: 'category',
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '版本',
    key: 'version',
    dataIndex: 'version',
  },
  {
    title: '元数据',
    key: 'metaInfo',
    dataIndex: 'metaInfo',
  },
];

export default {
  name: "index",
  data(){
    return{
      searchForm:this.$form.createForm(this),
      modelData:[],
      modelColumns:columns
    }
  },
  mounted() {
    listModel().then(res=>this.modelData = res.data.records);
  }
}
</script>

<style scoped>

</style>