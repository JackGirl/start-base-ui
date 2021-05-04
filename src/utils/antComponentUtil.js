/**
 * 对象数组装成checkbox label 数组
 * @param arr
 * @param labelKey
 * @param valueKey
 */
export function convertToLabelArr(arr,labelKey,valueKey){
  return   arr.map(item=>{
    return{
      label:item[labelKey],
      value:item[valueKey]
    }
  })
}

