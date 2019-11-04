"use strict "
function a (str) {
  let ary = str.split('.')
  let temp = []
  let tempStr = ['00','00','00','00','00','00']//tempStr 可以传模板
  for(let i = 0; i < ary.length; i++){
    tempStr[i] = ary[i];
    if(ary[i]==="00")return temp;
    temp.push(tempStr.join('.'));
  }
  return temp
}

console.log(a('01.08.00.00.00'))
