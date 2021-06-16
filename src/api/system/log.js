import request from "@/utils/request";

export function logList(queryParams){
  return request({
    url:'/base-server/gateway/list',
    params:queryParams
  })
}