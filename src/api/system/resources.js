import request from "@/utils/request";

export function listResources(params){
  return request({
    url:'/base-server/baseResource/list',
    params:params,
    method:'get'
  })
}

export function saveResource(data){
  return request({
    url:'/base-server/baseResource/createResource',
    method:'post',
    data:data
  })
}

export function updateResource(data){
  return request({
    url:'/base-server/baseResource/edit',
    method:'post',
    data:data
  })
}