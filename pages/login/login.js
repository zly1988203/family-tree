// pages/login/login.js
import {
  extendObj, is_empty, doPost
} from "../../utils/util.js"
const app = getApp()
var commonMixin = require('../../utils/commonMixin.js')
const config = require("../../config.js")
Page(Object.assign({
  
  /**
   * 页面的初始数据
   */
  data: {
    logo: config.baseOss + "/attachment/images/logo.png",
    backUrl:"../home/home",
    frameName:"login",
    icon_phone: config.baseOss + "/attachment/images/phone-icon.png",
    icon_pwd: config.baseOss + "/attachment/images/pwd-icon.png",
    login_form:{
      userName:"",
      pwd:"",
      bindAccount: [{ value: "wechat", checked: true, text:"帐号与微信绑定"}]
    },
    forgot_form: {
      userName: "",
      verify: "",
      verifyTime:0
    },
    alert:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var _this = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]?pages[pages.length - 2].route:'';
    _this.setData({
      backUrl: (typeof (prevPage) == "string" && prevPage.indexOf("/welcome/welcome/") != -1 && prevPage.indexOf("/login/login/") != -1)? prevPage:"",
      alert: _this.selectComponent("#alert")
    })
  },
  loginSubmit:function(e){
    var _this = this;
    var type = e.currentTarget.dataset.type
    type = type ? type : 1;
    //暂无登录逻辑，直接跳转index
    if (is_empty(app.globalData.userInfo.openid)) {
      app.getUserInfo()
      wx.showToast({
        title: "获取微信ID失败，请重试",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (is_empty(_this.data.login_form.userName)) {
      _this.data.alert.tips("请输入帐号",2000)
      return false;
    }
    if (is_empty(_this.data.login_form.pwd)) {
      _this.data.alert.tips("请输入密码", 2000)
      return false;
    }
    _this.data.alert.loading("登录中，请等待...", "icon5")
    var Params = {
      'openId': app.globalData.userInfo.openid,
      'username': _this.data.login_form.userName,
      'password': _this.data.login_form.pwd,
      'bindFlag': _this.data.login_form.bindAccount[0].checked?1:0
    }
    if (type == 1) {
      doPost('/wx/user/loginByAccount', Params, function (res) {
        if (res.code == 0) {
          var ulen = res.data.userList.length;
          if (ulen == 1) {
            var userinfo = res.data.userList[0];
            app.globalData.userInfo = extendObj([{}, app.globalData.userInfo, {
              userid: userinfo.id,
              familyid: userinfo.familyId,
              nickName: userinfo.name,
              account: userinfo.account,
              mobile: userinfo.mobile,
              avatarUrl: userinfo.headImg ? userinfo.headImg : app.globalData.userInfo.avatarUrl,
              childOrder:userinfo.childOrder,
            }])
            wx.redirectTo({
              url: _this.data.backUrl ? _this.data.backUrl : "../home/home"
            })
          } else if (ulen > 1) {
            var list = [];
            for (var i = 0; i < ulen; i++) {
              var userinfo = res.data.userList[i];
              list.push({
                id: userinfo.id,
                name: userinfo.name,
                data: userinfo
              })
            }
            _this.data.alert.list({
              data: list,
              callback: function (obj) {
                if (Params.bindFlag == 1) {
                  //绑定帐号
                  doPost('/wx/user/bindAccount', { 'openId': Params.openId, 'id': obj.id, bindFlag: Params.bindFlag }, function (res) {
                    if (res.code == 0) {
                      app.globalData.userInfo = extendObj([{}, app.globalData.userInfo, {
                        userid: obj.data.id,
                        familyid: obj.data.familyId,
                        nickName: obj.data.name ? obj.data.name : app.globalData.userInfo.nickName,
                        account: obj.data.account,
                        mobile: obj.data.mobile,
                        avatarUrl: obj.data.headImg ? obj.data.headImg : (app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : config.baseOss + "/attachment/images/avatar-none.png"),
                      }])
                      wx.redirectTo({
                        url: _this.data.backUrl ? _this.data.backUrl : "../home/home"
                      })
                    } else {
                      _this.data.alert.tips(res.msg, 2000)
                    }
                  })
                } else {
                  app.globalData.userInfo = extendObj([{}, app.globalData.userInfo, {
                    userid: obj.data.id,
                    familyid: obj.data.familyId,
                    nickName: obj.data.name ? obj.data.name : app.globalData.userInfo.nickName,
                    account: userinfo.account,
                    mobile: userinfo.mobile,
                    avatarUrl: obj.data.headImg ? obj.data.headImg : (app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl : config.baseOss + "/attachment/images/avatar-none.png"),
                  }])
                  wx.redirectTo({
                    url: _this.data.backUrl ? _this.data.backUrl : "../home/home"
                  })
                }
              }
            })
          } else {
            _this.data.alert.tips("帐号出错啦！", 2000)
          }
        } else {
          _this.data.alert.tips(res.msg, 2000)
        }
      })
    } else {
      _this.data.alert.tips("服务商登陆功能建设中", 2000)
    }
  },
  forgotSubmit: function (e) {
    var _this = this;
  },
  getVerify: function () {
    var _this = this;
    if (_this.data.forgot_form.verifyTime == 0) {
      //发送验证码
      //倒计时
      _this.setData({
        ["forgot_form.verifyTime"]: 120
      })
      _this.tickCount();
    }
  },
  tickCount:function(){
    var _this = this;
    if (_this.data.forgot_form.verifyTime>0){
      setTimeout(function(){
        _this.setData({
          ["forgot_form.verifyTime"]: _this.data.forgot_form.verifyTime-1
        })
        _this.tickCount();
      },1000)
    }
  },
  changeFrame: function (e) {
    var _this = this;
    var id = e.currentTarget.dataset.id;
    var userName_form = "forgot_form.userName";
    var userName_value = "";
    if (id == "login") {
      userName_form = "login_form.userName";
      userName_value = _this.data.forgot_form.userName;
    } else {
      userName_form = "forgot_form.userName";
      userName_value = _this.data.login_form.userName;
    }
    _this.setData({
      frameName:id,
      [userName_form]: userName_value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  //onShareAppMessage: function () {

  //}
}, commonMixin))