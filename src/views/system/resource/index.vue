<template>
  <div>
    <a-card>
      <a-form :form="searchForm" layout="inline" hide-required-mark>
        <a-form-item label="资源名称">
          <a-input v-decorator="[  'resourceName', ]"/>
        </a-form-item>
        <a-form-item label="所属服务器ID">
          <a-input v-decorator="[  'serviceId',]"/>
        </a-form-item>
        <a-form-item label="请求路径">
          <a-input v-decorator="[
                  'path',
                ]"/>
        </a-form-item>
        <a-form-item label="请求路径">
          <a-button type="primary" @click="loadResources(searchForm.getFieldsValue())">查询</a-button>
        </a-form-item>
        <a-form-item label="请求路径">
          <a-button type="primary" @click="()=>{this.addVisible=true;this.addForm.resetFields()}">添加</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px;">
      <a-table style="height:600px;overflow-y: auto" :pagination="pager" :row-key="record=>record.resourceId"
               :columns="resourceColumns" @change="filterTable" :data-source="resources">
        <div slot="icon" slot-scope="record">
          <a-icon :type="record.icon"/>
        </div>
        <div slot="action" slot-scope="text,record">
          <a-button type="link" @click="openEdit(record)">编辑</a-button>
        </div>
      </a-table>
    </a-card>

    <div>
      <a-drawer title="添加资源" :visible="addVisible" width="40%" @close="addVisible=false">
        <a-form :form="addForm" layout="vertical" hide-required-mark>
          <a-form-item label="资源名称">
            <a-input v-decorator="[
                  'resourceName',
                  {
                    rules: [{ required: true, message: '资源名称必填' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="所属服务器ID">
            <a-input v-decorator="[
                  'serviceId',
                  {
                    rules: [{ required: true, message: '资源服务器必填' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="权限标识">
            <a-input v-decorator="[
                  'authority',
                  {
                    rules: [{ required: true, message: '权限标识不能为空' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="请求路径">
            <a-input v-decorator="[
                  'path',
                  {
                    rules: [{ required: true, message: '请求路径必填' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="是否认证">
            <a-switch v-decorator="['needAuth', { valuePropName: 'checked' }]"/>
          </a-form-item>
          <a-form-item label="是否对外">
            <a-switch v-decorator="['isPublic', { valuePropName: 'checked' }]"/>
          </a-form-item>
          <a-form-item>
            <a-button @click="save" type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>

    <div>
      <a-drawer title="修改资源" :visible="editVisible" width="40%" @close="editVisible=false">
        <a-form :form="editForm" layout="vertical" hide-required-mark>
          <a-form-item label="资源名称">
            <a-input v-show="false" style="width: 200px;" v-decorator="[
                  'resourceId',
                ]"/>
            <a-input v-decorator="[
                  'resourceName',
                  {
                    rules: [{ required: true, message: '资源名称必填' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="所属服务器ID">
            <a-input v-decorator="[
                  'serviceId',
                  {
                    rules: [{ required: true, message: '资源服务器必填' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="权限标识">
            <a-input v-decorator="[
                  'authority',
                  {
                    rules: [{ required: true, message: '权限标识不能为空' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="请求路径">
            <a-input v-decorator="[
                  'path',
                  {
                    rules: [{ required: true, message: '请求路径必填' }],
                  },
                ]"/>
          </a-form-item>
          <a-form-item label="是否认证">
            <a-switch v-decorator="['needAuth', { valuePropName: 'checked' }]"/>
          </a-form-item>
          <a-form-item label="是否对外">
            <a-switch v-decorator="['isPublic', { valuePropName: 'checked' }]"/>
          </a-form-item>
          <a-form-item label="可用状态">
            <a-switch v-decorator="['status', { valuePropName: 'checked' }]"/>
          </a-form-item>
          <a-form-item>
            <a-button @click="editResource" type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import {listResources, saveResource, updateResource} from '@/api/system/resources'
import {setFormInitValue} from "@/utils/antComponentUtil";

const columns = [
  {
    title: '资源服务器',
    key: 'resourceServerName',
    dataIndex: "resourceServerName"
  },
  {
    title: '服务器id',
    key: 'serviceId',
    dataIndex: "serviceId"
  },
  {
    title: '资源接口名称',
    dataIndex: 'resourceName',
    key: 'resourceName',
  },
  {
    title: 'api接口',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: '外部是否可访问',
    dataIndex: 'isPublic',
    key: 'isPublic',
    customRender(text) {
      return text === 1 ? '公开接口' : '内部'
    }
  },
  {
    title: '是否需要认证',
    key: 'needAuth',
    dataIndex: 'needAuth',
    customRender(text) {
      return text === 1 ? '需要' : '不需要'
    }
  },
  {
    title: '权限标识',
    dataIndex: 'authority',
    key: 'authority'
  },

  {
    title: '操作',
    key: 'action',
    scopedSlots: {customRender: 'action'}
  }
];


export default {
  name: 'resource',
  data() {
    return {
      resources: [],
      resourceColumns: columns,
      searchForm: this.$form.createForm(this),
      editVisible: false,
      addVisible: false,
      editForm: this.$form.createForm(this),
      addForm: this.$form.createForm(this),
      pager: {
        pageSize: 10
      }
    }
  },
  mounted() {
    this.loadResources({});
  },
  methods: {
    loadResources(params) {
      listResources(params).then(res => this.resources = res.data);
    },
    filterTable(pagination, filters, sort, {datasource}) {
      this.pager = pagination;
    },
    openEdit(record) {
      this.editVisible = true;
      this.editForm.resetFields();
      setFormInitValue(this.editForm,{
        "resourceId":record.resourceId,
        "path":record.path,
        "authority":record.authority,
        "resourceName":record.resourceName,
        "serviceId":record.serviceId,
        "isPublic":record.isPublic === 1,
        "needAuth":record.needAuth === 1,
        "status":record.status === 1
      });
    },
    editResource() {
      this.editForm.validateFields((err, values) => {
        if (!err) {
          updateResource({
            ...values, isPublic: values.isPublic ? 1 : 0, needAuth: values.needAuth ? 1 : 0,
            status: values.status ? 1 : 0
          }).then(res => {
            if (this.isSuccessRequest(res)) {
              this.loadResources(this.searchForm.getFieldsValue());
              this.$notification['success']({
                message: '已修改'
              });
              this.editVisible = false;
            }
          })
        }
      })
    },
    save() {
      this.addForm.validateFields((err, values) => {
        if (!err) {
          saveResource({...values, isPublic: values.isPublic ? 1 : 0, needAuth: values.needAuth ? 1 : 0}).then(res => {
            if (this.isSuccessRequest(res)) {
              this.loadResources(this.searchForm.getFieldsValue());
              this.$notification['success']({
                message: '已添加'
              });
              this.addVisible = false;

            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>