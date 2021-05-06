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

export function listAppAuthorities(appId){
  return request({
    url:'/base-server/baseApp/listAppAuthorities',
    method:'get',
    params: {appId}
  })
}

export function updateAppAuthority({relationId,expireTime}){
  return request({
    url:'/base-server/baseApp/updateAppAuthority',
    method:'post',
    params: {relationId,expireTime}
  })
}


export function addAppAuthorities({appId,authorities}){
  return request({
    url:'/base-server/baseApp/addAppAuthorities',
    method:'post',
    params: {appId,authorities}
  })
}

export function removeAppAuthorities(relationIds){
  return request({
    url:'/base-server/baseApp/removeAppAuthorities',
    method:'post',
    params: {relationIds}
  })
}