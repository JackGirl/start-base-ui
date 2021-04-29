import request from "@/utils/request";


export function listRoles(){
  return request({
    url:'/base-server/baseRole/list',
    method:'get'
  })
}

/**
 * 获取角色的菜单 和 actions
 */
export function rolePermission(roleId){
  return request({
    url:'/base-server/baseRole/rolePermission',
    method:'get',
    params:{roleId}
  })
}