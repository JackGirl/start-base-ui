import request from "@/utils/request";

export function listMenus(){
  return request({
    url:'/base-server/baseMenu/list',
    method:'get'
  })
}