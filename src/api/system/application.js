import request from "@/utils/request";


export function listApplication(params){
  return request({
    url:'/base-server/baseApp/list',
    method:'get',
    params:params
  })
}


export function createApp(data){
  return request({
    url:'/base-server/baseApp/createApp',
    method:'post',
    data:data
  })
}


export function updateApp(data){
  return request({
    url:'/base-server/baseApp/update',
    method:'post',
    data:data
  })
}