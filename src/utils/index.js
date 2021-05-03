/**
 * key
 * @param Arr
 * @param key
 */
export function delArrElement(Arr,key,value){
if(!Arr||Arr.length==0){
  return;
}
let val = Arr[0];
  if(typeof(val)=="object"){
    let objectIndex = -1;
    for (let i = 0; i < Arr.length; i++) {
      if(objectIndex!=-1){
        break;
      }
      for (const eKey in Arr[i]) {
        if(eKey===key){
          if(Arr[i][eKey]==value){
            objectIndex =  i;
            break;
          }
        }
      }
    }
    if(objectIndex!=-1){
      Arr.splice(objectIndex,1)
    }
    return;
  }
 let index =  Arr.indexOf(key);
  if(index!=-1){
    Arr.splice(index,1);
  }

}


export function findElementInTreeArr(arr,key,value,childrenKey){
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if(item[key]==value){
      return item;
    }
    const children = item[childrenKey];
    if(children&&children.length){
      const e = findElementInTreeArr(children,key,value);
      if(e){
        return  e;
      }
    }
  }
  return null;
}


export function listToTree(list,tree,pid,idProp,pidProp){
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item[pidProp] === pid) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item[idProp],idProp,pidProp)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}