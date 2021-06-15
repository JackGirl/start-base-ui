import request from "@/utils/request";


export function listModel(){
  return request({
    method:'get',
    url:'/activiti/model/list'
  })
}