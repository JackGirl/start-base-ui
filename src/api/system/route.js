import request from "@/utils/request";

export function listServer(params){
  return request({
    method:'get',
    url:'/base-server/baseResourceServer/loadResourceServers',
    params:params
  })
}


export function updateResourceServer(data){
  return request({
    method:'post',
    url:'/base-server/baseResourceServer/updateResourceServer',
    data:data
  })
}


export function addResourceServer(data){
  return request({
    method:'post',
    url:'/base-server/baseResourceServer/addResourceServer',
    data:data
  })
}