import request from "@/utils/request";

export function listUser(params){
  return request({
    url:'/base-server/baseUser/listUser',
    method:'get',
    params:params
  });
}

export function updateUser(data){
  return request({
    url:'/base-server/baseUser/update',
    method:'post',
    data:data
  })
}

export function createUser(data){
  return request({
    url:'/base-server/baseUser/newUser',
    method:'post',
    data:data
  })
}

export function getRoleByUserId(userId){
  return request({
    method:'get',
    url:'/base-server/baseUser/getRolesByUserId',
    params:{userId}
  })
}

export function updateUserAndPermission(data){
  return request({
    url:'/base-server/baseUser/updateUserAndRoles',
    method:'post',
    data:data
  })
}