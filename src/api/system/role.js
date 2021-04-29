import request from "@/utils/request";


export function listRoles(){
  return request({
    url:'/base-server/baseRole/list',
    method:'get'
  })
}