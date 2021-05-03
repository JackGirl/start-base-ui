import request from "@/utils/request";

export function listMenus(){
  return request({
    url:'/base-server/baseMenu/list',
    method:'get'
  })
}


export function updateMenu(data){
  return request({
    url:'/base-server/baseMenu/update',
    method:'post',
    data:data
  })
}

export function createMenu(data){
  return request({
    url:'/base-server/baseMenu/newMenu',
    method:'post',
    data:data
  })
}

/**
 * 删除 包括子集
 * @param menuId
 * @returns {AxiosPromise}
 */
export function removeMenu(menuId){
  return request({
    url:'/base-server/baseMenu/update',
    method:'post',
    params:{menuId}
  })
}