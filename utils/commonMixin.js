//给页面/组件扩展一些公共方法，以增强代码复用
//在页面扩展:Page(Object.assign({...},commonMixin))，在组件扩展methods:Object.assign({...},commonMixin)
import {
  extendObj, is_empty, doPost
} from "./util.js"
const config = require("../config.js")
const app = getApp()
const getCheckBoxValue=(_d,_s)=>{
  if (typeof (_d) == "object") {
    var clen = _d.length;
    for (var i = 0; i < clen; i++) {
      var vlen = _s.length
      var checked = false;
      for (var j = 0; j < vlen; j++) {
        if (typeof (_d[i]["value"]) != "undefined" && _d[i].value == _s[j]) {
          checked = true;
          break;
        }
      }
      if (typeof (_d[i]["checked"]) != "undefined") {
        _d[i].checked = checked;
      }
    }
  }
}

module.exports = {
  test(e){
    console.log(e.currentTarget);
  },
  alertBuild(){
    wx.showToast({
      title: '此功能正在建设中',
      icon: 'success',
      duration: 2000
    })
  },
  //使用方法，在必要的地方加上 bindtap="authRun" data-authed="funcAuthed" data-auth="funcAuth"
  //funcAuthed，权限判断成功后执行的函数
  //funcAuth，权限判断函数，传入参数有funcName、func_callback，权限判定成功后执行func_callback(true)，只有在回调函数参数为true才执行指定的权限成功函数
  authRun(e) {
    var _this = this;
    var func = e.currentTarget.dataset.authed;
    var auth = e.currentTarget.dataset.auth;
    if (_this[auth] instanceof Function) {
      _this[auth](func,function (result) {
        if (result) {
          if (_this[func] instanceof Function) {
            _this[func](e);
          } else {
            console.log("authRun_error", func + " is not a function.")
          }
        }
      });
    }
  },
  //检查权限配合authRun函数的基本格式funcCheck(funcName,func_callback)，可以做为样例
  checkUser(funcName,func_callback) {
    if (is_empty(app.globalData.userInfo.userid)) {
      wx.showModal({
        title: '提示',
        confirmText: "登录",
        confirmColor: "#ebb450",
        content: '需要登录才能进行操作，立即登录？',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../login/login'
            })
          }
        }
      })
    } else {
      if (func_callback instanceof Function) {
        func_callback(true);
      }
    }
  },
  doNav: function (e) {
    var url = e.currentTarget.dataset.url;
    if (!is_empty(url)) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  changeNumber(e) {
    var name = e.currentTarget.dataset.name;
    var type = e.currentTarget.dataset.type;
    var nameMap = {}
    var tval = 1
    if (name.indexOf('.')) {
      var nameList = name.split('.')
      if (this.data[nameList[0]]) {
        nameMap[nameList[0]] = this.data[nameList[0]]
        tval = this.data[nameList[0]][nameList[1]] ? parseInt(this.data[nameList[0]][nameList[1]]):0;
      } else {
        nameMap[nameList[0]] = {}
      }
      if (type == "sub") {
        if (nameMap[nameList[0]][nameList[1]]>1){
          nameMap[nameList[0]][nameList[1]] = tval - 1
        }
      } else if (type == "add") {
        nameMap[nameList[0]][nameList[1]] = tval + 1
      }
    } else {
      tval = this.data[name] ? parseInt(this.data[name]) : 0;
      if (type == "sub") {
        nameMap[name] = tval - 1
      } else if (type == "add") {
        nameMap[name] = tval + 1
      }
    }
    this.setData(nameMap)
  },
  inputgetName(e) {
    var name = e.currentTarget.dataset.name;
    var type = e.currentTarget.dataset.type ? e.currentTarget.dataset.type+"":"input";
    var nameMap = {}
    var currentMap = null;
    type = type.toLowerCase();
    if (name.indexOf('.')) {
      var nameList = name.split('.')
      if (this.data[nameList[0]]) {
        nameMap[nameList[0]] = this.data[nameList[0]]
      } else {
        nameMap[nameList[0]] = {}
      }
      switch (type) {
        case "input":
          nameMap[nameList[0]][nameList[1]] = e.detail.value
          break;
        case "checkbox":
          getCheckBoxValue(nameMap[nameList[0]][nameList[1]], e.detail.value)
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case "input":
          nameMap[name] = e.detail.value
          break;
        case "checkbox":
          getCheckBoxValue(nameMap[name], e.detail.value)
          break;
        default:
          break;
      }
    }
    this.setData(nameMap)
  }
}