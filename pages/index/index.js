import {
  extendObj,is_empty
} from "../../utils/util.js"
const config = require("../../config.js")
var commonMixin = require('../../utils/commonMixin.js')
//index.js
//获取应用实例
const app = getApp()

Page(Object.assign({
  data: {
    baseOss: config.baseOss,
    userInfo: {},
    text:[]
  },
  onLoad: function () {
    var _this = this;
    _this.selectComponent("#nav-bar").active("me")
    //if (is_empty(app.globalData.userInfo.userid)) {
    //  wx.redirectTo({
    //    url: '../login/login'
    //  })
    //}
  },
  onShow: function(){
    var _this = this;
    _this.setData({
      userInfo:app.globalData.userInfo
    })
    if (is_empty(app.globalData.userInfo.userid)) {
      _this.setData({
        userInfo: extendObj([{},_this.data.userInfo,{account:"游客"}])
      })
    }
  },
  noAvatar:function(){
    var _this = this;
    _this.setData({
      ["userInfo.avatarUrl"]: config.baseOss + "/attachment/images/avatar-none.png"
    })
    app.globalData.userInfo.avatarUrl = config.baseOss + "/attachment/images/avatar-none.png"
  },
  logout:function(){
    app.globalData.userInfo.userid = "";
    app.globalData.userInfo.account = "";
    app.globalData.userInfo.mobile = "";
    app.globalData.userInfo.nickName = "";
    //app.globalData.userInfo.avatarUrl = "";
    wx.redirectTo({
      url: '../login/login'
    })
  }
}, commonMixin))