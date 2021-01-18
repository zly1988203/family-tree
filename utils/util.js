const config = require("../config.js")
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const inputgetName = (e)=>{
  let name = e.currentTarget.dataset.name;
  let nameMap = {}
  if (name.indexOf('.')) {
    let nameList = name.split('.')
    if (this.data[nameList[0]]) {
      nameMap[nameList[0]] = this.data[nameList[0]]
    } else {
      nameMap[nameList[0]] = {}
    }
    nameMap[nameList[0]][nameList[1]] = e.detail.value
  } else {
    nameMap[name] = e.detail.value
  }
  this.setData(nameMap)
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const cloneObj = oldObj =>{ //复制对象方法
  if (typeof (oldObj) != 'object') return oldObj
  if (oldObj == null) return oldObj
  var newObj = new Object()
  for (var i in oldObj)
    newObj[i] = cloneObj(oldObj[i])
  return newObj
}
const is_number = (num)=>{
  if (typeof (num) == "number") return true;
  if (typeof (num) == "string") return (/^(\-|\+?)[0-9]+.?[0-9]*$/).test(num);
  return false;
}
const extendObj = (objarr) => { //扩展对象
  if (objarr.length < 1) return null
  if (objarr.length < 2) return objarr[0]
  var temp = cloneObj(objarr[0]); //调用复制对象方法
  for (var n = 1; n < objarr.length; n++) {
    for (var i in objarr[n]) {
      temp[i] = objarr[n][i]
    }
  }
  return temp;
}
const is_empty = (obj)=> {
  if (typeof (obj) == "undefined") return true;
  if (obj == null) return true;
  if (typeof (obj) == "string") {
    if (obj.trim() == "") return true;
  }
  if (typeof (obj) == "object") {
    var tem_str = JSON.stringify(obj);
    if (tem_str == "{}") return true;
    if (tem_str == "[]") return true;
  }
  return false;
}
const doPost=(url,params,func_callback)=>{
  var re = {
    code:-1,
    msg:"",
    data:null
  }
  if (!is_empty(url) && typeof (url) == "string") {
    console.log('start_post',config.baseUrl + url);
    wx.request({
      url: config.baseUrl + url, //此处填写第三方的接口地址
      data: is_empty(params) ? "" : (typeof (params) == "object" ? JSON.stringify(params) : (typeof (params) == "string" ?params:"")),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        if (res.statusCode == 200) {
          re.data = res.data.data
          if (res.data.errno == 0) {
            re.code = 0
          } else {
            console.log('post_recive_err', { url: config.baseUrl + url, post: params, res: res.data });
            re.msg = res.data.errmsg
          }
        }else {
          console.log('post_server_err', { url: config.baseUrl + url, post: params, res: res });
          re.msg = res.errMsg +"，statusCode："+ res.statusCode
        }
        if (func_callback instanceof Function) {
          func_callback(re)
        }
      },
      fail: function (res) {
        if (func_callback instanceof Function) {
          re.msg = res.errMsg
          func_callback(re)
        }
      }
    })
  }else{
    if (func_callback instanceof Function){
      re.msg = "请输入请求地址"
      func_callback(re)
    }
  }
}
const isJsonString = (str)=>{
  if (!is_empty(str) && typeof (str) == "string") {
    try {
      if (typeof JSON.parse(str) == "object") {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}
const doUpload = (url, name, tmpPath, params, func_callback) => {
  var re = {
    code: -1,
    msg: "",
    data: null
  }
  if (!is_empty(url) && typeof (url) == "string" && !is_empty(name) && typeof (name) == "string" && !is_empty(tmpPath) && typeof (tmpPath) == "string") {
    console.log('start_upload', config.baseUrl + url);
    wx.uploadFile({
      url: config.baseUrl + url, //路径
      filePath: tmpPath,
      name: name,
      formData: is_empty(params) ? {} : (typeof (params) == "object" ? params : (isJsonString (params) ? JSON.parse(params) : {})),
      success(res) {
        if (res.statusCode == 200) {
          var data = JSON.parse(res.data)
          re.data = data.data
          if (data.errno == 0) {
            re.code = 0
          } else {
            console.log('post_recive_err', { url: config.baseUrl + url, post: params,file:{name:name,path:tmpPath}, res: data });
            re.msg = data.errmsg
          }
        } else {
          console.log('post_server_err', { url: config.baseUrl + url, post: params, file: { name: name, path: tmpPath }, res: res });
          re.msg = res.errMsg + "，statusCode：" + res.statusCode
        }
        if (func_callback instanceof Function) {
          func_callback(re)
        }
      },
      fail(e) {
        if (func_callback instanceof Function) {
          re.msg = res.errMsg
          func_callback(re)
        }
      }
    })
  } else {
    if (func_callback instanceof Function) {
      re.msg = "上传地址、文件名称、路径都不能为空"
      func_callback(re)
    }
  }
}
const createOrder = (func_callback) => {

}
const getPayInfo = (func_callback) => {

}
//设置页面分享信息
function sharePage(title,id) {
  let _this = this;
  return {
    title: title,
    imageUrl: "https://miniprogram.mmxp5000.com/attachment/images/share_image.png",
    path: "/pages/extraction_code/extraction_code?id=" + id,
  }
}
//复制文本
function copy_code(data) {
  wx.setClipboardData({
    data: data,
    success: function (res) {

    }
  })
}
//获取字符长度数字算半个字符
function getCharLength(str){
  var re = 0;
  str = ""+str;
  var len = str.length
  for(var i = 0;i<len;i++){
    var char = str.charAt(i)
    if (char.match(/[^\x00-\xff]/ig) != null) {
      re += 1;
    }
    else {
      re += 0.65;
    }
  }
  return re
}
//弹出框
function showToast(title,icon,duration){
  if (!is_empty(title)) {
    icon = is_empty(icon) ? 'none' : icon
    duration = is_empty(duration) ? 2000 : duration
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  }
}
Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "H+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S": this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
const formatDate = (format_str)=>{
  if (!is_empty(format_str)) {
    return new Date().Format(format_str);
  }else{
    return ""
  }
}
module.exports = {
  formatTime: formatTime,
  extendObj: extendObj,
  cloneObj: cloneObj,
  is_empty: is_empty,
  is_number: is_number,
  inputgetName: inputgetName,
  doPost: doPost,
  sharePage: sharePage,
  copy_code: copy_code,
  getCharLength: getCharLength,
  isJsonString: isJsonString,
  doUpload: doUpload,
  showToast: showToast,
  createOrder: createOrder,
  getPayInfo: getPayInfo,
  formatDate: formatDate
}