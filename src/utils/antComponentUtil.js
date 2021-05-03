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


/**
 * 给表单元素设置默认值
 * @param form
 * @param valueMap
 */
export function setFormInitValue(form,valueMap){
  for (let valueMapKey in valueMap) {
    form.getFieldDecorator(valueMapKey, {initialValue: valueMap[valueMapKey]});
  }
}