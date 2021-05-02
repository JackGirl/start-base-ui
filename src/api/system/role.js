import request from "@/utils/request";


export function listRoles(){
  return request({
    url:'/base-server/baseRole/list',
    method:'get'
  })
}

/**
 * 获取角色的菜单
 */
export function listRoleMenu(roleId){
  return request({
    url:'/base-server/baseRole/roleMenus',
    method:'get',
    params:{roleId}
  })
}

/**
 * 修改角色菜单 action
 */
export function updateRoleMenu(data){
  return request({
    url:'/base-server/baseRole/updateRoleMenu',
    method:'post',
    data:data
  })
}

export function newRole(data){
  return request({
    url:'/base-server/baseRole/newRole',
    method:'post',
    data:data
  })
}